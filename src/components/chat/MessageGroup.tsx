import { useState, useEffect } from "react";

import { MessageSquare } from "lucide-react";

import { NearSafe } from "near-safe";

import { Wallet } from "@near-wallet-selector/core";
import { Account } from "near-api-js";
import { cn, safeStringify } from "../../lib/utils";

import { getAgentIdFromMessage } from "../../lib/chat";
import { BittePrimitiveName, DEFAULT_AGENT_ID } from "../../lib/constants";
import { BITTE_BLACK_IMG } from "../../lib/images";
import { isDataString } from "../../lib/regex";
import { SmartActionAiMessage, BitteToolResult } from "../../types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ChartWrapper } from "../ui/charts/ChartWrapper";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { CodeBlock } from "./CodeBlock";
import { ErrorBoundary } from "./ErrorBoundary";
import { SAMessage } from "./Message";
import { EvmTxCard } from "./transactions/EvmTxCard";
import { ReviewTransaction } from "./transactions/ReviewTransaction";
import { ReviewSignMessage } from "./transactions/ReviewSignMessage";

interface MessageGroupProps {
  chatId: string | undefined;
  groupKey: string;
  messages: SmartActionAiMessage[];
  accountId: string;
  creator?: string;
  isLoading?: boolean;
  agentImage?: string;
  agentName?: string;
  evmAdapter?: NearSafe;
  account?: Account;
  wallet?: Wallet;
  messageBackgroundColor: string;
  borderColor: string;
  textColor: string;
  addToolResult: (params: {
    toolCallId: string;
    result: BitteToolResult;
  }) => void;
}

