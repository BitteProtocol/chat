import {
  CoreAssistantMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
  generateId,
} from "ai";
import { SmartActionAiMessage, SmartActionMessage } from "../types";

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
