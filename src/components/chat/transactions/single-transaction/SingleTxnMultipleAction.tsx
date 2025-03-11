import { FunctionCallAction } from '@near-wallet-selector/core';
import { formatCosts } from '../../../../lib/utils';
import { TxnDetailWrapperProps } from '../../../../types/transaction';
import { TxnDetailMultipleAction } from '../TxnDetailMultipleAction';

export const SingleTxnMultipleAction = ({
  transaction,
  accountId,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  costs,
  gasPrice,
}: TxnDetailWrapperProps): JSX.Element => {
  const txnData = {
    transaction: transaction[0],
    showDetails,
    modifiedUrl,
    gasPrice,
    ...formatCosts(costs, gasPrice),
  };

  return (
    <TxnDetailMultipleAction
      accountId={accountId}
      data={txnData}
      showDetails={showTxnDetail}
      actions={txnData.transaction.actions as FunctionCallAction[]}
    />
  );
};
