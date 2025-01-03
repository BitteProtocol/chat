import { generateId } from "ai";
import { Message, useChat } from "ai/react";
import { ArrowDown, ShareIcon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOrigin } from "../../hooks/useOrigin";
import { cn } from "../../lib/utils";
import { DEFAULT_AGENT_ID } from "../../types/ai/constants";
import {
  AssistantsMode,
  BitteAiChatProps,
  ChatRequestBody,
} from "../../types/types";
import { useAccount } from "../AccountContext";
import { Button } from "../ui/button";
import ShareModal from "../ui/modal/ShareModal";
import { BitteSpinner } from "./BitteSpinner";
import { SmartActionsInput } from "./ChatInput";
import { MessageGroup } from "./MessageGroup";
import { SuggestedPrompts } from "./SuggestedPrompts";

const defaultColors = {
  borderColor: "#e5e7eb",
  buttonColor: "#000000",
  generalBackground: "#ffffff",
  messageBackground: "#f9fafb",
  textColor: "#000000",
} as const;

export const ChatContent = ({
  id,
  creator,
  prompt,
  messages: initialMessages,
  agentData,
  model,
  isShare,
  colors = defaultColors,
  apiUrl,
  solanaWallet,
}: BitteAiChatProps) => {
  const chatId = useRef(id || generateId()).current;
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isLoadingAccountData, setIsLoadingAccountData] = useState(true);

  const hasInitializedPrompt = useRef(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { accountId, evmAddress } = useAccount();

  const {
    borderColor,
    buttonColor,
    generalBackground,
    messageBackground,
    textColor,
  } = colors;

  const origin = useOrigin();

  const {
    messages,
    input,
    handleInputChange,
    isLoading: isInProgress,
    handleSubmit,
    setInput,
    append,
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
        agentId: agentData.id,
        model,
      },
      accountId: accountId || "",
      evmAddress: evmAddress,
      solanaWallet: solanaWallet,
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

  const { shareLink } = useMemo(() => {
    if (!origin || !prompt)
      return { promptUrl: null, authUrl: null, shareLink: "" };
    const promptUrl = new URL(
      `smart-actions/prompt/${encodeURIComponent(prompt)}`,
      origin
    );
    if (agentData?.id) promptUrl.searchParams.set("agentId", agentData.id);

    const shareLink = new URL(`/smart-actions/share/${id}`, origin).href;

    return {
      promptUrl,
      shareLink,
    };
  }, [prompt, agentData, origin, id]);

  const showGetStartedMessage = isShare || (creator && creator !== accountId);

  useEffect(() => {
    if (
      !hasInitializedPrompt.current &&
      prompt &&
      messages.length === 0 &&
      !isInProgress &&
      !isLoadingAccountData
    ) {
      append({
        id: generateId(),
        role: "user",
        content: prompt,
      });
      hasInitializedPrompt.current = true;
    }
  }, [messages.length, isInProgress, prompt, isLoadingAccountData, append]);

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

  const showSuggestedPrompts = useMemo(() => {
    if (agentData?.id !== DEFAULT_AGENT_ID) return false;
    if (!messages || messages.length === 0) return true;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.role === "assistant" && !lastMessage.toolInvocations;
  }, [messages, agentData?.id]);

  const handleSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log({ id, accountId });
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
        <div
          className='relative flex h-[400px] w-full grow-0 overflow-y-auto rounded-lg max-lg:flex-col border lg:px-6'
          style={{
            backgroundColor: generalBackground,
            borderColor: borderColor,
          }}
        >
          {!isAtBottom ? (
            <Button
              size='icon'
              variant='outline'
              className='absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full'
              onClick={scrollToBottomHandler}
            >
              <ArrowDown className='h-4 w-4' />
            </Button>
          ) : null}

          {id ? (
            <div className='absolute right-6 top-6 z-50 block'>
              <ShareModal
                shareLink={shareLink}
                shareText='Share Smart Action'
                title='Share Smart Action'
                subtitle='Anyone who has this link and a Bitte Wallet account will be able to run this Smart Action.'
                trigger={
                  <Button variant='outline' size='icon'>
                    <ShareIcon className='h-4 w-4' />
                  </Button>
                }
              />
            </div>
          ) : null}

          <div
            ref={messagesRef}
            className='flex h-full w-full justify-center overflow-y-auto'
          >
            <div
              className={cn(
                "mx-auto flex w-full flex-col md:max-w-[480px] xl:max-w-[600px] 2xl:mx-56 2xl:max-w-[800px]",
                !!agentData ? "h-[calc(100%-240px)]" : "h-[calc(100%-208px)]"
              )}
            >
              <div className='flex w-full flex-col space-y-4 py-6'>
                {groupedMessages.map((messages: Message[]) => {
                  const groupKey = `group-${messages?.[0]?.id}`;
                  return (
                    <MessageGroup
                      key={groupKey}
                      groupKey={groupKey}
                      accountId={accountId!}
                      messages={messages}
                      creator={creator}
                      isLoading={isInProgress}
                      messageBackgroundColor={messageBackground!}
                      borderColor={borderColor!}
                      textColor={textColor!}
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
                ) : showSuggestedPrompts ? (
                  <div className='pb-6'>
                    <SuggestedPrompts handleClick={setInput} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {!showGetStartedMessage ? (
          <div
            className='z-10 rounded-lg border p-6'
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
              agentName={agentData?.name}
              buttonColor={buttonColor!}
              borderColor={borderColor!}
              textColor={textColor!}
            />
          </div>
        ) : null}
      </div>
  );
};
