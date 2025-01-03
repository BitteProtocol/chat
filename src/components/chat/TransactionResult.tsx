import { Network } from "near-safe";
import { getNearblocksURL, shortenString } from "../../lib/utils";

export const TransactionResult = ({
  result: { evm, near, solana },
  accountId,
  textColor,
}: any) => {
  const scanUrl = evm?.txHash
    ? `${Network.fromChainId(evm.chainId).scanUrl}/tx/${evm.txHash}`
    : null;

  return (
    <div className='mt-4'>
      <p className='text-center text-[14px] font-semibold'>
        Transaction success
      </p>
      <div
        className='flex flex-col gap-4 p-6 text-[14px]'
        style={{ color: textColor }}
      >
        {evm?.txHash && scanUrl && (
          <div className='flex items-center justify-between px-6 text-[14px]'>
            <div>EVM Transaction</div>
            <a
              className='flex gap-1 text-gray-800'
              href={scanUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {shortenString(evm.txHash, 10)}
              <img src='/open-tab.svg' width={12} alt='Open in new tab' />
            </a>
          </div>
        )}
        {near?.receipts &&
          near.receipts.map((receipt: any) => (
            <div
              key={receipt.transaction.hash}
              className='flex items-center justify-between px-6 text-[14px]'
            >
              <div>Near Transaction</div>
              <a
                className='flex gap-1'
                href={getNearblocksURL(accountId, receipt.transaction.hash)}
                target='_blank'
                rel='noopener noreferrer'
              >
                {shortenString(receipt.transaction.hash, 10)}
                <img src='/open-tab.svg' width={12} alt='Open in new tab' />
              </a>
            </div>
          ))}
        {solana?.signatures && 
          solana.signatures.map((signature: string, index: number) => (
            <div
              key={signature}
              className='flex items-center justify-between px-6 text-[14px]'
            >
              <div>Solana Transaction</div>
              <a
                className='flex gap-1'
                href={`https://explorer.solana.com/tx/${signature}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {shortenString(signature, 10)}
                <img src='/open-tab.svg' width={12} alt='Open in new tab' />
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};
