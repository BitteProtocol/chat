import type {
  FinalExecutionOutcome,
  Transaction,
} from "@near-wallet-selector/core";
import BN from  "bn.js/lib/bn.js";
import { Account } from "near-api-js";
import { SafeEncodedSignRequest } from "near-safe";
import { SuccessInfo } from "../hooks/useTransaction";
import { AccountCreationData } from "./types";

type ActionObject = {
  send: () => Promise<void>;
  show: () => void;
  try: () => void;
};

export type Arguments = {
  autotransfer?: boolean;
  account_id?: string;
  msg?: string;
  token_id?: string;
  metadata?: Metadata | string;
  num_to_mint?: number;
  owner_id?: string;
  royalty_args?: string | number | null;
  split_owners?: string | number | null;
  token_ids_to_mint?: string | number | null;
  receiver_id?: string;
  token_ids?: string[];
  methodName?: string;
  amount?: string | number;
  memo?: string | null;
  nft_contract_id?: string | null;
  title?: string;
  tokenImg?: string;
};

type Metadata = {
  media: string;
  reference: string;
  title?: string;
  description?: string;
};

export type TransactionListProps = {
  transaction: Transaction[];
  operation?: TransactionOperation;
  actions?: ActionObject;
  modifiedUrl: string;
  showDetails: boolean;
  showTxnDetail: boolean;
  setShowTxnDetail: (showTxnDetail: boolean) => void;
};

export type TxnDetailWrapperProps = {
  accountId: string;
  transaction: Transaction[];
  modifiedUrl: string;
  showDetails: boolean;
  showTxnDetail: boolean;
  costs: Cost[];
  gasPrice: string;
};

export type TransactionDetailProps = {
  transaction: Transaction;
  showDetails: boolean;
  modifiedUrl: string;
  gas: string | number;
  deposit: string | number;
};

export type FlattenTransactionResults = {
  hash: string;
  sender: string;
  receiver: string;
  txn: Transaction[];
  type: string;
};

export type ActionCosts =
  | "CreateAccount"
  | "Transfer"
  | "Stake"
  | "AddFullAccessKey"
  | "DeleteKey";

export interface TransactionState {
  sponsor?: string;
  isLoading: boolean;
  exportLoading: boolean;
  migrationError: string | null;
  migrationLoading: boolean;
  results: FinalExecutionOutcome[] | null;
  error?: { message: string };
}

export type SendTransactionParams = {
  data?: TransactionDetails;
  operation?: TransactionOperation;
  account?: Account;
  disableLoading?: boolean;
  disableSuccess?: boolean;
};

export type NearTransactionParams = {
  transactions: Transaction[];
  account: Account;
};

export type SendTransactionFunction = (
  args?: SendTransactionParams
) => Promise<SuccessInfo | void>;

//FIX ME: IMPROVE TYPES
/* type SponsoringInfo = {
  sponsorId: string;
  paymasterId: string;
  cost: string;
  fee: string;
};
export type TransactionOperationResult =
  | { error: string }
  | { operation: "near" | "credits" | "relay" }
  | ({ operation: "sponsor" } & SponsoringInfo); */

export type TransactionOperation = {
  operation: Operation;
  sponsorId?: string;
  paymasterId?: string;
  cost?: string;
  fee?: string;
};

export interface UrlData {
  successUrl?: string;
  callbackUrl?: string;
}

export interface TransactionDetails {
  transactions: Transaction[];
  isDrop?: boolean;
  evmData?: SafeEncodedSignRequest;
}

export interface TransactionProps {
  operation?: TransactionOperation;
  accountData?: AccountCreationData;
  transactionData?: TransactionDetails;
  urlData?: UrlData;
  agentId?: string;
}

export interface TransactionPageProps extends TransactionProps {
  referer: string | null;
}

export interface SendTransactionData {
  operation: TransactionOperation;
  account: Account;
  details: TransactionDetails;
  urlData?: UrlData;
}

export interface TransactionErrorProps {
  error: string;
  transactions: Transaction[];
  accountId: string;
  urlData?: UrlData;
}

export enum Operation {
  NEAR = "near",
  RELAY = "relay",
  SPONSOR = "sponsor",
}

interface Cost {
  deposit: BN;
  gas: BN;
}
