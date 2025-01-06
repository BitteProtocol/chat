import {
  CoreAssistantMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
  convertToCoreMessages,
  generateId,
} from "ai";
import {
  SmartActionAiMessage,
  SmartActionMessage,
  SmartAction,
  SmartActionChat,
} from "../types";
import { kv } from "@vercel/kv";

export const convertToSmartActionMessages = ({
  messages,
  agentId,
}: {
  messages: Message[];
  agentId?: string;
}): SmartActionMessage[] => {
  const smartActionMessages = convertToCoreMessages(messages).map(
    (message, index) => ({
      ...message,
      id: messages[index]?.id,
      agentId,
    })
  );

  return smartActionMessages;
};

export const convertResponseMessages = (
  messages: (CoreAssistantMessage | CoreToolMessage)[],
  agentId?: string
): SmartActionMessage[] => {
  return messages.map((message) => ({
    ...message,
    id: generateId(),
    agentId,
  }));
};

export const getAgentIdFromMessage = (
  message: SmartActionAiMessage
): string | undefined => {
  const { annotations } = message;
  const agentIdAnnotation = annotations?.[0];

  if (agentIdAnnotation && typeof agentIdAnnotation === "object") {
    if (
      "agentId" in agentIdAnnotation &&
      typeof agentIdAnnotation.agentId === "string"
    ) {
      return agentIdAnnotation.agentId;
    }
  }
};

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message & { agentId?: string }>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
        annotations: message.agentId
          ? [{ agentId: message.agentId }]
          : undefined,
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<SmartActionMessage>
): Array<Message> {
  return messages.reduce<Array<Message>>((chatMessages, message) => {
    const annotations = message.agentId
      ? [{ agentId: message.agentId }]
      : undefined;

    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id || generateId(),
      role: message.role,
      content: textContent,
      toolInvocations,
      annotations,
    });

    return chatMessages;
  }, []);
}

export const getTypedToolInvocations = <TTools>(
  toolInvocation: ToolInvocation
) => {
  type ExecuteArgs<T> = T extends {
    execute: (
      args: infer A,
      options?: {
        abortSignal?: AbortSignal;
      }
    ) => unknown;
  }
    ? A
    : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ExecuteReturn<T> = T extends { execute: (...args: any) => infer R }
    ? Awaited<R>
    : never;

  type TypedToolInvocation = {
    [T in keyof TTools]: Omit<
      ToolInvocation,
      "toolName" | "args" | "result"
    > & {
      toolName: T;
      args: ExecuteArgs<TTools[T]>;
      result: ExecuteReturn<TTools[T]>;
    };
  }[keyof TTools];

  const toolName = toolInvocation.toolName as keyof TTools;

  if (toolInvocation.state === "result") {
    const result = toolInvocation.result as ExecuteReturn<
      TTools[typeof toolName]
    >;
    return { ...toolInvocation, toolName, result } as TypedToolInvocation;
  }

  return { ...toolInvocation, toolName } as TypedToolInvocation;
};

export const getSmartAction = async (
  id: string
): Promise<SmartAction | null> => {
  return await kv.get<SmartAction>(`smart-action:v1.0:${id}`);
};

export const getSmartActionMessages = async (
  id: string
): Promise<SmartActionMessage[]> => {
  return await kv.lrange<SmartActionMessage>(
    `smart-action:v1.0:${id}:messages`,
    0,
    -1
  );
};

export const getSmartActionChat = async (
  id: string
): Promise<SmartActionChat | null> => {
  const [details, messages] = await Promise.all([
    getSmartAction(id),
    getSmartActionMessages(id),
  ]);

  if (!details || !messages) {
    return null;
  }

  return {
    ...details,
    messages,
  };
};
