export const RPC_URL = "https://rpc.mainnet.near.org";

export const OPEN_API_SPEC_PATH = ".well-known/ai-plugin.json";

export const PLUGINS_COLLECTION = "ai-plugins";
export const ASSISTANTS_COLLECTION = "ai-assistants";
export const TOOLS_COLLECTION = "ai-tools";
export const API_KEYS_COLLECTION = "ai-api-keys";

export const DEFAULT_MODEL = "gpt-4o";
export const DEFAULT_ASSISTANT_ID = "asst_9akhoUCRuq2fi36e1aSDVv4e";
export const DEFAULT_AGENT_ID = "bitte-assistant";
export const DISCOVERY_ASSISTANT_ID = "asst_5mlinuGadyp8PiI8203Uvh3C";
export const DISCOVERY_VECTOR_STORE_ID = "vs_iv6JjMEYtBVnQ91MVqS0PwTs";

export const PLUGINS_OAI_VECTOR_STORE = "oai-vector-store-ai-plugins";
export const ASSISTANTS_OAI_VECTOR_STORE = "oai-vector-store-ai-assistants";
export const TOOLS_OAI_VECTOR_STORE = "oai-vector-store-ai-tools";

export const defaultColors = {
  generalBackground: "#18181A",
  messageBackground: "#0A0A0A",
  textColor: "#FAFAFA",
  buttonColor: "#000000",
  borderColor: "#334155",
} as const;

export enum BittePrimitiveName {
  TRANSFER_FT = "transfer-ft",
  GENERATE_TRANSACTION = "generate-transaction",
  SUBMIT_QUERY = "submit-query",
  GENERATE_IMAGE = "generate-image",
  CREATE_DROP = "create-drop",
  GET_SWAP_TRANSACTIONS = "getSwapTransactions",
  GET_TOKEN_METADATA = "getTokenMetadata",
  GENERATE_EVM_TX = "generate-evm-tx",
  RENDER_CHART = "render-chart",
  SIGN_MESSAGE = "sign-message",
}
