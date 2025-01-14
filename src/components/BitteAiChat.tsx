import { BitteAiChatProps } from "../types/types";
import { AccountProvider } from "./AccountContext";
import { ChatContent } from "./chat/ChatContent";


export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  agentid,
  options,
}: BitteAiChatProps) => {
  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        colors={colors}
        wallet={wallet}
        apiUrl={apiUrl}
        agentid={agentid}
        options={options}
      />
    </AccountProvider>
  );
};
