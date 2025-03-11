import { TransactionListProps } from '../../../types';
import { MultipleTxnDetail } from './multiple-transactions/MultipleTxnDetail';
import { ShowDetailsBtn } from './ShowDetailsBtn';
import { SingleTxnDetail } from './single-transaction/SingleTxnDetail';
import { TxnFees } from './TxnFees';

export const TxnListWrapper = ({
  accountId,
  costs,
  gasPrice,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  setShowTxnDetail,
  operation,
  borderColor,
}: TransactionListProps): JSX.Element => {
  return (
    <div className="bitte-mx-auto bitte-flex bitte-w-full bitte-flex-col bitte-gap-1">
      <div className="bitte-flex bitte-w-full bitte-flex-col bitte-justify-center bitte-rounded">
        <ShowDetailsBtn
          setShowDetails={setShowTxnDetail}
          showDetails={showTxnDetail}
          displayName="Transaction Details"
        />

        {showTxnDetail ? (
          <TxnFees
            costs={costs || []}
            gasPrice={gasPrice || ''}
            transaction={transaction}
            operation={operation}
            borderColor={borderColor}
          />
        ) : null}

        {transaction?.length > 1 ? (
          <MultipleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ''}
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
          />
        ) : (
          <SingleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ''}
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
          />
        )}
      </div>
    </div>
  );
};
