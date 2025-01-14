import { Message } from "ai";
import { useEffect, useState } from "react";
import { convertToUIMessages } from "../lib/chat";
import { fetchChatHistory } from "../lib/fetchChatHistory";
import { BitteAiChatProps, SmartActionMessage } from "../types/types";
import { AccountProvider } from "./AccountContext";
import { ChatContent } from "./chat/ChatContent";

export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  historyApiUrl,
  agentid,
  options,
}: BitteAiChatProps) => {
  const [loadedData, setLoadedData] = useState({
    agentIdLoaded: "",
    uiMessages: [] as Message[],
  });

  const chatId =
    typeof window !== "undefined" && sessionStorage.getItem("chatId");

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && historyApiUrl) {
        const chat = await fetchChatHistory(chatId, historyApiUrl);
        if (chat) {
          const uiMessages = convertToUIMessages(chat.messages);
          setLoadedData({
            agentIdLoaded: chat.agentId,
            uiMessages: uiMessages,
          });
        }
      }
    };

    fetchData();
  }, [chatId, historyApiUrl]);

  const { agentIdLoaded, uiMessages } = loadedData;

  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        colors={colors}
        wallet={wallet}
        apiUrl={apiUrl}
        agentid={agentid ?? agentIdLoaded}
        messages={uiMessages}
        options={{
          agentName: options?.agentName,
          agentImage: options?.agentImage,
          chatId: options?.chatId ?? (chatId || undefined),
        }}
      />
    </AccountProvider>
  );
};
