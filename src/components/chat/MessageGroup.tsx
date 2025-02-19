import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from "react"
import { getAgentIdFromMessage } from '../../lib/chat'
import { DEFAULT_AGENT_ID } from '../../lib/constants'
import { BITTE_BLACK_IMG } from "../../lib/images"
import { cn } from "../../lib/utils"
import type { BitteToolResult, SmartActionAiMessage } from "../../types/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card } from "../ui/card"
import { ImageWithFallback } from "../ui/ImageWithFallback"
import { SAMessage } from "./Message"

  // Function to remove ".vercel.app" from agentId
  export const formatAgentId = (agentId: string) => {
    return agentId.replace(".vercel.app", "");
  };
// Define component prop types for customization
interface MessageGroupComponentProps {
  message: SmartActionAiMessage
  isUser: boolean
  userName: string
  children: React.ReactNode
  style: {
    backgroundColor: string
    borderColor: string
    textColor: string
  }
}

interface ToolResultComponentProps {
  toolName: string
  result: any
  style: {
    borderColor: string
  }
}

interface MessageGroupProps {
  chatId?: string
  groupKey: string
  messages: SmartActionAiMessage[]
  accountId: string
  creator?: string
  isLoading?: boolean
  agentImage?: string
  agentName?: string
  messageBackgroundColor: string
  borderColor: string
  textColor: string
  addToolResult: (params: { toolCallId: string; result: BitteToolResult }) => void
  components?: {
    MessageContainer?: React.ComponentType<MessageGroupComponentProps>
    ToolResult?: React.ComponentType<ToolResultComponentProps>
  }
}

// Default components
const DefaultMessageContainer = ({ message, isUser, userName, children, style }: MessageGroupComponentProps) => (
  <Card
    className="bitte-p-6"
    style={{
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      color: style.textColor
    }}
  >
    <Accordion type="single" collapsible className="bitte-w-full">
      <AccordionItem value={message.id} className="bitte-border-0">
        <AccordionTrigger className="bitte-p-0">
          <div className="bitte-flex bitte-items-center bitte-justify-center bitte-gap-2">
            {isUser ? (
              <>
                <MessageSquare className="bitte-h-[18px] bitte-w-[18px]" />
                <p className="bitte-text-[14px]">{userName}</p>
              </>
            ) : (
              <>
                <ImageWithFallback
                  src={message.agentImage || "/placeholder.svg"}
                  fallbackSrc={BITTE_BLACK_IMG}
                  className={cn(
                    "bitte-h-[18px] bitte-w-[18px] bitte-rounded",
                    message.agentImage === BITTE_BLACK_IMG
                      ? "bitte-invert-0 bitte-dark:invert"
                      : "bitte-dark:bg-card-list"
                  )}
                  alt={`${message.agentId} icon`}
                />
                <p className="bitte-text-[14px]">
                  {formatAgentId(message.agentId ?? "Bitte Assistant")}
                </p>
              </>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent
          className="bitte-mt-6 bitte-border-t bitte-pb-0"
          style={{ borderColor: style.borderColor }}
        >
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
)

const DefaultToolResult = ({ toolName, result, style }: ToolResultComponentProps) => (
  <div>
    <div className="bitte-flex bitte-w-full bitte-items-center bitte-justify-between bitte-text-[12px]">
      <div>Tool Call</div>
      <div className="bitte-rounded bitte-bg-shad-white-10 bitte-px-2 bitte-py-1">
        <code>{toolName}</code>
      </div>
    </div>
    <div className="bitte-p-4">
      {/* Tool result rendering logic */}
    </div>
    <div
      className="bitte-mt-2 bitte-border-t"
      style={{ borderColor: style.borderColor }}
    />
  </div>
)

export const MessageGroup = ({
  groupKey,
  messages,
  accountId,
  creator,
  agentImage,
  messageBackgroundColor,
  borderColor,
  textColor,
  chatId,
  addToolResult,
  components = {}
}: MessageGroupProps) => {
  const {
    MessageContainer = DefaultMessageContainer,
    ToolResult = DefaultToolResult
  } = components

  const [messagesWithAgentId, setMessagesWithAgentId] = useState<SmartActionAiMessage[]>([])

  // Function to update agentId for each message
  const updateAgentIdForMessages = (
    incomingMessages: SmartActionAiMessage[]
  ) => {
    return incomingMessages.map((message) => {
      let agentId = message.agentId || getAgentIdFromMessage(message);
      if (!agentId) {
        agentId = DEFAULT_AGENT_ID;
      }
      // Check if the state already has an agentImage for this message
      const existingMessage = messagesWithAgentId?.find(
        (m) => m.id === message.id
      );
      const messageAgentImage =
        existingMessage?.agentImage || agentImage || BITTE_BLACK_IMG;
      return { ...message, agentId, agentImage: messageAgentImage };
    });
  };

  // Update messages with agentId whenever new messages arrive
  useEffect(() => {
    const updatedMessages = updateAgentIdForMessages(messages);
    setMessagesWithAgentId(updatedMessages);
  }, [messages]);

  // Function to remove ".vercel.app" from agentId
  const formatAgentId = (agentId: string) => {
    return agentId.replace(".vercel.app", "");
  };

  return (
    <div style={{ color: textColor }}>
      {messagesWithAgentId?.map((message, index) => {
        const isUser = message.role === "user"
        const userName = creator || accountId

        return (
          <MessageContainer
            key={`${message.id}-${index}`}
            message={message}
            isUser={isUser}
            userName={userName}
            style={{
              backgroundColor: messageBackgroundColor,
              borderColor: borderColor,
              textColor: textColor
            }}
          >
            <div className="bitte-mt-6 bitte-flex bitte-w-full bitte-flex-col bitte-gap-2">
              {message.content && (
                <div className="bitte-flex bitte-flex-col bitte-gap-4">
                  <SAMessage content={message.content} />
                </div>
              )}

              {message.toolInvocations?.map((toolInvocation, index) => (
                <ToolResult
                  key={`${toolInvocation.toolCallId}-${index}`}
                  toolName={toolInvocation.toolName}
                  result={toolInvocation.state === "result" ? toolInvocation.result : null}
                  style={{ borderColor }}
                />
              ))}
            </div>
          </MessageContainer>
        )
      })}
    </div>
  )
}