import { getLatestGasPrice } from "@mintbase-js/rpc/lib/methods/getLatestGasPrice.js";
import {
  Action,
  FunctionCallAction,
  Transaction,
} from "@near-wallet-selector/core";
import BN from "bn.js/";
import { formatNearAmount } from "near-api-js/lib/utils/format.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { RPC_URL } from "../lib/constants";
import { Cost } from "../types";
import { ActionCosts } from "../types/transaction";

export const useTxnPrice = (balance: BN, transactions?: Transaction[]) => {
  const [hasBalance, setHasBalance] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const [priceState, setPriceState] = useState<{
    gasPrice: string;
    costs: Cost[];
    price: string;
  }>({
    gasPrice: "0",
    costs: [],
    price: "0",
  });

  const gasPriceFetched = useRef(false);
  const costsCalculated = useRef(false);

  const updatePriceState = (updates: Partial<typeof priceState>) => {
    setPriceState((prevState) => ({ ...prevState, ...updates }));
  };

  const COSTS: Record<ActionCosts, BN> = {
    CreateAccount: new BN(420000000000),
    Transfer: new BN(450000000000),
    Stake: new BN(50000000000),
    AddFullAccessKey: new BN(420000000000),
    DeleteKey: new BN(410000000000),
  };

  useEffect(() => {
    const definePrice = async () => {
      try {
        const currentGasPrice = await getLatestGasPrice(RPC_URL);
        updatePriceState({ gasPrice: currentGasPrice.toString() });
        gasPriceFetched.current = true;
      } catch (error) {
        console.error("Failed to fetch gas price:", error);
        updatePriceState({ gasPrice: '100000000' });
      }
    };
    if (priceState?.gasPrice === "0") {
      definePrice();
    }
  }, [priceState?.gasPrice]);

  useEffect(() => {
    const defineCosts = () => {
      if (!transactions || transactions.length === 0) return;
      const costs = transactions.map((txn) => {
        const actionCosts = txn.actions.map((action: Action) => {
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
        });
        return actionCosts.reduce((acc, x) => ({
          deposit: acc.deposit.add(x.deposit),
          gas: acc.gas.add(x.gas),
        }));
      });

      if (JSON.stringify(priceState.costs) !== JSON.stringify(costs)) {
        updatePriceState({ costs: costs });
      }

      const { deposit } = costs.reduce((acc, x) => ({
        deposit: acc.deposit.add(x.deposit),
        gas: acc.gas.add(x.gas),
      }));

      const hasBalance = deposit.lt(balance);

      updatePriceState({
        price: deposit.toString(),
      });

      if (hasBalance !== hasBalance) {
        setHasBalance(hasBalance);
      }

      if (!loaded) {
        setLoaded(true);
      }

      costsCalculated.current = true;
    };

    if (
      !costsCalculated.current &&
      Number(priceState?.gasPrice) !== 0 &&
      balance !== undefined
    ) {
      defineCosts();
    }
  }, [priceState?.gasPrice, balance, transactions]);

  const otherTokensAmount = useMemo(() => {
    if (!transactions?.length) return;
    return transactions
      .map((txn) => {
        const functionCallAction = txn.actions.find(
          (action) =>
            action.type === "FunctionCall" &&
            action.params.methodName !== "storage_deposit"
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
  }, [transactions]);

  const amount = useMemo(() => {
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
  }, [priceState.price, otherTokensAmount, priceState?.costs]);

  const memoizedReturn = useMemo(() => {
    return {
      amount,
      gasPrice: priceState?.gasPrice,
      hasBalance: !!loaded ? hasBalance : true,
      costs: priceState.costs,
      loaded,
    };
  }, [amount, priceState?.gasPrice, hasBalance, priceState?.costs, loaded]);

  return memoizedReturn;
};
