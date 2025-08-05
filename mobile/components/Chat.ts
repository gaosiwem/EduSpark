import Constants from "expo-constants";


const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export const createConversation = async (userId: number) => {
  const res = await fetch(`${apiUrl}/chat/send/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  return res.json(); // returns { id: conversation_id }
};

export const sendMessageToAPI = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
) => {
  const res = await fetch(`${apiUrl}/chat_messages/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_id: conversationId,
      role,
      content,
    }),
  });
  return res.json(); // returns created message
};

export const getMessages = async (conversationId: string) => {
  const res = await fetch(`${apiUrl}/conversations/${conversationId}`);
  return res.json(); // returns list of messages
};
