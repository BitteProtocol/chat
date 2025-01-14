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
import { cn } from "../../lib/utils";
import {
  AssistantsMode,
  BitteAiChatProps,
  ChatRequestBody,
} from "../../types/types";
import { useAccount } from "../AccountContext";
import { Button } from "../ui/button";
import { BitteSpinner } from "./BitteSpinner";
import { SmartActionsInput } from "./ChatInput";
import { MessageGroup } from "./MessageGroup";
import { BITTE_IMG } from "../../lib/images";


export const ChatContent = ({
  agentid,
  apiUrl,
  options,
  messages: initialMessages,
}: BitteAiChatProps) => {
  const chatId = useRef(options?.chatId || generateId()).current;
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { accountId, evmAddress } = useAccount();

  const {
    messages,
    input,
    handleInputChange,
    isLoading: isInProgress,
    handleSubmit,
    reload,
    error,
  } = useChat({
    id: chatId,
    api: apiUrl,
    onError: (e) => {
      console.error(e);
    },
    sendExtraMessageFields: true,
    initialMessages,
    body: {
      id: chatId,
      config: {
        mode: AssistantsMode.DEFAULT,
        agentId: agentid,
      },
      accountId: accountId || "",
      evmAddress: evmAddress as Hex,
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
  }, [isAtBottom, autoScrollEnabled, scrollToBottom]);

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

  return (
    <div className='flex h-full w-full flex-col gap-4 text-justify'>
      <div className='relative flex h-[calc(100vh-204px)] xl:h-[calc(100vh-172px)] w-full grow-0 overflow-y-auto rounded-lg max-lg:flex-col border order-shad-gray-20 bg-gray-30 lg:px-6'>
        {!isAtBottom ? (
          <Button
            size='icon'
            variant='outline'
            className='absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full hover:bg-inherit'
            onClick={scrollToBottomHandler}
          >
            <ArrowDown className='h-4 w-4' />
          </Button>
        ) : null}

        <div
          ref={messagesRef}
          className='flex h-full w-full justify-center overflow-y-auto p-4'
        >
          <div
            className={cn(
              "mx-auto flex w-full flex-col md:max-w-[480px] xl:max-w-[600px] 2xl:mx-56 2xl:max-w-[800px]",
              !!agentid ? "h-[calc(100%-240px)]" : "h-[calc(100%-208px)]"
            )}
          >
            {messages.length === 0 && (
              <div className='flex h-full flex-col items-center justify-center absolute left-1/2 -translate-x-1/2'>
                <img className='mx-auto mb-4' src={BITTE_IMG} />
                <div className='mb-14 text-[20px] font-medium text-gray-40'>
                  Execute Transactions with AI
                </div>
              </div>
            )}
            <div className='flex w-full flex-col space-y-4 py-6'>
              {groupedMessages.map((messages: Message[]) => {
                const groupKey = `group-${messages?.[0]?.id}`;
                return (
                  <MessageGroup
                    chatId={chatId}
                    key={groupKey}
                    groupKey={groupKey}
                    accountId={accountId!}
                    messages={messages}
                    isLoading={isInProgress}
                    agentImage={options?.agentImage}
                    agentName={options?.agentName}
                  />
                );
              })}
              {error && (
                <div className='flex flex-col items-center justify-center space-y-2 px-6 pb-6 text-center text-sm'>
                  {!accountId ? (
                    <p>
                      An error occurred. <br />
                      Please connect your wallet and try again.
                    </p>
                  ) : (
                    <>
                      <p>An error occurred.</p>
                      <Button
                        type='button'
                        variant='secondary'
                        size='sm'
                        onClick={() => reload()}
                      >
                        Retry
                      </Button>
                    </>
                  )}
                </div>
              )}
              {isInProgress ? (
                <div className='flex w-full flex-col items-center justify-center text-gray-600'>
                  <BitteSpinner width={100} height={100} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className='z-10 rounded-lg border border-shad-gray-20 bg-background p-6'>
        <SmartActionsInput
          input={input}
          handleChange={handleInputChange}
          handleSubmit={handleSubmitChat}
          isLoading={isInProgress}
          agentName={options?.agentName}
        />
      </div>
    </div>
  );
};
