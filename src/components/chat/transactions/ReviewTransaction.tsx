"use client";
import { Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { SafeEncodedSignRequest } from "near-safe";
import { useEffect, useState } from "react";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { SuccessInfo, useTransaction } from "../../../hooks/useTransaction";
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
  creator,
  evmData,
  agentId,
  walletLoading,
  borderColor,
  textColor,
}: {
  transactions: Transaction[];
  warnings?: BitteToolWarning[] | null;
  creator?: string;
  evmData?: SafeEncodedSignRequest;
  agentId: string;
  walletLoading?: boolean;
  borderColor: string;
  textColor: string;
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

  if (!account || !accountId) return <></>;

  const { balance } = useAccountBalance(account);

  const { costs, gasPrice } = useTxnPrice(new BN(balance || 0), transactions);

  useEffect(() => {
    const getUrlTxResult = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const txHash = urlParams.get("transactionHashes");
      if (txHash) {
        setResult({ near: { receipts: [{ transaction: { hash: txHash } }] } });
      }
    };

    getUrlTxResult();
  }, []);

  const loading = walletLoading || isLoading;

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  if (!transactions || transactions.length === 0) {
    return (
      <p
        className='my-6 overflow-auto text-center'
        style={{ color: textColor }}
      >
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
    setIsLoading(true);
    setErrorMsg("");
    try {
      const successInfo = (await handleTxn({
        data: {
          transactions: transactions,
          evmData,
        },
        disableSuccess: true,
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
    <Card>
      <CardHeader
        className='border-b text-center'
        style={{ borderColor: borderColor }}
      >
        <p className='text-[20px] font-semibold'>Review Transaction</p>
      </CardHeader>

      <div>
        {isMint && txImage ? (
          <div className='border-b' style={{ borderColor: borderColor }}>
            <div className='p-6'>
              <div className='flex items-center justify-between text-[14px]'>
                <div style={{ color: textColor }}>Asset</div>
                <img
                  src={`${
                    txImage.includes("https://")
                      ? txImage
                      : `https://arweave.net/${txImage}`
                  }`}
                  width={64}
                  height={64}
                  className='rounded-md'
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className='border-b' style={{ borderColor: borderColor }}>
          <div className='flex flex-col gap-6 p-6'>
            <div className='flex items-center justify-between text-[14px]'>
              <div style={{ color: textColor }}>Dapp</div>
              {/* <Link href={walletLink} target="_blank">
                <ConnectionUrl
                  url={walletLink}
                  size={25}
                  sizeMobile={13}
                  noMargin
                />
              </Link> */}
            </div>
            <div className='flex items-center justify-between text-[14px]'>
              <div style={{ color: textColor }}>Tx Type</div>

              <TxnBadge transactionType={transactionType} />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-6 p-6' style={{ color: textColor }}>
          <div className='flex items-center justify-between text-[14px]'>
            <div>Amount</div>
            <div className='font-semibold'>
              {/* TODO */}
              {} NEAR
            </div>
          </div>
          <div className='flex items-center justify-between text-[14px]'>
            <div>From</div>
            <div>{accountId}</div>
          </div>
          <div className='flex items-center justify-between text-[14px]'>
            <div>To</div>
            <div>{to}</div>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className='px-6 pb-8'>
            <div
              className='border-t p-4'
              style={{ borderColor: borderColor }}
            />
            {warnings.map((warning, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <div className='text-red-500'>Warning</div>
                <div className='text-gray-800'>{warning.message}</div>
              </div>
            ))}
          </div>
        )}

        <TxnListWrapper
          transaction={transactions}
          accountId={accountId}
          costs={costs || []}
          gasPrice={gasPrice || "0"}
          showDetails={showTxnDetail}
          modifiedUrl={`https://wallet.bitte.ai`}
          setShowTxnDetail={setShowTxnDetail}
          showTxnDetail={showTxnDetail}
        />
      </div>

      {errorMsg && !loading ? (
        <div className='flex flex-col items-center gap-4 px-6 pb-6 text-center text-sm'>
          <p className='text-red-300'>
            An error occurred trying to execute your transaction: {errorMsg}.
          </p>
          <Button
            className='w-1/2'
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
        <TransactionResult
          result={result}
          accountId={accountId}
          textColor={textColor}
        />
      ) : null}
      {!loading && !result && !errorMsg && accountId ? (
        <CardFooter className='flex items-center gap-6'>
          <>
            <Button variant='outline' className='w-1/2'>
              Decline
            </Button>

            <Button className='w-1/2' onClick={handleSmartAction}>
              Approve
            </Button>
          </>
        </CardFooter>
      ) : null}
    </Card>
  );
};
