import { TransactionListProps } from "../../../types";
import { MultipleTxnDetail } from "./multiple-transactions/MultipleTxnDetail";
import { ShowDetailsBtn } from "./ShowDetailsBtn";
import { SingleTxnDetail } from "./single-transaction/SingleTxnDetail";
import { TxnFees } from "./TxnFees";

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
}: TransactionListProps): JSX.Element => {
  return (
    <div className='mx-auto flex w-full flex-col gap-1'>
      <div className='flex w-full flex-col justify-center rounded'>
        <ShowDetailsBtn
          setShowDetails={setShowTxnDetail}
          showDetails={showTxnDetail}
          displayName='Transaction Details'
        />

        {showTxnDetail ? (
          <TxnFees
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            operation={operation}
          />
        ) : null}

        {transaction?.length > 1 ? (
          <MultipleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
          />
        ) : (
          <SingleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ""}
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
