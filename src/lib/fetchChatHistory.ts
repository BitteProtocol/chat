import { SmartActionChat } from "../types";

export const fetchChatHistory = async (
  id: string,
  url: string
): Promise<SmartActionChat | null> => {
  try {
    const response = await fetch(`${url}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch chat history:", response.statusText);
      return null;
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
};
