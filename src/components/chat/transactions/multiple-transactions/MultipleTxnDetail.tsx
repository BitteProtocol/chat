import { TxnDetailWrapperProps } from '../../../../types/transaction';
import { MultipleTxnMultiActionDetails } from './MultipleTxnMultiAction';
import { MultipleTxnSingleActionDetail } from './MultipleTxnSingleAction';

export const MultipleTxnDetail = ({
  accountId,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  costs,
  gasPrice,
}: TxnDetailWrapperProps): JSX.Element => {
  const hasMultipleActions = transaction.every(
    (tx) => tx.actions && tx.actions.length > 1,
  );

  return hasMultipleActions ? (
    <MultipleTxnMultiActionDetails
      accountId={accountId}
      costs={costs}
      gasPrice={gasPrice}
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  ) : (
    <MultipleTxnSingleActionDetail
      accountId={accountId}
      costs={costs}
      gasPrice={gasPrice}
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  );
};
