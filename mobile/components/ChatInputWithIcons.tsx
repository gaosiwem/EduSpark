import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import icons from '@/constants/icons';

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: (text: string) => void;
  onVoice: () => void;
};

const ChatInputWithIcons = ({ inputValue, setInputValue, handleSendMessage, onVoice }: Props) => {
  // Determine height based on typical input bar content and padding
  // You might want to get this dynamically, but a safe estimate for padding is fine
  const bottomPadding = Platform.OS === 'ios' ? 20 : 0; // For iOS safe area at bottom
  const [inputText, setInputText] = useState('');

   const handleSend = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    // Remove 'absolute' and 'bottom-6'. This component will now be positioned by flexbox in its parent.
    <View className="px-4 py-3 bg-white"> {/* Added py-3 and border for visual separation */}
      {/* Textbox container */}
      <View className="bg-white rounded-2xl shadow-md p-4 border border-primary">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Ask anything"
          multiline
          className="text-base text-gray-800"
          placeholderTextColor="#9CA3AF"
          // Max height for multiline to avoid excessive expansion
          style={{ maxHeight: 120 }}
        />

        {/* Action row inside textbox */}
        <View className="flex-row flex-wrap items-center justify-between mt-2 space-y-2">
          <View className="flex-row items-center space-x-4 gap-2">
            <TouchableOpacity>
              <icons.PaperClip size={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <icons.Search size={20} />
            </TouchableOpacity>
          </View>

          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="bg-primary px-4 mx-2 py-2 rounded-xl"
              onPress={handleSend}
            >
              <Text className="text-white font-semibold text-sm">+Learn+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-black px-4 py-2 rounded-xl flex-row items-center"
              onPress={onVoice}
            >
              <icons.Microphone color="#fff" size={18} />
              <Text className="text-white ml-1 text-sm">Voice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Add a small safe area padding at the very bottom for iOS home indicator */}
      {Platform.OS === 'ios' && <View className="h-5" />} {/* Adjust height as needed */}
    </View>
  );
};

export default ChatInputWithIcons;