import { Transaction } from "@near-wallet-selector/core";
import BN from  "bn.js/lib/bn.js";
import { formatNearAmount } from "near-api-js/lib/utils/format.js";
import { formatUnits } from "viem";
import { removeTrailingZeros } from "../lib/utils";
import { Cost } from "../types";

export const useTxnFees = (
  transactions: Transaction[],
  costs: Cost[],
  gasPrice: string
) => {
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
