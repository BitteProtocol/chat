import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getLatestGasPrice } from "@mintbase-js/rpc";
import { FT_METHOD_NAMES } from "@mintbase-js/sdk";
import {
  Action,
  FunctionCallAction,
  Transaction,
} from "@near-wallet-selector/core";
import BN from "bn.js";
import { useAtomValue } from "jotai";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { formatUnits } from "viem";

import { useNearPrice } from "@/src/hooks/data/useNearPrice";
import useRpcNode from "@/src/hooks/data/useRpcNodes";
import { usePriceState } from "@/src/lib/state/price.state";
import { state } from "@/src/lib/state/state";
import { ActionCosts } from "@/src/lib/types/transaction";
import { calculateUsd } from "@/src/lib/utils/calculate-usd";
import { getTransactionsFromParam } from "@/src/lib/utils/transactions";
import { useWalletContext } from "@/src/providers/WalletProvider";

export const useTxnPrice = (transactions?: Transaction[]) => {
  const transactionsDataParam = useSearchParams().get("transactions_data");

  const { balance } = useWalletContext();

  const txns = transactionsDataParam
    ? getTransactionsFromParam(transactionsDataParam)
    : transactions;

  const [hasBalance, setHasBalance] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const { priceState, updatePriceState } = usePriceState();

  const { rpcUrl } = useRpcNode();

  const token = useAtomValue(state.token);

  const { nearPrice: currentNearPrice } = useNearPrice();

  const tokenUsdCalc = useMemo(() => {
    return (token && token?.meta.name === "NEAR") || !token
      ? calculateUsd(
          Number(currentNearPrice),
          undefined,
          formatNearAmount(priceState.price, 6)
        )
      : null;
  }, [token, currentNearPrice, priceState.price]);

  // taken from https://docs.near.org/concepts/basics/transactions/gas#the-cost-of-common-actions
  // TODO: get live costs using RPC method `protocol_config`
  const COSTS: Record<ActionCosts, BN> = {
    CreateAccount: new BN(420000000000), // 0.42 TGas
    Transfer: new BN(450000000000), // 0.45 TGas
    Stake: new BN(50000000000), // 0.50 TGas
    AddFullAccessKey: new BN(420000000000), // 0.42 TGas
    DeleteKey: new BN(410000000000), // 0.41 TGas
  };

  // this useEffect is just to setGasPrice first

  useEffect(() => {
    const definePrice = async () => {
      const currentGasPrice = await getLatestGasPrice(rpcUrl);
      updatePriceState({ gasPrice: currentGasPrice.toString() });
    };
    if (Number(priceState?.gasPrice) == 0 && rpcUrl) {
      definePrice();
    }
  }, [priceState?.gasPrice, rpcUrl]);

  useEffect(() => {
    const defineCosts = () => {
      if (!txns || txns.length === 0) return;
      // aggregates deposits as `deposit` (yoctoNEAR) and gas as `gas` (Tgas)
      const costs = txns.map((txn) => {
        const actionCosts: { deposit: BN; gas: BN }[] = txn.actions.map(
          (action: Action) => {
            switch (action.type) {
              case "FunctionCall":
                return {
                  deposit: new BN(action.params.deposit || "0"),
                  gas: new BN(action.params.gas),
                };
              case "Transfer":
                return {
                  deposit: new BN(action.params.deposit || "0"),
                  gas: COSTS[action.type as ActionCosts],
                };
              default:
                return {
                  deposit: new BN("0"),
                  gas: COSTS[action.type as ActionCosts],
                };
            }
          }
        );
        return actionCosts.reduce((acc, x) => ({
          deposit: acc.deposit.add(x.deposit),
          gas: acc.gas.add(x.gas),
        }));
      });

      updatePriceState({ costs: costs });

      const { deposit } = costs.reduce((acc, x) => ({
        deposit: acc.deposit.add(x.deposit),
        gas: acc.gas.add(x.gas),
      }));
      // TODO: gas not accounted for in hasBalance.
      // https://github.com/Mintbase/mintbase-wallet/issues/869
      const hasBalance = deposit.lt(balance);

      updatePriceState({ price: deposit.toString() });
      setHasBalance(hasBalance);
      setLoaded(true);
    };

    if (Number(priceState?.gasPrice) !== 0 && balance !== undefined) {
      defineCosts();
    }
  }, [priceState?.gasPrice, balance]);

  const otherTokensAmount = useMemo(() => {
    if (!txns) return;
    return txns
      .map((txn) => {
        const functionCallAction = txn.actions.find(
          (action) =>
            action.type === "FunctionCall" &&
            action.params.methodName !== FT_METHOD_NAMES.STORAGE_DEPOSIT
        );
        if (!functionCallAction) return null;
        const args = (functionCallAction as FunctionCallAction)?.params?.args;
        return (
          ("amount" in args &&
            typeof args?.amount === "string" &&
            args?.amount) ||
          null
        );
      })
      .find((amount) => amount !== null);
  }, [txns]);

  const amount = useMemo(() => {
    if (token) {
      if (token.meta.name === "NEAR") {
        return formatNearAmount(priceState?.price, 6);
      } else {
        return formatUnits(
          BigInt(otherTokensAmount || "0"),
          token.meta.decimals
        ).toString();
      }
    } else {
      const costsAmount =
        priceState.costs?.[0]?.deposit &&
        formatNearAmount(priceState.costs?.[0]?.deposit.toString(), 3);
      if (
        ["0", "0.000", null, undefined, ""].includes(costsAmount) ||
        isNaN(Number(costsAmount))
      ) {
        return formatNearAmount(otherTokensAmount || "0", 3);
      } else {
        return costsAmount;
      }
    }
  }, [token, priceState.price, otherTokensAmount, priceState?.costs]);

  const memoizedReturn = useMemo(() => {
    return {
      amount,
      gasPrice: priceState?.gasPrice,
      hasBalance: !!loaded ? hasBalance : true,
      costs: priceState.costs,
      loaded,
      tokenCalculation: tokenUsdCalc,
    };
  }, [
    amount,
    priceState?.gasPrice,
    hasBalance,
    priceState?.costs,
    loaded,
    tokenUsdCalc,
  ]);

  return memoizedReturn;
};
