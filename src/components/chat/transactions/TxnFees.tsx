import { Transaction } from "@near-wallet-selector/core";
import { useTxnFees } from "../../../hooks/useTxnFees";
import { Cost } from "../../../types";
import { TransactionOperation } from "../../../types/transaction";

export const TxnFees = ({
  transaction,
  operation,
  costs,
  gasPrice,
}: {
  transaction: Transaction[];
  operation?: TransactionOperation;
  costs: Cost[];
  gasPrice: string;
}): JSX.Element => {
  const { totalGas, totalDeposit, feeLimitTgas } = useTxnFees(
    transaction,
    costs,
    gasPrice
  );

  const showNoTxnFeeHighlight =
    operation?.operation === "relay" || operation?.operation === "sponsor";

  return (
    <div className='px-6'>
      <div className='relative mb-1 flex w-full flex-col gap-4 rounded border-b border-slate-200 py-6'>
        <span className='text-sm font-semibold'>Network Fees</span>
        <div className='flex flex-col items-start justify-start text-sm md:flex-row md:items-center md:justify-between md:gap-0 md:space-x-4'>
          <span>Estimated Fees</span>
          <div className='flex flex-col'>
            <span className={` ${showNoTxnFeeHighlight ? "line-through" : ""}`}>
              {Number(totalGas).toFixed(5)} NEAR
            </span>
            {showNoTxnFeeHighlight ? (
              <span className='text-end text-shad-green-30'>0 NEAR</span>
            ) : null}
          </div>
        </div>
        <div className='flex flex-col items-start justify-start text-sm md:flex-row md:items-center md:justify-between md:gap-0 md:space-x-4'>
          <span>Fee Limit</span>
          <span>
            {feeLimitTgas} {""}
            Tgas
          </span>
        </div>
        <div className='flex flex-col items-start justify-start text-sm md:flex-row md:items-center md:justify-between md:gap-0 md:space-x-4'>
          <span>Deposit</span>
          <span>
            {totalDeposit} {""}
            NEAR
          </span>
        </div>
      </div>
    </div>
  );
};
