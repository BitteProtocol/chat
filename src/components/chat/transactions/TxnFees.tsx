import { Transaction } from "@near-wallet-selector/core";
import { useTxnFees } from "../../../hooks/useTxnFees";
import { Cost } from "../../../types";
import { TransactionOperation } from "../../../types/transaction";

export const TxnFees = ({
  transaction,
  operation,
  costs,
  gasPrice,

  borderColor,
}: {
  transaction: Transaction[];
  operation?: TransactionOperation;
  costs: Cost[];
  gasPrice: string;
  borderColor: string;
}): JSX.Element => {
  const { totalGas, totalDeposit, feeLimitTgas } = useTxnFees(
    transaction,
    costs,
    gasPrice
  );

  const showNoTxnFeeHighlight =
    operation?.operation === "relay" || operation?.operation === "sponsor";

  return (
    <div className="bitte:px-6">
      <div
        className="bitte:relative bitte:mb-1 bitte:flex bitte:w-full bitte:flex-col bitte:gap-4 bitte:rounded bitte:border-b bitte:border-slate-200 bitte:py-6"
        style={{ borderColor: borderColor }}
      >
        <span className="bitte:text-sm bitte:font-semibold">Network Fees</span>
        <div className="bitte:flex bitte:flex-col bitte:items-start bitte:justify-start bitte:text-sm bitte:md:flex-row bitte:md:items-center bitte:md:justify-between bitte:md:gap-0 bitte:md:space-x-4">
          <span>Estimated Fees</span>
          <div className="bitte:flex bitte:flex-col">
            <span className={` ${showNoTxnFeeHighlight ? "bitte:line-through" : ""}`}>
              {Number(totalGas).toFixed(5)} NEAR
            </span>
            {showNoTxnFeeHighlight ? (
              <span className="bitte:text-end bitte:text-shad-green-30">0 NEAR</span>
            ) : null}
          </div>
        </div>
        <div className="bitte:flex bitte:flex-col bitte:items-start bitte:justify-start bitte:text-sm bitte:md:flex-row md:ibitte-tems-center bitte:md:justify-between bitte:md:gap-0 bitte:md:space-x-4">
          <span>Fee Limit</span>
          <span>
            {feeLimitTgas} {""}
            Tgas
          </span>
        </div>
        <div className="bitte:flex bitte:flex-col bitte:items-start bitte:justify-start bitte:text-sm bitte:md:flex-row bitte:md:items-center bitte:md:justify-between bitte:md:gap-0 bitte:md:space-x-4">
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
