/* "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Transaction } from "@near-wallet-selector/core";
import { SafeEncodedSignRequest } from "near-safe";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useIsClient } from "@/hooks/useIsClient";
import { useTxnFees } from "@/hooks/useTxnFees";
import { useWindowSize } from "@/hooks/useWindowSize";
import { BitteToolWarning } from "@/lib/types/ai/types";
import { AccountCreationData } from "@/lib/types/wallet";
import { safeJsonParse, shortenString } from "@/lib/utils";
import ConnectionUrl from "@/src/components/pages/connect/ConnectionUrl";
import { TxnListWrapper } from "@/src/components/pages/txn/TxnListWrapper";
import { useTransaction } from "@/src/hooks/transactions/useTransaction";
import { useTxnPrice } from "@/src/hooks/transactions/useTxnPrice";
import { useTransactionState } from "@/src/lib/state/transaction.state";
import { SuccessInfo } from "@lib/transactions/go-success";
import LoadingMessage from "./LoadingMessage";
import { TransactionResult } from "./TransactionResult";
import TxnBadge from "./TxnBadge";

export const ReviewTransaction = ({
  transactions,
  warnings,
  creator,
  evmData,
  agentId,
  accountData,
  walletLoading,
}: {
  transactions: Transaction[];
  warnings?: BitteToolWarning[] | null;
  creator?: string;
  evmData?: SafeEncodedSignRequest;
  agentId: string;
  accountData: AccountCreationData;
  walletLoading?: boolean;
}) => {
  const [showTxnDetail, setShowTxnDetail] = useState(false);
  const { transactionState, updateTxnState } = useTransactionState();
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<SuccessInfo>();

  const { handleTxn, loading: transactionLoading } = useTransaction({
    accountData,
    agentId,
  });

  useEffect(() => {
    if (transactionState?.error?.message) {
      setErrorMsg(transactionState.error.message);
    }
  }, [transactionState]);
  const loading =
    walletLoading || transactionLoading || transactionState?.isLoading;

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  const isClient = useIsClient();

  const walletLink = isClient ? window.location.origin : "";

  useTxnPrice(transactions);
  const { totalDeposit } = useTxnFees(transactions);

  if (!transactions || transactions.length === 0) {
    return (
      <p className="my-6 overflow-auto text-center text-text-secondary">
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
    const successInfo = (await handleTxn({
      data: {
        transactions: transactions,
        evmData,
      },
      // disableSuccess ensures return type is not "void".
      disableSuccess: true,
      // This case is ok, because of disableSuccess.
    })) as SuccessInfo;

    setResult(successInfo);
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200 text-center">
        <p className="text-[20px] font-semibold">Review Transaction</p>
      </CardHeader>

      <div>
        {isMint && txImage ? (
          <div className="border-b border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between text-[14px]">
                <div className="text-text-secondary">Asset</div>
                <img
                  src={`${
                    txImage.includes("https://")
                      ? txImage
                      : `https://arweave.net/${txImage}`
                  }`}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className="border-b border-slate-200">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between text-[14px]">
              <div className="text-text-secondary">Dapp</div>
              <Link href={walletLink} target="_blank">
                <ConnectionUrl
                  url={walletLink}
                  size={25}
                  sizeMobile={13}
                  noMargin
                />
              </Link>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <div className="text-text-secondary">Tx Type</div>

              <TxnBadge transactionType={transactionType} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between text-[14px]">
            <div className="text-text-secondary">Amount</div>
            <div className="font-semibold text-gray-800">
              {totalDeposit} NEAR
            </div>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <div className="text-text-secondary">From</div>
            <div className="text-gray-800">
              {creator || accountData?.accountId}
            </div>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <div className="text-text-secondary">To</div>
            <div className="text-gray-800">{to}</div>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className="px-6 pb-8">
            <div className="border-t border-slate-200 p-4" />
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="text-red-500">Warning</div>
                <div className="text-gray-800">{warning.message}</div>
              </div>
            ))}
          </div>
        )}

        <TxnListWrapper
          transaction={transactions}
          showDetails={showTxnDetail}
          modifiedUrl={`https://${walletLink}`}
          setShowTxnDetail={setShowTxnDetail}
          showTxnDetail={showTxnDetail}
        />
      </div>

      {errorMsg && !loading ? (
        <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center text-sm">
          <p className="text-red-300">
            An error occurred trying to execute your transaction: {errorMsg}.
          </p>
          <Button
            className="w-1/2"
            variant="outline"
            onClick={() => {
              updateTxnState({
                error: undefined,
                results: undefined,
                migrationError: undefined,
              });
              setErrorMsg("");
            }}
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      {loading ? <LoadingMessage /> : null}
      {result && !loading ? (
        <TransactionResult result={result} accountId={accountData?.accountId} />
      ) : null}
      {!loading &&
      !result &&
      !errorMsg &&
      creator === accountData?.accountId ? (
        <CardFooter className="flex items-center gap-6">
          <>
            <Button variant="outline" className="w-1/2">
              Decline
            </Button>

            <Button className="w-1/2" onClick={handleSmartAction}>
              Approve
            </Button>
          </>
        </CardFooter>
      ) : null}
    </Card>
  );
};
 */