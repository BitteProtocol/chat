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
    <div className="bitte-px-6">
      <div className="bitte-relative bitte-mb-1 bitte-flex bitte-w-full bitte-flex-col bitte-gap-4 bitte-rounded bitte-border-b bitte-border-slate-200 bitte-py-6">
        <span className="bitte-text-sm bitte-font-semibold bitte-text-gray-800">
          Network Fees
        </span>
        <div className="bitte-flex bitte-flex-col bitte-items-start bitte-justify-start bitte-text-sm bitte-md:flex-row bitte-md:items-center bitte-md:justify-between bitte-md:gap-0 bitte-md:space-x-4">
          <span className="bitte-text-text-secondary">Estimated Fees</span>
          <div className="bitte-flex bitte-flex-col">
            <span
              className={`text-gray-800 ${showNoTxnFeeHighlight ? "line-through" : ""}`}
            >
              {Number(totalGas).toFixed(5)} NEAR
            </span>
            {showNoTxnFeeHighlight ? (
              <span className="bitte-text-end bitte-text-shad-green-30">0 NEAR</span>
            ) : null}
          </div>
        </div>
        <div className="bitte-flex bitte-flex-col bitte-items-start bitte-justify-start bitte-text-sm bitte-md:flex-row bitte-md:items-center bitte-md:justify-between bitte-md:gap-0 bitte-md:space-x-4">
          <span className="bitte-text-text-secondary">Fee Limit</span>
          <span className="bitte-text-gray-800">
            {feeLimitTgas} {""}
            Tgas
          </span>
        </div>
        <div className="bitte-flex bitte-flex-col bitte-items-start bitte-justify-start bitte-text-sm bitte-md:flex-row bitte-md:items-center bitte-md:justify-between bitte-md:gap-0 bitte-md:space-x-4">
          <span className="bitte-text-text-secondary">Deposit</span>
          <span className="bitte-text-gray-800">
            {totalDeposit} {""}
            NEAR
          </span>
        </div>
      </div>
    </div>
  );
};
