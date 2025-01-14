import { Transaction } from "@near-wallet-selector/core";
import { formatCosts } from "../../../../lib/utils";
import { TxnDetailWrapperProps } from "../../../../types/transaction";
import { TxnDetail } from "../TxnDetail";

export const MultipleTxnSingleActionDetail = ({
  accountId,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  gasPrice,
  costs,
}: TxnDetailWrapperProps): JSX.Element => {
  return (
    <>
      {transaction.map((txn: Transaction, idx: number) => {
        const txnData = {
          transaction: txn,
          showDetails,
          modifiedUrl,
          gasPrice,
          ...formatCosts(costs, gasPrice),
        };

        return (
          <div className="bitte-mb-1" key={idx}>
            <TxnDetail
              accountId={accountId}
              showTitle={idx === 0}
              data={txnData}
              showDetails={showTxnDetail}
            />
          </div>
        );
      })}
    </>
  );
};
