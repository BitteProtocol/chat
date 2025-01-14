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
    <div className='mt-4'>
      <p className='text-center text-[14px] font-semibold'>
        Transaction success
      </p>
      <div className='flex flex-col gap-4 p-6 text-[14px]'>
        {evm?.txHash && scanUrl && (
          <div className='flex items-center justify-between px-6 text-[14px]'>
            <div className='text-text-secondary'>EVM Transaction</div>
            <a
              className='flex gap-1 text-gray-800 items-center'
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
              className='flex items-center justify-between px-6 text-[14px]'
            >
              <div className='text-text-secondary'>Near Transaction</div>
              <a
                className='flex gap-1 items-center text-gray-800'
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