export const MessageGroup = ({
  groupKey,
  messages,
  accountId,
  creator,
  isLoading,
  agentImage,
  messageBackgroundColor,
  borderColor,
  textColor,
  chatId,
  addToolResult,
}: MessageGroupProps) => {
  // State to track agentId for each message
  const [messagesWithAgentId, setMessagesWithAgentId] = useState<
    SmartActionAiMessage[]
  >([]);

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
        const uniqueKey = `${groupKey}-${index}`;

        if (message.toolInvocations) {
          for (const invocation of message.toolInvocations) {
            const { toolName, toolCallId, state, args } = invocation;
            const result =
              invocation.state === "result" ? invocation.result : null;

            if (state !== "result") {
              if (toolName === BittePrimitiveName.SIGN_MESSAGE) {
                const { message, nonce, recipient, callbackUrl } = args;

                return (
                  <ReviewSignMessage
                    chatId={chatId}
                    message={message}
                    nonce={nonce}
                    recipient={recipient}
                    callbackUrl={callbackUrl}
                    textColor={textColor}
                    messageBackgroundColor={messageBackgroundColor}
                    borderColor={borderColor}
                    addToolResult={(result) =>
                      addToolResult({
                        toolCallId: toolCallId,
                        result,
                      })
                    }
                  />
                );
              }

              continue;
            }

            if (
              toolName === BittePrimitiveName.GENERATE_TRANSACTION ||
              toolName === BittePrimitiveName.TRANSFER_FT ||
              toolName === BittePrimitiveName.GENERATE_EVM_TX
            ) {
              const transactions = result?.data?.transactions || [];
              const evmSignRequest = result?.data?.evmSignRequest;

              return (
                <ErrorBoundary key={`${groupKey}-${message.id}`}>
                  {evmSignRequest ? (
                    <div className='bitte-my-4'>
                      <EvmTxCard
                        evmData={evmSignRequest}
                        borderColor={borderColor}
                        messageBackgroundColor={messageBackgroundColor}
                        textColor={textColor}
                      />
                    </div>
                  ) : (
                    <div className='bitte-my-4'>
                      <ReviewTransaction
                        chatId={chatId}
                        creator={creator}
                        transactions={transactions}
                        warnings={result?.warnings || []}
                        evmData={evmSignRequest}
                        agentId={formatAgentId(
                          message.agentId || "Bitte-Assistant"
                        )}
                        walletLoading={isLoading}
                        borderColor={borderColor}
                        messageBackgroundColor={messageBackgroundColor}
                        textColor={textColor}
                      />
                    </div>
                  )}
                </ErrorBoundary>
              );
            }
          }
        }

        return (
          <Card
            className='bitte-p-6'
            style={{
              backgroundColor: messageBackgroundColor,
              borderColor: borderColor,
            }}
            key={`${message.id}-${index}`}
          >
            <Accordion
              type='single'
              collapsible
              className='bitte-w-full'
              defaultValue={uniqueKey}
            >
              <AccordionItem value={uniqueKey} className='bitte-border-0'>
                <AccordionTrigger className='bitte-p-0'>
                  <div className='bitte-flex bitte-items-center bitte-justify-center bitte-gap-2'>
                    {message.role === "user" ? (
                      <>
                        <MessageSquare className='bitte-h-[18px] bitte-w-[18px]' />
                        <p className='bitte-text-[14px]'>
                          {creator || accountId}
                        </p>
                      </>
                    ) : (
                      <>
                        <ImageWithFallback
                          src={message.agentImage}
                          fallbackSrc={BITTE_BLACK_IMG}
                          className={cn(
                            "bitte-h-[18px] bitte-w-[18px] bitte-rounded",
                            message.agentImage === BITTE_BLACK_IMG
                              ? "bitte-invert-0 bitte-dark:invert"
                              : "bitte-dark:bg-card-list"
                          )}
                          alt={`${message?.agentId} icon`}
                        />
                        <p className='bitte-text-[14px]'>
                          {formatAgentId(message?.agentId ?? "Bitte Assistant")}
                        </p>
                      </>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent
                  className='bitte-mt-6 bitte-border-t bitte-pb-0'
                  style={{ borderColor: borderColor }}
                >
                  <div className='bitte-mt-6 bitte-flex bitte-w-full bitte-flex-col bitte-gap-2'>
                    {message.content && (
                      <div className='bitte-flex bitte-flex-col bitte-gap-4'>
                        <SAMessage content={message.content} />
                      </div>
                    )}

                    {message.toolInvocations?.map((toolInvocation, index) => {
                      const { toolName, toolCallId, state } = toolInvocation;
                      const result =
                        toolInvocation.state === "result"
                          ? toolInvocation.result
                          : null;

                      return (
                        <div key={`${toolCallId}-${index}`}>
                          <div className='bitte-flex bitte-w-full bitte-items-center bitte-justify-between bitte-text-[12px]'>
                            <div>Tool Call</div>
                            <div className='bitte-rounded bitte-bg-shad-white-10 bitte-px-2 bitte-py-1'>
                              <code>{toolName}</code>
                            </div>
                          </div>
                          <div className='bitte-p-4'>
                            {(() => {
                              if (state === "result") {
                                switch (toolName) {
                                  case BittePrimitiveName.GENERATE_IMAGE: {
                                    return (
                                      <img
                                        src={result?.data?.url}
                                        className='bitte-w-full'
                                      />
                                    );
                                  }
                                  case BittePrimitiveName.CREATE_DROP: {
                                    return (
                                      <div className='bitte-flex bitte-items-center bitte-justify-center bitte-gap-2'>
                                        <Button asChild variant='link'>
                                          <a
                                            href={`/claim/${result.data}`}
                                            target='_blank'
                                          >
                                            View Drop
                                          </a>
                                        </Button>
                                      </div>
                                    );
                                  }

                                  case BittePrimitiveName.RENDER_CHART: {
                                    const {
                                      title,
                                      description,
                                      chartConfig,
                                      chartData,
                                      metricData,
                                      metricLabels,
                                      dataFormat,
                                      chartType,
                                    } = result.data;

                                    return (
                                      <ChartWrapper
                                        title={title}
                                        description={description}
                                        chartData={chartData}
                                        chartConfig={chartConfig}
                                        dataFormat={dataFormat}
                                        chartType={chartType}
                                        metricLabels={metricLabels}
                                        metricData={metricData}
                                      />
                                    );
                                  }
                                  default: {
                                    const safeData = safeStringify(
                                      result?.data
                                    );
                                    return isDataString(safeData) ? (
                                      <CodeBlock content={safeData} />
                                    ) : (
                                      <div>{safeData}</div>
                                    );
                                  }
                                }
                              }
                            })()}
                          </div>

                          <div
                            className='bitte-mt-2 bitte-border-t'
                            style={{ borderColor: borderColor }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        );
      })}
    </div>
  );
};
