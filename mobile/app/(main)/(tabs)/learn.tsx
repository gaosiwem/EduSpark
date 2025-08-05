import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, View, Text, ScrollView, RefreshControl, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import NavigationTabs from '@/components/NavigationTabs';
import ChatInputWithIcons from '@/components/ChatInputWithIcons';
import Constants from 'expo-constants';
import { useTranscriptStore } from '@/state/store/useTranscriptStore';
import { useChat } from '@/hooks/useChat';
import { getConversationHistory } from '@/api-service/api-call';
import { ChatHistoryApiResponse, ProcessedConversation } from '@/interfaces';

import CollapsibleFileSection from '@/components/CollapsibleFileSection';
import ChatTab from '@/components/ChatTab';
import OtherTabs from '@/components/OtherTabs';

const screenHeight = Dimensions.get('window').height;

interface Props {
  conversationId: string;
}

const Learn = ({conversationId}: Props) => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'flashcards'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [summary, setSummary] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [chatHistory, setChatHistory] = useState<ProcessedConversation[]>([]);

  const { sendMessage } = useChat();

  const transcript = useTranscriptStore((s) => s.transcript);
  const fileName = useTranscriptStore((s) => s.fileName);
  const filePath = useTranscriptStore((s) => s.filePath);

  const getFileType = (fileName: string = 'other'): 'pdf' | 'word' | 'video' | 'audio' | 'other' => {
    if (!fileName) return 'other';
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'word';
    if (fileName.endsWith('.mp4') || fileName.endsWith('.mov')) return 'video';
    if (fileName.endsWith('.mp3') || fileName.endsWith('.m4a') || fileName.endsWith('.wav')) return 'audio';
    return 'other';
  }; 

  const fileType = getFileType(fileName);

  const handleTabChange = useCallback(
    async (tab: typeof activeTab) => {
      try {
        if (tab === 'summary') {
          setLoadingSummary(true);
          if (filePath !== '') {
            const response = await fetch(`${apiUrl}/summarize/?file_path=${filePath}`);
            if (response.ok) {
              const data = await response.json();
              setSummary(data);
            }
          } else {
            console.log('path cannot be empty');
            setSummary(null);
          }
        }
      } catch (err) {
        console.log(err);
        setSummary(null);
      } finally {
        setLoadingSummary(false);
      }
      setActiveTab(tab);
    },
    [filePath, apiUrl]
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userId = 1; // Replace with actual user ID
    await sendMessage(inputValue, userId, conversationId);
    setInputValue('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'summary') {
        await handleTabChange('summary');
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {

    console.log("inside learn")
    
    // if(filePath !== ''  && transcript === '') {
      
      
    // }

    console.log(conversationId)
    if (activeTab === 'summary' && !summary && !loadingSummary) {
      handleTabChange('summary');
    }
  }, [handleTabChange, summary, loadingSummary]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
    <SafeAreaView className="flex-1 pt-20 bg-white">

    <NavigationTabs
      activeTab={activeTab}
      onTabChange={handleTabChange}
      loadingSummary={loadingSummary}
    />

      {/* Main content */}
      {activeTab === 'chat' ? (
        <ChatTab fileType={fileType} fileName={fileName} conversationId={conversationId}/>
      ) : (
        <OtherTabs
          fileType={fileType}
          fileName={fileName}
          activeTab={activeTab}
          summary={summary}
          loadingSummary={loadingSummary}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Bottom input */}
      <ChatInputWithIcons
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        onVoice={() => console.log('Voice input clicked')}
      />
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Learn;
