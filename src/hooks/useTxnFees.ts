import { usePriceState } from "@/src/lib/state/price.state";
import { removeTrailingZeros } from "@/src/lib/utils/remove-zeros";
import { Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { formatUnits } from "viem";

export const useTxnFees = (transactions: Transaction[]) => {
  /**
   * To have this state filled you need to call useTxnPrice that does the costs and gasPrice calculation ahead of useTxnFees.
   * In the cases we have now /smart-actions and /sign-transaction page, useTxnPrice is called before this hook, in its respective components.
   * This hook is just a parser that depends on priceState to work it.
   */
  const {
    priceState: { costs, gasPrice },
  } = usePriceState();

  // Calculate total gas and deposit for all transactions
  const feeLimitTgasBN =
    transactions?.reduce(
      (acc, txn) =>
        costs && costs.length > 0 ? costs[transactions.indexOf(txn)]?.gas : acc,
      new BN(0)
    ) || new BN(0);

  const feeLimitTgas = formatUnits(BigInt(feeLimitTgasBN.toString()), 12);
  const feeLimitNear = formatNearAmount(
    feeLimitTgasBN.mul(new BN(gasPrice)).toString(),
    6
  );

  const totalDeposit = transactions?.reduce(
    (acc, txn) =>
      acc +
      (costs && costs.length > 0
        ? parseFloat(
            removeTrailingZeros(
              formatNearAmount(
                costs[transactions.indexOf(txn)]?.deposit?.toString() || "0",
                3
              )
            )
          )
        : 0),
    0
  );

  return {
    totalGas: feeLimitNear,
    totalDeposit,
    feeLimitTgas,
  };
};
