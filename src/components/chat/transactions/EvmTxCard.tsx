import { EthTransactionParams, Network, SignRequestData } from "near-safe";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useTransaction } from "../../../hooks/useTransaction";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { shortenString } from "../../../lib/utils";
import { useAccount } from "../../AccountContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Button } from "../../ui/button";
import { Card, CardFooter, CardHeader } from "../../ui/card";
import { CopyStandard } from "./../CopyStandard";
import LoadingMessage from "./../LoadingMessage";
import { TransactionDetail } from "./TransactionDetail";
import { TransactionResult } from "./TransactionResult";

export const EvmTxCard = ({ evmData }: { evmData?: SignRequestData }) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const { evmAddress, evmWallet } = useAccount();

  if (!evmData)
    return (
      <p className="bitte-my-6 bitte-overflow-auto bitte-text-center">
        Unable to create evm transaction.
      </p>
    );

  if (
    !Array.isArray(evmData.params) ||
    !evmData.params.every(isValidEvmParams)
  ) {
    return (
      <p className="bitte-my-6 bitte-overflow-auto bitte-text-center">
        Invalid EVM transaction parameters.
      </p>
    );
  }

  useEffect(() => {
    if (evmWallet?.hash) {
      setIsLoading(false);
      setTxHash(evmWallet.hash);
    }
  }, [evmWallet?.hash]);

  const network = Network.fromChainId(evmData.chainId);
  const { handleTxn } = useTransaction({ evmWallet: evmWallet });

  const handleSmartAction = async () => {
    setIsLoading(true);
    try {
      await handleTxn({ evmData });
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <div className="bitte-mb-8 bitte-flex bitte-justify-center">
        <Card className="bitte-w-full">
          <CardHeader className="bitte-border-b bitte-border-slate-200 bitte-p-4 bitte-text-center bitte-md:p-6">
            <p className="bitte-text-xl bitte-font-semibold">EVM Transaction</p>
          </CardHeader>
          <div>
            {evmData ? (
              <div className="bitte-p-6">
                <div className="bitte-flex bitte-flex-col bitte-gap-6 bitte-text-sm">
                  <TransactionDetail
                    label='Chain ID'
                    value={shortenString(
                      evmData.chainId.toString(),
                      isMobile ? 13 : 21
                    )}
                  />
                  <TransactionDetail label='Network' value={network.name} />
                  <Accordion
                    type='single'
                    collapsible
                    defaultValue='transaction-0'
                  >
                    {evmData.params.map((transaction, index) => (
                      <AccordionItem
                        key={transaction.to}
                        value={`transaction-${index}`}
                        className="bitte-border-0"
                      >
                        <AccordionTrigger className="bitte-pt-0 bitte-hover:no-underline">
                          <div className="bitte-flex bitte-items-center bitte-justify-between bitte-text-sm">
                            <p className="bitte-text-text-secondary">
                              Transaction {index + 1}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bitte-flex bitte-flex-col bitte-gap-6 bitte-border-0">
                          {transaction.to && (
                            <TransactionDetail
                              label='To'
                              className="bitte--mr-2.5"
                              value={
                                <CopyStandard
                                  text={transaction.to}
                                  textSize='sm'
                                  textColor='gray-800'
                                  charSize={isMobile ? 7 : 12}
                                />
                              }
                            />
                          )}
                          <TransactionDetail
                            label='Value'
                            value={
                              transaction.value
                                ? formatEther(BigInt(transaction.value))
                                : "0"
                            }
                          />
                          <TransactionDetail
                            label='Data'
                            value={
                              <CopyStandard
                                text={transaction.data || "0x"}
                                textSize='sm'
                                charSize={isMobile ? 10 : 15}
                              />
                            }
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ) : null}
          </div>

          {errorMsg && !isLoading ? (
            <div className="bitte-flex bitte-flex-col bitte-items-center bitte-gap-4 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm">
              <p className="bitte-text-red-300">
                An error occurred trying to execute your transaction: {errorMsg}
                .
              </p>
              <Button
                className="bitte-w-1/2"
                variant='outline'
                onClick={() => {
                  setErrorMsg("");
                }}
              >
                Dismiss
              </Button>
            </div>
          ) : null}

          {isLoading ? <LoadingMessage /> : null}
          {txHash ? (
            <TransactionResult
              result={{ evm: { txHash, chainId: evmData.chainId } }}
              accountId={evmAddress}
            />
          ) : null}
          {!isLoading && !errorMsg && !txHash ? (
            <CardFooter className="bitte-flex bitte-items-center bitte-gap-6">
              <>
                <Button variant='outline' className="bitte-w-1/2">
                  Decline
                </Button>

                <Button
                  className="bitte-w-1/2"
                  onClick={handleSmartAction}
                  disabled={isLoading}
                >
                  {isLoading ? "Confirming..." : "Approve"}
                </Button>
              </>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </>
  );
};

const isValidEvmParams = (data: unknown): data is EthTransactionParams => {
  return (
    typeof data === "object" &&
    data !== null &&
    "to" in data &&
    typeof data.to === "string" &&
    data.to.startsWith("0x")
  );
};
