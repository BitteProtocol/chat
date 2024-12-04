import { MessageSquare } from "lucide-react";
import { useCallback, useMemo } from "react";

import { NearSafe } from "near-safe";

import { cn } from "../../lib/utils";
import { BittePrimitiveName, DEFAULT_AGENT_ID } from "../../types/ai/constants";
import {
  getAgentIdFromMessage,
  getTypedToolInvocations,
} from "../../types/ai/utils/chat";
import { isDataString } from "../../types/ai/utils/regex";
import { BitteAssistantConfig, SmartActionAiMessage } from "../../types/types";
import { AccountCreationData } from "../../types/wallet";
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
import { EvmTxCard } from "./EvmTxCard";
import { ExplainWithAI } from "./ExplainWithAI";
import { SAMessage } from "./Message";
import ShareDropButton from "./ShareDropButton";

interface MessageGroupProps {
  groupKey: string;
  messages: SmartActionAiMessage[];
  accountData: AccountCreationData;
  creator?: string;
  isLoading?: boolean;
  agentsData?: BitteAssistantConfig[];
  evmAdapter?: NearSafe;
  messageBackgroundColor?: string;
}
// ... existing code ...

export const MessageGroup = ({
  groupKey,
  messages,
  accountData,
  creator,
  isLoading,
  agentsData,
  evmAdapter,
  messageBackgroundColor,
}: MessageGroupProps) => {
  const agentIdToAgentData = useMemo(() => {
    return agentsData?.reduce<
      Record<string, { agentImage: string; agentName: string }>
    >((acc, agent) => {
      acc[agent.id] = {
        agentImage: agent.image!,
        agentName: agent.name,
      };
      return acc;
    }, {});
  }, [agentsData]);

  const getAgentData = useCallback(
    (agentId: string) => {
      return (
        agentIdToAgentData?.[agentId] || {
          agentImage: "/bitte-symbol-black.svg",
          agentName: "Bitte Assistant",
        }
      );
    },
    [agentIdToAgentData]
  );

  return (
    <div>
      {messages?.map((message, index) => {
        let agentId = getAgentIdFromMessage(message);

        if (!agentId) {
          agentId = DEFAULT_AGENT_ID;
        }

        const { agentImage, agentName } = getAgentData(agentId);

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
              const [transactions, evmSignRequest] =
                result.data && "evmSignRequest" in result.data
                  ? [result.data.transactions, result.data.evmSignRequest]
                  : [result.data, undefined];
              return (
                <ErrorBoundary key={`${groupKey}-${message.id}`}>
                  {evmSignRequest && (
                    <EvmTxCard
                      evmData={evmSignRequest}
                      evmAdapter={evmAdapter}
                    />
                  )}
                  {/*               <ReviewTransaction
                    creator={creator}
                    transactions={transactions || []}
                    warnings={result.warnings}
                    evmData={evmSignRequest}
                    agentId={agentId}
                    accountData={accountData}
                    walletLoading={isLoading}
                  /> */}
                  <ExplainWithAI
                    evmData={evmSignRequest}
                    transactions={transactions || []}
                  />
                </ErrorBoundary>
              );
            }
          }
        }

        return (
          <Card
            className={`p-6 bg-[${messageBackgroundColor}]`}
            key={`${message.id}-${index}`}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={uniqueKey}
            >
              <AccordionItem value={uniqueKey} className="border-0">
                <AccordionTrigger className="p-0 hover:no-underline">
                  <div className="flex items-center justify-center gap-2">
                    {message.role === "user" ? (
                      <>
                        <MessageSquare className="h-[18px] w-[18px]" />
                        <p className="text-[14px] text-shad-blue-100">
                          {creator || accountData?.accountId}
                        </p>
                      </>
                    ) : (
                      <>
                        <ImageWithFallback
                          src={agentImage}
                          fallbackSrc="/bitte-symbol-black.svg"
                          className={cn(
                            "h-[18px] w-[18px] rounded",
                            agentImage === "/bitte-symbol-black.svg"
                              ? "bitte-logo"
                              : "dark:bg-card-list"
                          )}
                          alt={`${agentName} icon`}
                        />
                        <p className="text-[14px]">{agentName}</p>
                      </>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="mt-6 border-t border-gray-40 pb-0">
                  <div className="mt-6 flex w-full flex-col gap-2">
                    {message.content && (
                      <div className="flex flex-col gap-4 text-zinc-800 dark:text-zinc-300">
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
                          <div className="flex w-full items-center justify-between text-[12px] text-text-secondary">
                            <div>Tool Call</div>
                            <div className="rounded bg-shad-white-10 px-2 py-1">
                              <code>{toolName}</code>
                            </div>
                          </div>
                          <div className="p-4">
                            {(() => {
                              if (state === "result") {
                                switch (toolName) {
                                  case BittePrimitiveName.GENERATE_IMAGE: {
                                    return (
                                      <img
                                        src={result.data?.url}
                                        className="w-full"
                                      />
                                    );
                                  }
                                  case BittePrimitiveName.CREATE_DROP: {
                                    return (
                                      <div className="flex items-center justify-center gap-2">
                                        <Button asChild variant="link">
                                          <a
                                            href={`/claim/${result.data}`}
                                            target="_blank"
                                          >
                                            View Drop
                                          </a>
                                        </Button>
                                        <ShareDropButton
                                          dropId={result.data || ""}
                                        />
                                      </div>
                                    );
                                  }
                                  default: {
                                    const stringifiedData = JSON.stringify(
                                      result.data
                                    );
                                    return isDataString(stringifiedData) ? (
                                      <CodeBlock content={stringifiedData} />
                                    ) : (
                                      <div>{stringifiedData}</div>
                                    );
                                  }
                                }
                              }
                            })()}
                          </div>

                          <div className="mt-2 border-t border-gray-40" />
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
