import { ReactNode } from "react";

import {
  FunctionCallAction,
  Transaction,
  TransferAction,
  Wallet,
} from "@near-wallet-selector/core";
import { CoreMessage, CoreTool, JSONValue, Message } from "ai";
import { AssistantTool, FunctionTool } from "openai/resources/beta/assistants";
import { FunctionDefinition } from "openai/resources/index";
import { OpenAPIV3 } from "openapi-types";

import BN from  "bn.js/lib/bn.js";
import { Account } from "near-api-js/lib/account";
import { SignRequestData } from "near-safe";
import { Hex } from "viem";
import type {
  UseSendTransactionReturnType,
  UseSwitchChainReturnType,
} from "wagmi";
import { BittePrimitiveName } from "../lib/constants";
import { TransactionOperation } from "./transaction";

export type BitteMetadata = {
  [key: string]: unknown;
};

export type BittePrimitiveRef = {
  type: string;
};

export type BitteOpenAPISpec = OpenAPIV3.Document & {
  "x-mb": {
    "account-id": string;
    assistant?: Pick<
      BitteAssistantConfig,
      "name" | "description" | "instructions" | "tools" | "image"
    > & {
      tools?: (AssistantTool | BittePrimitiveRef)[];
    };
  };
};

export type ExecutionDefinition = {
  baseUrl: string;
  path: string;
  httpMethod: string;
};

export type PluginToolSpec = {
  id: string;
  agentId: string;
  type: "function";
  function: FunctionDefinition;
  execution: ExecutionDefinition;
  verified: boolean;
};

export type BitteToolSpec = PluginToolSpec | FunctionTool;

export type BitteToolWarning = {
  message: string;
  final: boolean;
};

export type BitteToolResult<TResult = unknown> =
  | { data: TResult; error?: never }
  | { data?: never; error: string };

export type BitteToolExecutor<
  TArgs = Record<string, JSONValue>,
  TResult = unknown,
> = (
  args: TArgs,
  metadata?: BitteMetadata
) => Promise<BitteToolResult<TResult>>;

export type BitteToolRenderer<TArgs = unknown> = (
  args: TArgs,
  metadata?: BitteMetadata
) => ReactNode | null;

export type BitteTool<TArgs = Record<string, JSONValue>, TResult = unknown> = {
  toolSpec: FunctionTool;
  execute: BitteToolExecutor<TArgs, TResult>;
  render?: BitteToolRenderer;
};

// TODO: Remove this once we have a better way to handle this.
export type AnyBitteTool = BitteTool<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type BitteAssistantConfig = {
  id: string;
  name: string;
  accountId: string;
  description: string;
  instructions: string;
  verified: boolean;
  tools?: BitteToolSpec[];
  image?: string;
};

export type BitteAssistant = Omit<BitteAssistantConfig, "tools"> & {
  toolSpecs?: FunctionTool[];
  tools?: Record<string, CoreTool>;
};

export type FunctionDataMessage = {
  functionName: BittePrimitiveName | string;
  isPrimitive: boolean;
  description?: string;
  value: JSONValue;
};

export type SmartAction = {
  id: string;
  agentId: string;
  message: string;
  creator: string;
  createdAt: number;
};

export type SmartActionMessage = CoreMessage & {
  id?: string;
  agentId?: string;
};

export type SmartActionAiMessage = Message & {
  id?: string;
  agentId?: string;
  agentImage?: string;
  agentName?: string;
};

export type SmartActionChat = SmartAction & {
  messages: SmartActionMessage[];
};

export type SaveSmartAction = {
  agentId: string;
  creator: string;
  message: string;
};

export type SaveSmartActionMessages = {
  id: string;
  agentId: string;
  creator: string;
  messages: SmartActionMessage[];
};

type TransferTransaction = Omit<Transaction, "actions"> & {
  actions: Array<TransferAction>;
};

export type AccountTransaction = Omit<Transaction, "actions"> & {
  actions: Array<FunctionCallAction | TransferAction>;
};

export type SmartActionTransaction =
  | {
      args: Record<string, unknown> | string;
      contractName: string;
      deposit: string;
      gas: string;
      methodName: string;
    }
  | TransferTransaction;

export enum AssistantsMode {
  DEFAULT = "default",
  DEBUG = "debug",
}

export enum Model {
  GPT4o = "gpt4o",
  Grok2 = "grok2",
  Sonnet = "sonnet",
}

export type ChatComponentColors = {
  generalBackground?: string;
  messageBackground?: string;
  textColor?: string;
  buttonColor?: string;
  borderColor?: string;
};

/**
 * Options for configuring the BitteAiChat component.
 * @param agentName - The name of the agent.
 * @param agentImage - The image URL or path for the agent's avatar.
 * @param chatId - The unique identifier for the chat session.
 * @param prompt - The initial prompt or message to start the chat.
 * @param localAgent - Configuration for a local agent, including plugin and account details.
 * @param placeholderText - Placeholder text for the chat input field.
 * @param colors - Custom colors for the chat component.
 * @param welcomeMessageComponent - A React component to display as a welcome message.
 * @param mobileInputExtraButton - An extra button component for mobile input.
 */

