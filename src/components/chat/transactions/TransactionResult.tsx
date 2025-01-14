import { MoveUpRight } from "lucide-react";
import { Network } from "near-safe";
import { getNearblocksURL, shortenString } from "../../../lib/utils";

export const TransactionResult = ({
  result: { evm, near },
  accountId,
}: any) => {
  const scanUrl = evm?.txHash
    ? `${Network.fromChainId(evm.chainId).scanUrl}/tx/${evm.txHash}`
    : null;

  return (
    <div className="bitte-mt-4">
      <p className="bitte-text-center text-[14px] bitte-font-semibold">
        Transaction success
      </p>
      <div className="bitte-flex bitte-flex-col bitte-gap-4 bitte-p-6 text-[14px]">
        {evm?.txHash && scanUrl && (
          <div className="bitte-flex bitte-items-center bitte-justify-between bitte-px-6 text-[14px]">
            <div className="bitte-text-text-secondary">EVM Transaction</div>
            <a
              className="bitte-flex bitte-gap-1 bitte-text-gray-800 bitte-items-center"
              href={scanUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {shortenString(evm.txHash, 10)}
              <MoveUpRight width={12} height={12} />
            </a>
          </div>
        )}
        {near?.receipts &&
          near.receipts.map((receipt: any) => (
            <div
              key={receipt.transaction.hash}
              className="bitte-flex bitte-items-center bitte-justify-between bitte-px-6 text-[14px]"
            >
              <div className="bitte-text-text-secondary">Near Transaction</div>
              <a
                className="bitte-flex bitte-gap-1 bitte-items-center bitte-text-gray-800"
                href={getNearblocksURL(accountId, receipt.transaction.hash)}
                target='_blank'
                rel='noopener noreferrer'
              >
                {shortenString(receipt.transaction.hash, 10)}
                <MoveUpRight width={12} height={12} />
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};
