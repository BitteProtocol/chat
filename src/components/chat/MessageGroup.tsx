import { MessageSquare } from "lucide-react";

import { NearSafe } from "near-safe";

import { Wallet } from "@near-wallet-selector/core";
import { Account } from "near-api-js";
import { cn, safeStringify } from "../../lib/utils";

import { getAgentIdFromMessage, getTypedToolInvocations } from "../../lib/chat";
import { BittePrimitiveName, DEFAULT_AGENT_ID } from "../../lib/constants";
import { BITTE_BLACK_IMG } from "../../lib/images";
import { isDataString } from "../../lib/regex";
import { SmartActionAiMessage } from "../../types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { CodeBlock } from "./CodeBlock";
import { ErrorBoundary } from "./ErrorBoundary";
import { SAMessage } from "./Message";
import { EvmTxCard } from "./transactions/EvmTxCard";
import { ReviewTransaction } from "./transactions/ReviewTransaction";

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
}: MessageGroupProps) => {
  return (
    <div style={{ color: textColor }}>
      {messages?.map((message, index) => {
        let agentId = getAgentIdFromMessage(message);

        if (!agentId) {
          agentId = DEFAULT_AGENT_ID;
        }

        const uniqueKey = `${groupKey}-${index}`;

        if (message.toolInvocations) {
          for (const invocation of message.toolInvocations) {
            const { toolName, state, result } = getTypedToolInvocations(
              invocation
            ) as {
              toolName: string;
              state: string;
              result: any;
            };

            if (state !== "result") {
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
                    <EvmTxCard
                      evmData={evmSignRequest}
                      borderColor={borderColor}
                      messageBackgroundColor={messageBackgroundColor}
                    />
                  ) : (
                    <div className='bitte-my-4'>
                      <ReviewTransaction
                        chatId={chatId}
                        creator={creator}
                        transactions={transactions}
                        warnings={result?.warnings || []}
                        evmData={evmSignRequest}
                        agentId={agentId}
                        walletLoading={isLoading}
                        borderColor={borderColor}
                        messageBackgroundColor={messageBackgroundColor}
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
                <AccordionTrigger className='bitte-p-0 hover:bitte-no-underline'>
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
                          src={agentImage}
                          fallbackSrc={BITTE_BLACK_IMG}
                          className={cn(
                            "bitte-h-[18px] bitte-w-[18px] bitte-rounded",
                            agentImage === BITTE_BLACK_IMG
                              ? "bitte-invert-0 bitte-dark:invert"
                              : "bitte-dark:bg-card-list"
                          )}
                          alt={`${agentId} icon`}
                        />
                        <p className='bitte-text-[14px]'>
                          {agentId ?? "Bitte Assistant"}
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
                      const { toolName, toolCallId, state, result } =
                        getTypedToolInvocations(toolInvocation) as {
                          toolCallId: string;
                          toolName: string;
                          state: string;
                          result: any;
                        };

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