export interface BitteAiChatOptions {
  agentName?: string;
  agentImage?: string;
  chatId?: string;
  prompt?: string;
  localAgent?: {
    pluginId: string;
    accountId: string;
    spec: BitteOpenAPISpec;
  };
  placeholderText?: string;
  colors?: ChatComponentColors;
  customComponents?: {
    welcomeMessageComponent?: React.JSX.Element;
    mobileInputExtraButton?: React.JSX.Element;
    messageContainer?: React.ComponentType<MessageGroupComponentProps>;
    chatContainer?: React.ComponentType<ChatContainerComponentProps>;
    inputContainer?: React.ComponentType<InputContainerProps>;
    sendButtonComponent?: React.ComponentType<SendButtonComponentProps>;
    loadingIndicator?: React.ComponentType<LoadingIndicatorComponentProps>;
  };
}

/**
 * Props for the BitteAiChat component
 * @param agentId - ID of the AI agent to use for chat interactions
 * @param apiUrl - Internal API URL for chat communication (e.g. api/chat).
 *                 Used to proxy requests to bitte api to not expose api key.
 * @param options - Your Chat Options
 */
export interface BitteAiChatProps {
  agentId: string;
  apiUrl: string;
  apiKey?: string;
  historyApiUrl?: string;
  messages?: Message[];
  wallet?: WalletOptions;
  options?: BitteAiChatOptions;
}

/**
 * Configuration options for wallet integrations
 *
 * For NEAR:
 * - Uses either near-api-js Account object for direct account access
 * - Or Wallet from near-wallet-selector for wallet integrations
 *
 * For EVM:
 * - Typically configured using wagmi hooks with WalletConnect:
 * - address: From useAccount() hook
 * - sendTransaction: From useSendTransaction() hook
 * - hash: Transaction hash returned after sending
 */
export type WalletOptions = {
  near?: {
    wallet?: Wallet; // From near-wallet-selector
    account?: Account; // From near-api-js
  };
  evm?: EVMWalletAdapter; // Interface matching wagmi hook outputs
};

export type SelectedAgent = {
  id?: string;
  name?: string;
};

export interface AssistantsRequestBody {
  threadId: string | null;
  message: string;
  accountId: string;
  kvId: string;
  config?: {
    mode?: AssistantsMode;
    agentId?: string;
  };
}

export interface ChatRequestBody {
  id?: string;
  config?: {
    mode?: string;
    agentId?: string;
    model?: string;
  };
  accountId?: string;
  network?: string;
  evmAddress?: Hex;
  chainId?: number;
  localAgent?: {
    pluginId: string;
    accountId: string;
    spec: BitteOpenAPISpec;
  };
}

export type AllowlistedToken = {
  name: string;
  symbol: string;
  contractId: string;
  decimals: number;
  icon?: string;
};

export interface EVMWalletAdapter {
  sendTransaction: UseSendTransactionReturnType["sendTransaction"];
  switchChain: UseSwitchChainReturnType["switchChain"];
  address: string | undefined;
  chainId?: number;
  hash?: string;
}

export type GenerateImageResponse = {
  url: string;
  hash: string;
};

export type TransactionListProps = {
  accountId: string;
  operation?: TransactionOperation;
  transaction: Transaction[];
  modifiedUrl: string;
  showDetails: boolean;
  showTxnDetail: boolean;
  setShowTxnDetail: (showTxnDetail: boolean) => void;
  costs: Cost[];
  gasPrice: string;
  borderColor: string;
};

export interface Cost {
  deposit: BN;
  gas: BN;
}

export interface AccountCreationData {
  devicePublicKey: string;
  accountId: string;
  isCreated: boolean;
  txnHash?: string;
}

/* Custom Components */
export interface MessageGroupComponentProps {
  message: SmartActionAiMessage;
  isUser: boolean;
  userName: string;
  children: React.ReactNode;
  style: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
  uniqueKey: string;
}

export interface ChatContainerComponentProps {
  children: React.ReactNode;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface InputContainerProps {
  children: React.ReactNode;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface LoadingIndicatorComponentProps {
  textColor?: string;
}

export interface SendButtonComponentProps {
  input: string;
  isLoading: boolean;
  buttonColor?: string;
  textColor?: string;
}

// Common button props
export interface TransactionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
}

// Container props
export interface TransactionContainerProps {
  children: React.ReactNode;
  style: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
}

// Custom components interface
export interface CustomTransactionComponents {
  Container?: React.ComponentType<TransactionContainerProps>;
  ApproveButton?: React.ComponentType<TransactionButtonProps>;
  DeclineButton?: React.ComponentType<TransactionButtonProps>;
}

// Props for both card types
export interface BaseTransactionCardProps {
  messageBackgroundColor: string;
  borderColor: string;
  textColor: string;
  buttonColor?: string;
  customComponents?: CustomTransactionComponents;
}

// Specific card props
export interface EvmTxCardProps extends BaseTransactionCardProps {
  evmData?: SignRequestData;
}

export interface ReviewTransactionProps extends BaseTransactionCardProps {
  transactions: Transaction[];
  warnings?: BitteToolWarning[] | null;
  creator?: string;
  agentId: string;
  walletLoading?: boolean;
  chatId?: string;
}

export type SignMessageResult = {
  accountId: string;
  publicKey: string;
  signature: string;
  message: string;
  nonce: string;
  recipient: string;
  callbackUrl: string;
  state?: string;
};
