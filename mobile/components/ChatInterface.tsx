import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import LearningTools from './LearningTools';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import { ChatHistoryApiResponse, RawChatEntry } from '@/interfaces';
import { getConversationHistory } from '@/api-service/api-call';
import { router } from 'expo-router';
import LearningInterface from './learningInterface';

type ChatInterfaceProps = {
  conversationId?: string;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const userId = 1;
  const { messages, isLoading, getMessages } = useChat();
  const [chatHistory, setChatHistory] = useState<RawChatEntry[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const allMessages = [...chatHistory, ...messages];

  useEffect(() => {
    let isMounted = true;

    const fetchChats = async () => {
      if (!conversationId) return;

      try {
        const apiResponse: ChatHistoryApiResponse | null = await getConversationHistory(conversationId);

        if (isMounted && apiResponse?.chats) {
          const uniqueMap = new Map<string, RawChatEntry>();

          apiResponse.chats.forEach((chat) => {
            if (!uniqueMap.has(chat.content)) {
              uniqueMap.set(chat.content, chat);
            }
          });

          setChatHistory(Array.from(uniqueMap.values()));
        }
      } catch (error) {
        if (isMounted) setChatHistory([]);
      }
    };

    fetchChats();
    // getMessages(userId);
    //console.log(chatHistory)

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  useEffect(() => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
}, [messages, chatHistory]);

  const shouldShowLanding = messages.length === 0 && chatHistory.length === 0;

  return (
    <View className="bg-white shadow-sm border-0 rounded-2xl p-4 mx-4 flex-1">
      {shouldShowLanding ? (
        <LearningInterface/>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {allMessages.map((entry, index) => (
              <ChatMessage key={`msg-${entry.timestamp}-${index}`} message={entry} />
            ))}

            {isLoading && (
              <View className="flex-row gap-3 mb-4 items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Text className="text-xs">🤖</Text>
                </View>
                <View className="bg-gray-100 rounded-lg rounded-bl-sm p-3">
                  <Text className="text-sm text-gray-600">AI is thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default ChatInterface;
