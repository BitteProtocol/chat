import { Message } from 'ai';
import { useEffect, useState } from 'react';
import { convertToUIMessages } from '../lib/chat';
import { fetchChatHistory } from '../lib/fetchChatHistory';
import { BitteAiChatOptions, BitteAiChatProps } from '../types/types';
import { AccountProvider } from './AccountContext';
import { ChatContent } from './chat/ChatContent';

export const BitteAiChat = ({
  wallet,
  apiUrl,
  apiKey,
  historyApiUrl,
  agentId,
  options,
}: BitteAiChatProps) => {
  const [loadedData, setLoadedData] = useState({
    agentIdLoaded: '',
    uiMessages: [] as Message[],
  });

  const chatId =
    typeof window !== 'undefined' && sessionStorage.getItem('chatId');

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
          // Clear chatId from session storage
          sessionStorage.removeItem('chatId');
        }
      }
    };

    fetchData();
  }, [chatId, historyApiUrl]);

  const { agentIdLoaded, uiMessages } = loadedData;

  const optionsProps: BitteAiChatOptions = {
    agentName: options?.agentName,
    agentImage: options?.agentImage,
    chatId: options?.chatId ?? (chatId || undefined),
    localAgent: options?.localAgent,
    prompt: options?.prompt,
    colors: options?.colors,
    customComponents: options?.customComponents,
  };

  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        wallet={wallet}
        apiUrl={apiUrl}
        apiKey={apiKey}
        agentId={agentId ?? agentIdLoaded}
        messages={uiMessages}
        options={optionsProps}
      />
    </AccountProvider>
  );
};
