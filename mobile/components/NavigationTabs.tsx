import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { icons } from '@/constants/index';

type TabId = 'chat' | 'summary' | 'flashcards';

type TabItem = {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ color?: string }>;
};

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;   // <- union, not string
  loadingSummary?: boolean;
}

const NavigationTabs = ({ activeTab, onTabChange, loadingSummary  }: NavigationTabsProps) => {

  const tabs:TabItem[]  = [
    { id: 'chat', label: 'Chat', icon: icons.Chat },
    { id: 'summary', label: 'Summary', icon: icons.Summary },
    // { id: 'flashcards', label: 'Flashcards', icon: icons.FlashCard },
  ];

  return (
    <View className="flex-row items-center flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`flex-row items-center gap-2 px-4 py-2 rounded-md ${
              isActive
                ? 'bg-primary'
                : 'bg-gray-100'
            }`}
          >
            <tab.icon color={isActive ? '#ffffff' : '#374151'} />
            {tab.id === 'summary' && loadingSummary ? (
              <ActivityIndicator size="small" color={isActive ? '#ffffff' : '#374151'} />
            ) : (
              <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-primary'}`}>
                {tab.label}
              </Text>
)}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-md bg-gray-100">
        <Text className="mr-2 text-gray-700 text-sm font-medium">Show More</Text>
        <icons.Ellipsis color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationTabs;
