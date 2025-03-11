import { TxnDetailWrapperProps } from '../../../../types/transaction';
import { SingleTxnMultipleAction } from './SingleTxnMultipleAction';
import { SingleTxnSingleAction } from './SingleTxnSingleAction';

export const SingleTxnDetail = ({
  accountId,
  costs,
  gasPrice,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
}: TxnDetailWrapperProps): JSX.Element => {
  const hasMultipleActions = transaction?.[0]?.actions?.length > 1;

  return hasMultipleActions ? (
    <SingleTxnMultipleAction
      accountId={accountId}
      costs={costs}
      gasPrice={gasPrice}
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  ) : (
    <SingleTxnSingleAction
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
