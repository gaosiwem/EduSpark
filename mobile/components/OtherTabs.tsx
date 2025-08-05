import React from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import CollapsibleFileSection from './CollapsibleFileSection';
import Markdown from 'react-native-markdown-display';
import icons from '@/constants/icons';

interface Props {
  fileType: string;
  fileName: string;
  activeTab: 'summary' | 'flashcards';
  summary: any;
  loadingSummary: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

const screenHeight = Dimensions.get('window').height;

const OtherTabs: React.FC<Props> = ({
  fileType,
  fileName,
  activeTab,
  summary,
  loadingSummary,
  refreshing,
  onRefresh,
}) => {
  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4 pt-6">
        {fileType !== 'other' && <CollapsibleFileSection fileType={fileType} fileName={fileName} />}

        {activeTab === 'summary' && (
          <View
            className="bg-white rounded-2xl shadow overflow-hidden flex-1"
            style={{ minHeight: screenHeight * 0.5 }}
          >
            <View className="items-center px-4 pt-4">
              <icons.Summary color="#000000" />
              <Text className="text-xl font-semibold mt-4 mb-2 text-center">Document Summary</Text>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
              showsVerticalScrollIndicator
            >
              <Markdown
                style={{
                  body: {
                    textAlign: 'center',
                    color: '#4B5563',
                    fontSize: 14,
                    lineHeight: 22,
                  },
                }}
              >
                {summary}
              </Markdown>
            </ScrollView>
          </View>
        )}

        {activeTab === 'flashcards' && (
          <View className="p-8 bg-white rounded-2xl shadow items-center flex-1">
            <icons.FlashCard color="#A855F7" />
            <Text className="text-xl font-semibold mt-4 mb-2">Flashcards</Text>
            <Text className="text-gray-600 text-center">
              Create and study with AI‑generated flashcards
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OtherTabs;
