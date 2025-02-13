import { Message } from "ai";
import { useEffect, useState } from "react";
import { convertToUIMessages } from "../lib/chat";
import { fetchChatHistory } from "../lib/fetchChatHistory";
import { BitteAiChatProps } from "../types/types";
import { AccountProvider } from "./AccountContext";
import { ChatContent } from "./chat/ChatContent";

export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  apiKey,
  historyApiUrl,
  agentId,
  options,
  welcomeMessageComponent,
  mobileInputExtraButton,
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
        apiKey={apiKey}
        agentId={agentId ?? agentIdLoaded}
        messages={uiMessages}
        options={{
          agentName: options?.agentName,
          agentImage: options?.agentImage,
          chatId: options?.chatId ?? (chatId || undefined),
          localAgent: options?.localAgent,
          prompt: options?.prompt,
        }}
        welcomeMessageComponent={welcomeMessageComponent}
        mobileInputExtraButton={mobileInputExtraButton}
      />
    </AccountProvider>
  );
};
