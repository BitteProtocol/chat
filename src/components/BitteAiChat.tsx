import React from "react";
import { BitteAiChatProps } from "../types/types";
import { ChatContent } from "./chat/ChatContent";
import { AccountProvider } from "./AccountContext";
export const BitteAiChat = ({
  id,
  creator,
  prompt,
  messages,
  agentData,
  model,
  isShare,
  colors,
  account,
  wallet,
  apiUrl,
  evmWallet,
  solanaWallet,
}: BitteAiChatProps) => {
  return (
    <AccountProvider wallet={wallet} account={account} evmWallet={evmWallet} solanaWallet={solanaWallet}>
      <ChatContent
        id={id}
        creator={creator}
        prompt={prompt}
        messages={messages}
        agentData={agentData}
        model={model}
        isShare={isShare}
        colors={colors}
        account={account}
        wallet={wallet}
        apiUrl={apiUrl}
        solanaWallet={solanaWallet}
      />
    </AccountProvider>
  );
};
