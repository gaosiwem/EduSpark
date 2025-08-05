import React from 'react';
import { View, Text } from 'react-native';
import icons from '@/constants/icons';
import { Message } from '@/hooks/useChat';
import Markdown from 'react-native-markdown-display';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const IconComponent = isUser ? icons.Name : icons.AIBot;

  return (
    <View
      className={`flex mb-4 gap-3 text-white ${isUser ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >

      <View className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <View
          className={`p-3 rounded-lg ${
            isUser ? 'bg-primary rounded-br-sm' : 'bg-gray-300 rounded-bl-sm'
          }`}
        >            
        <Markdown
          style={{
            body: {
              color: '#4B5563',
              fontSize: 16,
              lineHeight: 22,
              ...(isUser && {
                color: '#fff',   // Example: use blue color for user messages
              }),
            },
          }}
        >
          {message.content}
            </Markdown>
        </View>
        <Text className="text-md text-primary mt-1 px-1">{timestamp}</Text>
      </View>
    </View>
  );
};

export default ChatMessage;