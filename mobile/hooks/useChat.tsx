// hooks/useChat.ts
import Constants from 'expo-constants';
import { useState, useCallback, useEffect } from 'react';

export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Global state
let globalMessages: Message[] = [];
let globalIsLoading = false;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(globalMessages);
  const [isLoading, setIsLoading] = useState(globalIsLoading);

  const forceUpdate = useCallback(() => {
    setMessages([...globalMessages]);
    setIsLoading(globalIsLoading);
  }, []);

  useEffect(() => {
    listeners.push(forceUpdate);
    return () => {
      listeners = listeners.filter(l => l !== forceUpdate);
    };
  }, [forceUpdate]);

  const sendMessage = async (content: string, userId: number, conversationId: string) => {
    if (!content.trim() || globalIsLoading) return;

    const userMessage: Message = {
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    globalMessages = [...globalMessages, userMessage];
    globalIsLoading = true;
    notifyListeners();
    const chat_obj = {
      'user_id': userId,
      'message': content
    }

    try {
      const response = await fetch(`${apiUrl}/send_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  'user_id': userId, 'message': content, 'conversation_id': conversationId }),
      });
      const assistantMessage = await response.json();

      globalMessages = [...globalMessages, assistantMessage];
    } catch (err) {
      console.error('Failed to fetch message from backend:', err);
    } finally {
      globalIsLoading = false;
      notifyListeners();
    }
  };

  const getMessages = async(userId: number) => {

      try {
      const response = await fetch(`${apiUrl}/get_chats/${userId}`, {
        method: 'GET',
      });
      const chats = await response.json();
      setMessages(chats)

      // globalMessages = [...globalMessages, assistantMessage];
    } catch (err) {
      console.error('Failed to fetch message from backend:', err);
    } finally {
      globalIsLoading = false;
      notifyListeners();
    }
    
  }

  return { messages, isLoading, sendMessage, getMessages };
};
