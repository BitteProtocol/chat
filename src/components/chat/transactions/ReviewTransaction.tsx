import { Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { SafeEncodedSignRequest } from "near-safe";
import { useState } from "react";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { SuccessInfo, useTransaction } from "../../../hooks/useTransaction";
import { useTxnFees } from "../../../hooks/useTxnFees";
import { useTxnPrice } from "../../../hooks/useTxnPrice";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { safeJsonParse, shortenString } from "../../../lib/utils";
import { BitteToolWarning } from "../../../types";
import { useAccount } from "../../AccountContext";
import { Button } from "../../ui/button";
import { Card, CardFooter, CardHeader } from "../../ui/card";
import LoadingMessage from "../LoadingMessage";
import { TransactionResult } from "./TransactionResult";
import TxnBadge from "./TxnBadge";
import { TxnListWrapper } from "./TxnListWrapper";

export const ReviewTransaction = ({
  transactions,
  warnings,
  walletLoading,
  messageBackgroundColor,
  borderColor,
  chatId,
}: {
  transactions: Transaction[];
  warnings?: BitteToolWarning[] | null;
  creator?: string;
  evmData?: SafeEncodedSignRequest;
  agentId: string;
  walletLoading?: boolean;
  borderColor: string;
  chatId: string | undefined;
  messageBackgroundColor: string;
}) => {
  const [showTxnDetail, setShowTxnDetail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet, account, accountId } = useAccount();
  const { handleTxn } = useTransaction({
    account,
    wallet,
  });

  const { balance } = useAccountBalance(account);

  const { costs, gasPrice } = useTxnPrice(new BN(balance || 0), transactions);
  const { totalDeposit } = useTxnFees(transactions, costs, gasPrice);

  const loading = walletLoading || isLoading;

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  if (!transactions || transactions.length === 0) {
    return (
      <p className='bitte-my-4 bitte-overflow-auto bitte-text-center'>
        Unable to create transaction.
      </p>
    );
  }

  const firstAction = transactions[0]?.actions[0];
  const isTransfer = firstAction?.type === "Transfer";
  const isFunctionCall = firstAction?.type === "FunctionCall";
  const isMint = isFunctionCall && firstAction.params.methodName === "mint";
  const transactionType = isTransfer
    ? "Send"
    : transactions.length > 1
      ? "multi"
      : firstAction?.type === "FunctionCall"
        ? firstAction.params.methodName
        : "unknown";

  const to = shortenString(transactions[0]?.receiverId, isMobile ? 13 : 15);

  const txArgs = isFunctionCall
    ? safeJsonParse(firstAction.params?.args, {})
    : null;

  let txImage = null;
  if (txArgs && typeof txArgs === "object" && "metadata" in txArgs) {
    const metadata = safeJsonParse<{ media?: string }>(txArgs.metadata, {});
    if (
      metadata &&
      typeof metadata === "object" &&
      "media" in metadata &&
      typeof metadata.media === "string"
    ) {
      txImage = metadata.media;
    }
  }

  const handleSmartAction = async () => {
    // TO DO: add saving to local storage chat id here
    setIsLoading(true);
    setErrorMsg("");

    if (chatId) {
      sessionStorage.setItem("chatId", chatId);
    }
    try {
      const successInfo = (await handleTxn({
        transactions: transactions,
      })) as SuccessInfo;

      if (successInfo?.near?.receipts?.length > 0) {
        setResult(successInfo);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      style={{
        backgroundColor: messageBackgroundColor,
        borderColor: borderColor,
      }}
    >
      <CardHeader
        className='bitte-border-b bitte-text-center'
        style={{ borderColor: borderColor }}
      >
        <p className='bitte-text-[20px] bitte-font-semibold'>
          Review Transaction
        </p>
      </CardHeader>

      <div>
        {isMint && txImage ? (
          <div className='bitte-border-b' style={{ borderColor: borderColor }}>
            <div className='bitte-p-6'>
              <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
                <div>Asset</div>
                <img
                  src={`${
                    txImage.includes("https://")
                      ? txImage
                      : `https://arweave.net/${txImage}`
                  }`}
                  width={64}
                  height={64}
                  className='bitte-rounded-md'
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className='bitte-p-6'>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>Tx Type</div>

            <TxnBadge transactionType={transactionType} />
          </div>
        </div>
        <div className='bitte-flex bitte-flex-col bitte-gap-6 bitte-p-6'>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>Amount</div>
            <div className='bitte-font-semibold'>{totalDeposit} NEAR</div>
          </div>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>From</div>
            <div>{accountId}</div>
          </div>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>To</div>
            <div>{to}</div>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className='bitte-px-6 bitte-pb-8'>
            <div
              className='bitte-border-t bitte-p-4'
              style={{ borderColor: borderColor }}
            />
            {warnings.map((warning, index) => (
              <div
                key={index}
                className='bitte-flex bitte-items-center bitte-justify-between bitte-text-sm'
              >
                <div className='bitte-text-red-500'>Warning</div>
                <div className='bitte-text-gray-800'>{warning.message}</div>
              </div>
            ))}
          </div>
        )}

        <TxnListWrapper
          transaction={transactions}
          accountId={accountId || ""}
          costs={costs || []}
          gasPrice={gasPrice || "0"}
          showDetails={showTxnDetail}
          modifiedUrl={`https://wallet.bitte.ai`}
          setShowTxnDetail={setShowTxnDetail}
          showTxnDetail={showTxnDetail}
          borderColor={borderColor}
        />
      </div>

      {errorMsg && !loading ? (
        <div className='bitte-flex bitte-flex-col bitte-items-center bitte-gap-4 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm'>
          <p className='bitte-text-red-300'>
            An error occurred trying to execute your transaction: {errorMsg}.
          </p>
          <Button
            className='bitte-w-1/2'
            variant='outline'
            onClick={() => {
              setErrorMsg("");
            }}
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      {loading ? <LoadingMessage /> : null}
      {result && !loading ? (
        <TransactionResult result={result} accountId={accountId} />
      ) : null}
      {!loading && !result && !errorMsg && accountId ? (
        <CardFooter className='bitte-flex bitte-items-center bitte-gap-6'>
          <>
            <Button variant='outline' className='bitte-w-1/2'>
              Decline
            </Button>

            <Button
              variant='default'
              className='bitte-w-1/2'
              onClick={handleSmartAction}
            >
              Approve
            </Button>
          </>
        </CardFooter>
      ) : null}
    </Card>
  );
};
