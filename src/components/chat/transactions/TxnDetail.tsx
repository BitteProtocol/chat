import { MoveUpRight } from "lucide-react";
import { getNearblocksURL, shortenString } from "../../../lib/utils";
import { TransactionDetailProps } from "../../../types/transaction";
import TxAccordion from "./TxAccordion";

export const TxnDetail = ({
  data,
  showDetails,
  showTitle,
  methodName,
  accountId,
}: {
  data: TransactionDetailProps;
  showDetails: boolean;
  showTitle: boolean;
  methodName?: string;
  accountId: string;
}): JSX.Element => {
  const { transaction } = data;

  let method = methodName;
  if (!method && transaction?.actions?.[0]?.type == "FunctionCall") {
    method = transaction.actions[0].params.methodName;
  }

  const contractName = transaction.receiverId;

  return (
    <>
      {!!showDetails && (
        <div className='flex flex-col'>
          {transaction?.actions?.[0].type === "FunctionCall" && (
            <div className='relative flex w-full flex-col gap-4 rounded p-6'>
              {showTitle ? (
                <span className='text-sm font-semibold text-gray-800'>
                  Contract Details
                </span>
              ) : null}
              <div className='flex flex-col items-start justify-start gap-2 text-sm md:flex-row md:items-center md:justify-between md:gap-0 md:space-x-4'>
                <span className='text-text-secondary'>For Contract</span>
                <span className='cursor-pointer'>
                  <a
                    className='flex gap-1 items-center text-gray-800'
                    href={getNearblocksURL(accountId, undefined, contractName)}
                    target='_blank'
                  >
                    {shortenString(contractName, 14)}
                    <MoveUpRight width={12} height={12} />
                  </a>
                </span>
              </div>
              {method && (
                <>
                  <TxAccordion label='Function Call' methodName={method}>
                    <div className='overflow-x-auto rounded bg-shad-white-10 p-2 text-sm text-text-primary'>
                      <pre className='p-2 md:p-4'>
                        <code>
                          {JSON.stringify(
                            transaction?.actions?.[0].params?.args,
                            null,
                            2
                          )}
                        </code>
                      </pre>
                    </div>
                  </TxAccordion>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
