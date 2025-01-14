import { FunctionCallAction } from "@near-wallet-selector/core";
import { MoveUpRight } from "lucide-react";
import { getNearblocksURL, shortenString } from "../../../lib/utils";
import { TransactionDetailProps } from "../../../types/transaction";
import TxAccordion from "./TxAccordion";

const DetailMethods = ({
  action,
  method,
}: {
  action: FunctionCallAction;
  method: string;
}) => {
  return (
    <>
      <TxAccordion label='Function Call' methodName={method}>
        <div className='overflow-x-auto rounded bg-shad-white-10 p-2 text-sm'>
          <pre className='p-2 md:p-4'>
            <code>{JSON.stringify(action, null, 2)}</code>
          </pre>
        </div>
      </TxAccordion>
    </>
  );
};

export const TxnDetailMultipleAction = ({
  data,
  accountId,
  actions,
  showDetails,
}: {
  data: TransactionDetailProps;
  accountId: string;
  actions: FunctionCallAction[];
  showDetails: boolean;
}): JSX.Element => {
  const { transaction } = data;

  const contractName = transaction.receiverId;

  return (
    <>
      {showDetails && (
        <div className='flex flex-col'>
          {transaction?.actions?.[0].type === "FunctionCall" && (
            <div className='relative flex w-full flex-col gap-4 rounded p-6'>
              <span className='text-sm font-semibold text-gray-800'>
                Contract Details
              </span>
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
              {actions.length > 1
                ? actions.map((action: FunctionCallAction, idx: number) => {
                    return (
                      <DetailMethods
                        key={idx}
                        action={action}
                        method={action.params.methodName}
                      />
                    );
                  })
                : null}
            </div>
          )}
        </div>
      )}
    </>
  );
};
