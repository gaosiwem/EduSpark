import React from 'react';
import { View } from 'react-native';
import CollapsibleFileSection from './CollapsibleFileSection';
import ChatInterface from '@/components/ChatInterface';

interface Props {
  fileType: string;
  fileName: string;
  conversationId?: string
}

const ChatTab: React.FC<Props> = ({ fileType, fileName, conversationId }) => {
  return (
    <View className="flex-1">
      <View className="px-4 pt-6">
        {fileType !== 'other' && <CollapsibleFileSection fileType={fileType} fileName={fileName} />}
      </View>
      <View className="flex-1">
        <ChatInterface conversationId={conversationId} />
      </View>
    </View>
  );
};

export default ChatTab;
