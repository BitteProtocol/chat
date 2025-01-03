import { Wallet } from "@near-wallet-selector/core";
import { Account } from "near-api-js";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { EVMWalletAdapter, SolanaWallet } from "../types";

interface AccountContextType {
  wallet: Wallet;
  account: Account;
  accountId: string | null;
  evmWallet?: EVMWalletAdapter;
  evmAddress?: string;
  solanaWallet?: SolanaWallet;
  solanaAddress?: string;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
  wallet: any;
  account: any;
  evmWallet?: EVMWalletAdapter;
  solanaWallet?: SolanaWallet
}
//TODO fetch solana address
export function AccountProvider({
  children,
  wallet,
  account,
  evmWallet,
  solanaWallet,
}: AccountProviderProps) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [solWallet, setSolWallet] = useState<SolanaWallet>();

  useEffect(() => {
    const getAccountId = async () => {
      if (!accountId) {
        const accounts = wallet ? await wallet.getAccounts() : null;
        setAccountId(accounts?.[0]?.accountId || account?.accountId);
      }
    };
    getAccountId();
  }, [wallet, account, accountId]);

  useEffect(() => {
    const setupSolanaWallet = async () => {
      if (solanaWallet?.provider) {
        setSolWallet(solanaWallet);
      }
    };
    setupSolanaWallet();
  }, [solanaWallet]);

  return (
    <AccountContext.Provider
      value={{
        wallet,
        account,
        accountId,
        evmWallet,
        evmAddress: evmWallet?.address,
        solanaWallet: solWallet,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

export function useWallet() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within an AccountProvider");
  }
  return context.wallet;
}
