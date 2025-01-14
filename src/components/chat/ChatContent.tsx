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

const BITTE_IMG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCA0MCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzg3NTVfMjczNzMpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wLjc0OTkwOSAxOC45ODYyTDI2LjQ4MjIgMjAuNzIxOUMyNi42NDkzIDIwLjc3MTUgMjYuODAxNCAyMC44NjE3IDI2LjkyNDcgMjAuOTg0NEMyNy4wNDggMjEuMTA3MiAyNy4xMzg2IDIxLjI1ODUgMjcuMTg4NCAyMS40MjQ5TDI4LjkzMjMgMjcuMjUzMkMyOC45OTY5IDI3LjQ2ODggMjkuMTI5NiAyNy42NTggMjkuMzEwOSAyNy43OTI0QzI5LjQ5MjEgMjcuOTI2OSAyOS43MTIxIDI3Ljk5OTYgMjkuOTM4MSAyNy45OTk2QzMwLjE2NDIgMjcuOTk5NiAzMC4zODQyIDI3LjkyNjkgMzAuNTY1NCAyNy43OTI0QzMwLjc0NjcgMjcuNjU4IDMwLjg3OTQgMjcuNDY4OCAzMC45NDQgMjcuMjUzMkwzMi42ODc5IDIxLjQyNDlDMzIuNzM3NyAyMS4yNTg1IDMyLjgyODMgMjEuMTA3MiAzMi45NTE2IDIwLjk4NDRDMzMuMDc0OSAyMC44NjE3IDMzLjIyNyAyMC43NzE1IDMzLjM5NDEgMjAuNzIxOUwzOS4yNTAxIDE4Ljk4NjJDMzkuNDY2NyAxOC45MjIgMzkuNjU2NyAxOC43ODk5IDM5Ljc5MTkgMTguNjA5NUMzOS45MjcgMTguNDI5MSA0MCAxOC4yMTAyIDQwIDE3Ljk4NTJDNDAgMTcuNzYwMiAzOS45MjcgMTcuNTQxMiAzOS43OTE5IDE3LjM2MDhDMzkuNjU2NyAxNy4xODA0IDM5LjQ2NjcgMTcuMDQ4MyAzOS4yNTAxIDE2Ljk4NDFMMzMuMzk0MiAxNS4yNDg0QzMzLjIyNyAxNS4xOTg4IDMzLjA3NDkgMTUuMTA4NiAzMi45NTE2IDE0Ljk4NTlDMzIuODI4MyAxNC44NjMyIDMyLjczNzcgMTQuNzExOCAzMi42ODc5IDE0LjU0NTRMMzAuOTQ0IDguNzE3MTNDMzAuODc5NCA4LjUwMTQ5IDMwLjc0NjcgOC4zMTIzNSAzMC41NjU1IDguMTc3ODVDMzAuMzg0MiA4LjA0MzM2IDMwLjE2NDIgNy45NzA3IDI5LjkzODIgNy45NzA3QzI5LjcxMjEgNy45NzA3IDI5LjQ5MjEgOC4wNDMzNiAyOS4zMTA5IDguMTc3ODVDMjkuMTI5NiA4LjMxMjM1IDI4Ljk5NjkgOC41MDE0OSAyOC45MzI0IDguNzE3MTNMMjcuMTg4NCAxNC41NDU0QzI3LjEzODYgMTQuNzExOCAyNy4wNDggMTQuODYzMiAyNi45MjQ3IDE0Ljk4NTlDMjYuODAxNCAxNS4xMDg2IDI2LjY0OTMgMTUuMTk4OCAyNi40ODIyIDE1LjI0ODRMMC43NDk5MTMgMTYuOTg0MUMwLjUzMzI2MSAxNy4wNDgzIDAuMzQzMjM0IDE3LjE4MDQgMC4yMDgxMTMgMTcuMzYwOEMwLjA3Mjk5MTkgMTcuNTQxMiAwIDE3Ljc2MDIgMCAxNy45ODUyQzAgMTguMjEwMiAwLjA3Mjk5MTkgMTguNDI5MSAwLjIwODExMyAxOC42MDk1QzAuMzQzMjM0IDE4Ljc4OTkgMC41MzMyNTcgMTguOTIyIDAuNzQ5OTA5IDE4Ljk4NjJaIiBmaWxsPSIjQ0JENUUxIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMuNTc5OCA2LjUwNzg5TDE3LjAzOTQgNy41MzMzNkMxNy4xMzgyIDcuNTYyNjMgMTcuMjI4IDcuNjE1OTMgMTcuMzAwOSA3LjY4ODQ0QzE3LjM3MzcgNy43NjA5NSAxNy40MjczIDcuODUwMzkgMTcuNDU2NyA3Ljk0ODY3TDE4LjQ4NyAxMS4zOTJDMTguNTI1MSAxMS41MTk0IDE4LjYwMzUgMTEuNjMxMSAxOC43MTA2IDExLjcxMDZDMTguODE3NyAxMS43OSAxOC45NDc3IDExLjgzMyAxOS4wODEyIDExLjgzM0MxOS4yMTQ4IDExLjgzMyAxOS4zNDQ3IDExLjc5IDE5LjQ1MTggMTEuNzEwNkMxOS41NTg5IDExLjYzMTEgMTkuNjM3MyAxMS41MTk0IDE5LjY3NTQgMTEuMzkyTDIwLjcwNTcgNy45NDg2N0MyMC43MzUxIDcuODUwMzggMjAuNzg4NyA3Ljc2MDkzIDIwLjg2MTUgNy42ODg0MkMyMC45MzQ0IDcuNjE1OTEgMjEuMDI0MyA3LjU2MjYyIDIxLjEyMyA3LjUzMzM2TDI0LjU4MjYgNi41MDc4OUMyNC43MTA2IDYuNDY5OTUgMjQuODIyOSA2LjM5MTg4IDI0LjkwMjcgNi4yODUzMkMyNC45ODI1IDYuMTc4NzYgMjUuMDI1NyA2LjA0OTM5IDI1LjAyNTcgNS45MTY0OEMyNS4wMjU3IDUuNzgzNTYgMjQuOTgyNSA1LjY1NDE5IDI0LjkwMjcgNS41NDc2M0MyNC44MjI5IDUuNDQxMDcgMjQuNzEwNiA1LjM2MyAyNC41ODI2IDUuMzI1MDZMMjEuMTIzIDQuMjk5NTlDMjEuMDI0MiA0LjI3MDMzIDIwLjkzNDQgNC4yMTcwMyAyMC44NjE1IDQuMTQ0NTJDMjAuNzg4NyA0LjA3MjAxIDIwLjczNTEgMy45ODI1NyAyMC43MDU3IDMuODg0MjlMMTkuNjc1NCAwLjQ0MDk1NEMxOS42MzczIDAuMzEzNTYxIDE5LjU1ODkgMC4yMDE4MjQgMTkuNDUxOCAwLjEyMjM3MkMxOS4zNDQ3IDAuMDQyOTE5NyAxOS4yMTQ4IDAgMTkuMDgxMiAwQzE4Ljk0NzcgMCAxOC44MTc3IDAuMDQyOTE5NyAxOC43MTA2IDAuMTIyMzcyQzE4LjYwMzUgMC4yMDE4MjQgMTguNTI1MSAwLjMxMzU2MSAxOC40ODcgMC40NDA5NTRMMTcuNDU2NyAzLjg4NDI5QzE3LjQyNzMgMy45ODI1NyAxNy4zNzM3IDQuMDcyMDEgMTcuMzAwOSA0LjE0NDUyQzE3LjIyOCA0LjIxNzAzIDE3LjEzODIgNC4yNzAzMyAxNy4wMzk0IDQuMjk5NTlMMTMuNTc5OCA1LjMyNTA2QzEzLjQ1MTggNS4zNjI5OSAxMy4zMzk1IDUuNDQxMDQgMTMuMjU5NyA1LjU0NzYxQzEzLjE3OTggNS42NTQxNyAxMy4xMzY3IDUuNzgzNTUgMTMuMTM2NyA1LjkxNjQ4QzEzLjEzNjcgNi4wNDk0IDEzLjE3OTggNi4xNzg3OCAxMy4yNTk3IDYuMjg1MzRDMTMuMzM5NSA2LjM5MTkxIDEzLjQ1MTggNi40Njk5NiAxMy41Nzk4IDYuNTA3ODlaIiBmaWxsPSIjQ0JENUUxIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfODc1NV8yNzM3MyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";

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
      <div className='relative flex h-[400px] w-full grow-0 overflow-y-auto rounded-lg max-lg:flex-col lg:border lg:border-shad-gray-20 lg:bg-gray-30 lg:px-6'>
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
              <div className='flex h-full flex-col items-center justify-center'>
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
