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
        <div className="bitte:overflow-x-auto bitte:rounded bitte:bg-shad-white-10 bitte:p-2 bitte:text-sm">
          <pre className="bitte:p-2 bitte:md:p-4">
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
        <div className="bitte:flex bitte:flex-col">
          {transaction?.actions?.[0].type === "FunctionCall" && (
            <div className="bitte:relative bitte:flex bitte:w-full bitte:flex-col bitte:gap-4 bitte:rounded bitte:p-6">
              <span className="bitte:text-sm bitte:font-semibold">Contract Details</span>
              <div className="bitte:flex bitte:flex-col bitte:items-start bitte:justify-start bitte:gap-2 bitte:text-sm bitte-md:flex-row bitte-md:items-center bitte-md:justify-between bitte-md:gap-0 bitte-md:space-x-4">
                <span>For Contract</span>
                <span className="bitte:cursor-pointer">
                  <a
                    className="bitte:flex bitte:gap-1 bitte:items-center"
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
