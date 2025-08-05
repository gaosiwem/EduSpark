import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { icons } from '@/constants/index'; // Ensure your icons are correctly imported

interface LearningToolsProps {
  onToolPress: (toolId: string) => void; // A callback prop from the parent
}

const LearningTools = ({onToolPress}: LearningToolsProps) => {
  const tools = [
    {
      id: 'quiz',
      label: 'Quiz',
      icon: icons.OpenBook,
      description: 'Test your knowledge',
    },
    {
      id: 'mindmap',
      label: 'Mind Map',
      icon: icons.MindMap,
      description: 'Visualize concepts',
    },
    {
      id: 'voice',
      label: 'Voice Mode',
      icon: icons.Audio,
      description: 'Voice interaction',
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: icons.FlashCard,
      description: 'Study with cards',
    },
    {
      id: 'search',
      label: 'Search',
      icon: icons.Search,
      description: 'Find information',
    },
  ];

  return (
    <View className="flex-row flex-wrap justify-between">
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          className="w-[48%] h-20 rounded-3xl items-center justify-center p-3 mb-4"
          activeOpacity={0.8}
          onPress = {() => onToolPress(tool.id)}
        >
          <View className="p-4 rounded-2xl bg-primary">
            <tool.icon color="white"/>
          </View>
          <Text className="mt-2 font-medium text-center text-gray-800 text-sm">
            {tool.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LearningTools;
