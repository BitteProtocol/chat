import { Account } from "near-api-js";
import {
  FinalExecutionOutcome,
  Transaction,
  Wallet,
} from "@near-wallet-selector/core";
import { EthTransactionParams, SignRequestData } from "near-safe";
import { EVMWalletAdapter, SolSignRequest } from "../types";
import { Connection, Transaction as SolTransaction } from "@solana/web3.js";
import type { Provider } from "@reown/appkit-adapter-solana/react";

export interface SuccessInfo {
  near: {
    receipts: FinalExecutionOutcome[];
    transactions: Transaction[];
    encodedTxn?: string;
  };
  solana?: {
    signatures: string[];
    confirmations: Array<{
      status: {
        Ok: null;
      } | {
        Err: any;
      };
      confirmationStatus: "processed" | "confirmed" | "finalized" | null;
    }>;
  };
}

interface UseTransactionProps {
  account?: Account;
  wallet?: Wallet;
  evmWallet?: EVMWalletAdapter;
  solanaConnection?: Connection;
  solanaProvider?: Provider;
}

interface HandleTxnOptions {
  transactions?: Transaction[];
  evmData?: SignRequestData;
  solData?: SolSignRequest;
}

export const useTransaction = ({
  account,
  wallet,
  evmWallet,
  solanaConnection,
  solanaProvider,
}: UseTransactionProps) => {
  const handleTxn = async ({
    transactions,
    evmData,
    solData,
  }: HandleTxnOptions): Promise<SuccessInfo> => {
    const hasNoWalletOrAccount =
      !wallet && !account && !evmWallet?.address && !solanaProvider;
    if (hasNoWalletOrAccount) {
      throw new Error("No wallet or account provided");
    }

    let nearResult;
    let solanaResult;

    if (transactions) {
      nearResult = account
        ? await executeWithAccount(transactions, account)
        : await executeWithWallet(transactions, wallet);
    }

    if (evmData && evmWallet) {
      await executeWithEvmWallet(evmData, evmWallet);
    }

    if (solData && solanaConnection && solanaProvider) {
      solanaResult = await sendSolanaTransaction(
        solData,
        solanaConnection,
        solanaProvider
      );
    }

    return {
      near: {
        receipts: Array.isArray(nearResult) ? nearResult : [],
        transactions: transactions || [],
      },
      solana: solanaResult ? {
        signatures: solanaResult.map(tx => tx.signature),
        confirmations: solanaResult.map(tx => ({
          status: tx.confirmation.err ? { Err: tx.confirmation.err } : { Ok: null },
          confirmationStatus: tx.confirmation.confirmationStatus || null
        }))
      } : undefined
    };
  };

  return {
    handleTxn,
  };
};

export const executeWithAccount = async (
  transactions: Transaction[],
  account: Account
): Promise<FinalExecutionOutcome[]> => {
  const results = await Promise.all(
    transactions.map(async (txn) => {
      if (txn.actions.every((action) => action.type === "FunctionCall")) {
        try {
          return await account.functionCall({
            contractId: txn.receiverId,
            methodName: txn.actions[0].params.methodName,
            args: txn.actions[0].params.args,
            attachedDeposit: BigInt(txn.actions[0].params.deposit),
            gas: BigInt(txn.actions[0].params.gas),
          });
        } catch (error) {
          console.error(
            `Transaction failed for contract ${txn.receiverId}, method ${txn.actions[0].params.methodName}:`,
            error
          );
          return null;
        }
      }
      return null;
    })
  );
  return results.filter(
    (result): result is FinalExecutionOutcome => result !== null
  );
};

export const executeWithWallet = async (
  transactions: Transaction[],
  wallet: Wallet | undefined
): Promise<void | FinalExecutionOutcome[]> => {
  if (!wallet) {
    throw new Error("Can't have undefined account and wallet");
  }
  return wallet.signAndSendTransactions({
    transactions: transactions,
  });
};

export const executeWithEvmWallet = async (
  evmData: SignRequestData,
  evmWallet: EVMWalletAdapter
): Promise<void> => {
  if (!Array.isArray(evmData.params)) {
    throw new Error("Invalid transaction parameters");
  }

  if (
    !evmData.params.every(
      (tx): tx is EthTransactionParams => typeof tx === "object" && "to" in tx
    )
  ) {
    throw new Error("Invalid transaction parameters");
  }

  const txPromises = evmData.params.map((tx) => {
    const rawTxParams = {
      to: tx.to,
      value: tx.value ? BigInt(tx.value) : BigInt(0),
      data: tx.data || "0x",
      from: tx.from,
      gas: tx.gas ? BigInt(tx.gas) : undefined,
    };

    return evmWallet.sendTransaction(rawTxParams);
  });

  await Promise.all(txPromises);
};

async function sendSolanaTransaction(
  signRequest: SolSignRequest,
  connection: Connection,
  walletProvider: Provider
) {
  try {
    const signatures = await Promise.all(
      signRequest.params.map(async (tx) => {
        return walletProvider.sendTransaction(tx, connection);
      })
    );

    const { value: statuses } = await connection.getSignatureStatuses(signatures, {
      searchTransactionHistory: true
    });

    if (!statuses || statuses.some(status => !status)) {
      throw new Error("Failed to confirm one or more transactions");
    }

    const confirmations = statuses.map(status => ({
      err: status?.err,
      confirmationStatus: status?.confirmationStatus
    }));

    return signatures.map((signature, index) => ({
      signature,
      confirmation: confirmations[index]
    }));

  } catch (error) {
    console.error("Failed to send transactions:", error);
    throw error;
  }
}
