import { useEffect, useState } from "react";

import { NearSafe } from "near-safe";

import { Wallet } from "@near-wallet-selector/core";
import { Account } from "near-api-js";

import { formatAgentId, getAgentIdFromMessage } from "../../lib/chat";
import { BittePrimitiveName, DEFAULT_AGENT_ID } from "../../lib/constants";
import { BITTE_BLACK_IMG } from "../../lib/images";
import { isDataString } from "../../lib/regex";
import {
  BitteToolResult,
  MessageGroupComponentProps,
  SmartActionAiMessage,
  TransactionButtonProps,
  TransactionContainerProps,
} from "../../types/types";
import { Button } from "../ui/button";
import { ChartWrapper } from "../ui/charts/ChartWrapper";
import { CodeBlock } from "./CodeBlock";
import DefaultMessageContainer from "./default-components/DefaultMessageContainer";
import { ErrorBoundary } from "./ErrorBoundary";
import { SAMessage } from "./Message";
import { EvmTxCard } from "./transactions/EvmTxCard";
import { ReviewSignMessage } from "./transactions/ReviewSignMessage";
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
  addToolResult: (params: {
    toolCallId: string;
    result: BitteToolResult;
  }) => void;
  customMessageContainer?: React.ComponentType<MessageGroupComponentProps>;
  customTxContainer?: React.ComponentType<TransactionContainerProps>;
  customApproveTxButton?: React.ComponentType<TransactionButtonProps>;
  customDeclineTxButton?: React.ComponentType<TransactionButtonProps>;
}

export const MessageGroup = ({
  groupKey,
  messages,
  accountId,
  creator,
  isLoading,
  agentImage,
  agentName,
  messageBackgroundColor,
  borderColor,
  textColor,
  chatId,
  addToolResult,
  customMessageContainer: MessageContainer = DefaultMessageContainer,
  customTxContainer,
  customApproveTxButton,
  customDeclineTxButton,
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
      return { ...message, agentId, agentImage: messageAgentImage, agentName };
    });
  };

  // Update messages with agentId whenever new messages arrive
  useEffect(() => {
    const updatedMessages = updateAgentIdForMessages(messages);
    setMessagesWithAgentId(updatedMessages);
  }, [messages]);

  return messagesWithAgentId?.map((message, index) => {
    const uniqueKey = `${groupKey}-${index}`;

    if (message.toolInvocations) {
      for (const invocation of message.toolInvocations) {
        const { toolName, toolCallId, state, args } = invocation;
        const result = state === "result" ? invocation.result : null;

        if (state !== "result") {
          if (toolName === BittePrimitiveName.SIGN_MESSAGE) {
            const { message, nonce, recipient, callbackUrl } = args;

            return (
              <ReviewSignMessage
                key={`${toolCallId}-${index}`}
                chatId={chatId}
                message={message}
                nonce={nonce}
                recipient={recipient}
                callbackUrl={callbackUrl}
                textColor={textColor}
                messageBackgroundColor={messageBackgroundColor}
                borderColor={borderColor}
                toolCallId={toolCallId}
                addToolResult={(result) =>
                  addToolResult({
                    toolCallId: toolCallId,
                    result,
                  })
                }
                customApproveTxButton={customApproveTxButton}
                customDeclineTxButton={customDeclineTxButton}
                customTxContainer={customTxContainer}
              />
            );
          }

          return null;
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
                    customApproveTxButton={customApproveTxButton}
                    customDeclineTxButton={customDeclineTxButton}
                    customTxContainer={customTxContainer}
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
                    customApproveTxButton={customApproveTxButton}
                    customDeclineTxButton={customDeclineTxButton}
                    customTxContainer={customTxContainer}
                  />
                </div>
              )}
            </ErrorBoundary>
          );
        }
      }
    }

    const isUser = message.role === "user";
    const userName = creator || accountId || "";

    return (
      <MessageContainer
        key={`${message.id}-${index}`}
        message={message}
        isUser={isUser}
        userName={userName}
        style={{
          backgroundColor: messageBackgroundColor,
          borderColor: borderColor,
          textColor: textColor,
        }}
        uniqueKey={uniqueKey}
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
              toolInvocation.state === "result" ? toolInvocation.result : null;

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
                      if (!result.data) {
                        return (
                          <CodeBlock
                            content={`Error: ${result.error || "Unknown Error"}`}
                          />
                        );
                      }
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
                          const stringifiedData =
                            typeof result.data === "string"
                              ? result.data
                              : JSON.stringify(result.data);
                          return isDataString(stringifiedData) ? (
                            <CodeBlock content={stringifiedData} />
                          ) : (
                            <p>{stringifiedData}</p>
                          );
                        }
                      }
                    } else {
                      return (
                        <CodeBlock
                          content={`Error: ${result.error || "Unknown Error"}`}
                        />
                      );
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
      </MessageContainer>
    );
  });
};
