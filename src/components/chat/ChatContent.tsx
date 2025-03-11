import { generateId } from "ai";
import { Message, useChat } from "ai/react";
import { ArrowDown } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Hex } from "viem";
import { defaultColors } from "../../lib/constants";
import { BITTE_IMG } from "../../lib/images";
import { executeLocalToolCall } from "../../lib/local-agent";
import { cn, shortenAddress } from "../../lib/utils";
import {
  AssistantsMode,
  BitteAiChatProps,
  ChatRequestBody,
  type BitteToolResult,
} from "../../types/types";
import { useAccount } from "../AccountContext";
import { Button } from "../ui/button";
import { SmartActionsInput } from "./ChatInput";
import { MessageGroup } from "./MessageGroup";
import DefaultChatContainer from "./default-components/DefaultChatContainer";
import DefaultInputContainer from "./default-components/DefaultInputContainer";
import DefaultLoadingIndicator from "./default-components/DefaultLoadingIndicator";

export const ChatContent = ({
  agentId,
  apiUrl,
  apiKey,
  options,
  messages: initialMessages,
}: BitteAiChatProps) => {
  const chatId = useRef(options?.chatId || generateId()).current;
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { accountId, evmAddress, chainId } = useAccount();

  const {
    borderColor,
    buttonColor,
    generalBackground,
    messageBackground,
    textColor,
  } = {
    ...defaultColors,
    ...options?.colors,
  };

  // Get custom components or use defaults
  const {
    chatContainer: ChatContainer = DefaultChatContainer,
    loadingIndicator: LoadingIndicator = DefaultLoadingIndicator,
    inputContainer: InputContainer = DefaultInputContainer,
  } = options?.customComponents || {};

  const {
    messages,
    input,
    handleInputChange,
    isLoading: isInProgress,
    handleSubmit,
    reload,
    addToolResult,
    append,
    error,
  } = useChat({
    maxSteps: 7,
    id: chatId,
    api: apiUrl,
    onToolCall: async ({ toolCall }): Promise<BitteToolResult | undefined> => {
      const localAgent = options?.localAgent;
      if (!localAgent) return undefined;

      try {
        return await executeLocalToolCall({
          localAgent,
          toolCall,
          metadata: {
            accountId,
            evmAddress,
            chainId,
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error executing tool call:", errorMessage);
        return { error: errorMessage };
      }
    },
    onError: (e) => {
      console.error(e);
    },
    sendExtraMessageFields: true,
    initialMessages,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: {
      id: chatId,
      config: {
        mode: AssistantsMode.DEBUG,
        agentId,
      },
      accountId: accountId || "",
      evmAddress: evmAddress as Hex,
      chainId,
      localAgent: options?.localAgent,
    } satisfies ChatRequestBody,
  });

  const groupedMessages = useMemo(() => {
    return messages?.reduce<Message[][]>((groups, message) => {
      if (message.role === "user") {
        groups.push([message]);
      } else {
        const lastGroup = groups[groups.length - 1];
        if (!lastGroup || lastGroup[0].role === "user") {
          groups.push([message]);
        } else {
          lastGroup.push(message);
        }
      }
      return groups;
    }, []);
  }, [messages]);

  const scrollToBottom = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (isAtBottom && autoScrollEnabled) {
      requestAnimationFrame(() => {
        scrollToBottom(messagesRef.current);
      });
    }
  }, [isAtBottom, autoScrollEnabled, scrollToBottom, messages]);

  const handleSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleScroll = useCallback(() => {
    if (messagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setIsAtBottom(atBottom);
      setAutoScrollEnabled(atBottom);
    }
  }, []);

  useEffect(() => {
    const scrollElement = messagesRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const scrollToBottomHandler = useCallback(() => {
    scrollToBottom(messagesRef.current);
    setAutoScrollEnabled(true);
  }, [scrollToBottom]);

  useEffect(() => {
    if (options?.prompt && messages.length === 0 && !isInProgress) {
      append({
        id: generateId(),
        role: "user",
        content: options.prompt,
      });
    }
  }, [messages.length, isInProgress, options?.prompt, append]);

  return (
    <div className='bitte-relative bitte-w-full bitte-h-full bitte-flex bitte-flex-col bitte-gap-4'>
      {/* Main chat container */}
      <ChatContainer
        style={{
          backgroundColor: generalBackground,
          borderColor: borderColor,
        }}
      >
        {!isAtBottom && (
          <Button
            size='icon'
            variant='outline'
            className='bitte-absolute bitte-bottom-2 bitte-left-1/2 bitte--translate-x-1/2 hover:bitte-bg-inherit bitte-z-[99]'
            style={{
              backgroundColor: generalBackground,
              borderRadius: "9999px",
            }}
            onClick={scrollToBottomHandler}
          >
            <ArrowDown
              className='bitte-h-4 bitte-w-4'
              style={{ color: textColor }}
            />
          </Button>
        )}

        <div
          ref={messagesRef}
          className='bitte-absolute bitte-inset-0 bitte-flex bitte-h-full bitte-w-full bitte-justify-center bitte-overflow-y-auto bitte-overflow-x-hidden bitte-p-4'
        >
          <div
            className={cn(
              "bitte-mx-auto bitte-flex bitte-w-full bitte-flex-col md:bitte-mx-24 2xl:bitte-mx-56",
              !!agentId
                ? "bitte-h-[calc(100%-240px)]"
                : "bitte-h-[calc(100%-208px)]"
            )}
          >
            {messages.length === 0 &&
              (options?.customComponents?.welcomeMessageComponent ? (
                options.customComponents.welcomeMessageComponent
              ) : (
                <div className='bitte-flex bitte-flex-col bitte-gap-4 bitte-items-center bitte-justify-center bitte-absolute bitte-left-1/2 bitte--translate-x-1/2 bitte-top-1/2 bitte--translate-y-1/2 bitte-text-center bitte-w-full'>
                  <img
                    className='bitte-mx-auto bitte-mb-4'
                    src={BITTE_IMG || "/placeholder.svg"}
                    alt='Bitte'
                  />
                  <div className='bitte-mb-14 bitte-text-[20px] bitte-font-medium bitte-text-gray-40'>
                    Execute Transactions with AI
                  </div>
                </div>
              ))}

            <div
              className='bitte-flex bitte-w-full bitte-flex-col bitte-gap-4 bitte-py-6'
              style={{ color: textColor }}
            >
              {groupedMessages?.map((messages: Message[]) => {
                const groupKey = `group-${messages?.[0]?.id}`;
                return (
                  <MessageGroup
                    chatId={chatId}
                    key={groupKey}
                    groupKey={groupKey}
                    accountId={accountId || shortenAddress(evmAddress)}
                    messages={messages}
                    isLoading={isInProgress}
                    messageBackgroundColor={messageBackground}
                    borderColor={borderColor}
                    textColor={textColor}
                    agentImage={options?.agentImage}
                    addToolResult={addToolResult}
                    customMessageContainer={
                      options?.customComponents?.messageContainer
                    }
                  />
                );
              })}

              {error && (
                <div className='bitte-flex bitte-flex-col bitte-items-center bitte-justify-center bitte-space-y-2 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm'>
                  {!accountId && !evmAddress ? (
                    <p>
                      An error occurred. <br />
                      Please connect your wallet and try again.
                    </p>
                  ) : (
                    <>
                      <p>An error occurred.</p>
                      <Button
                        type='button'
                        variant='default'
                        size='sm'
                        onClick={() => reload()}
                      >
                        Retry
                      </Button>
                    </>
                  )}
                </div>
              )}

              {isInProgress && (
                <LoadingIndicator
                  textColor={textColor || defaultColors.textColor}
                />
              )}
            </div>
          </div>
        </div>
      </ChatContainer>

      {/* Input container - with gap */}
      <InputContainer
        style={{
          backgroundColor: generalBackground,
          borderColor: borderColor,
        }}
      >
        <SmartActionsInput
          input={input}
          handleChange={handleInputChange}
          handleSubmit={handleSubmitChat}
          isLoading={isInProgress}
          buttonColor={buttonColor}
          borderColor={borderColor}
          textColor={textColor}
          backgroundColor={generalBackground}
          agentName={options?.agentName}
          mobileInputExtraButton={
            options?.customComponents?.mobileInputExtraButton
          }
          customSendButtonComponent={
            options?.customComponents?.sendButtonComponent
          }
          placeholderText={options?.placeholderText}
        />
      </InputContainer>
    </div>
  );
};
