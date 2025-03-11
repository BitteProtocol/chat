import { formatCosts } from '../../../../lib/utils';
import { TxnDetailWrapperProps } from '../../../../types/transaction';
import { TxnDetail } from '../TxnDetail';
export const SingleTxnSingleAction = ({
  accountId,
  transaction,
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
    <TxnDetail
      accountId={accountId}
      showTitle
      data={txnData}
      showDetails={showTxnDetail}
    />
  );
};
