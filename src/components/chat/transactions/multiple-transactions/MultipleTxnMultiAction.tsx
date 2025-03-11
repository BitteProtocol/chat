import { FunctionCallAction, Transaction } from '@near-wallet-selector/core';
import { formatCosts } from '../../../../lib/utils';
import { TxnDetailWrapperProps } from '../../../../types/transaction';
import { TxnDetailMultipleAction } from '../TxnDetailMultipleAction';

export const MultipleTxnMultiActionDetails = ({
  accountId,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  costs,
  gasPrice,
}: TxnDetailWrapperProps): JSX.Element => {
  return (
    <>
      {transaction.map((txn: Transaction, txnIdx: number) => {
        const txnData = {
          // TODO: Ensure that the actions are always FunctionCallAction.
          transaction: txn,
          showDetails,
          modifiedUrl,
          gasPrice,
          ...formatCosts(costs, gasPrice),
        };

        return (
          <TxnDetailMultipleAction
            accountId={accountId}
            key={txnIdx}
            data={txnData}
            showDetails={showTxnDetail}
            actions={txnData.transaction.actions as FunctionCallAction[]}
          />
        );
      })}
    </>
  );
};
