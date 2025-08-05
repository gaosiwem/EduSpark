import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import LearningTools from '@/components/LearningTools'
import { icons } from '@/constants/index';
import { router } from 'expo-router';

const LearningInterface = () => {

  const handleToolPress = (toolId: string) => {
      switch (toolId) {
        case 'quiz':
          // Alert.alert("Mind Map", "Mind Map functionality coming soon!");
          router.push('/(quiz)');
          break;
        case 'mindmap':
          // Handle Mind Map action
          Alert.alert("Mind Map", "Mind Map functionality coming soon!");
          break;
        case 'voice':
          // Handle Voice Mode action
          Alert.alert("Voice Mode", "Activating voice interaction...");
          break;
        case 'flashcards':
          // Handle Flashcards action
          Alert.alert("Voice Mode", "Activating voice interaction...");
          break;
        case 'search':
          // Handle Search action
          Alert.alert("Voice Mode", "Activating voice interaction...");
          break;
        default:
          Alert.alert("Tool Not Implemented", `Action for ${toolId} is not yet defined.`);
      }
    }

  return (
    <ScrollView className="px-8">
      <View className="p-12 ">
        {/* Chat bubble */}
        <View className="mb-6 items-center">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
              <Text className="text-white text-2xl">💬</Text>
            </View>
          </View>

          <Text className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Learn with the AI Tutor
          </Text>
          <Text className="text-gray-600 text-center">
            Choose a learning method below or ask any question
          </Text>
        </View>

        {/* Learning Tool Grid */}
       <LearningTools onToolPress={handleToolPress} />
      </View>
    </ScrollView>
  )
}

export default LearningInterface
