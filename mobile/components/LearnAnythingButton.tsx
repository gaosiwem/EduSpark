import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import icons from "@/constants/icons";


type LearnAnythingInputProps = {
  placeholder?: string;
  onSubmit: (text: string) => void;
  loading?: boolean;
};

const LearnAnythingInput = ({
  placeholder = 'Ask anything...',
  onSubmit,
  loading = false,
}: LearnAnythingInputProps) => {
  const [text, setText] = useState('');

  const handlePress = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <View className="w-full px-4 py-2 flex-row items-center bg-white rounded-full shadow-sm border border-gray-300">
      <TextInput
        className="flex-1 px-4 py-2 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        editable={!loading}
      />

      <TouchableOpacity
        className="w-10 h-10 justify-center items-center ml-2"
        onPress={handlePress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <icons.CircleArrowUp/>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LearnAnythingInput;