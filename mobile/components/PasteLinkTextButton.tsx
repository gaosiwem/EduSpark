import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';


type PasteLinkTextProps = {
  icon: any; // require('./path/to/logo.png')
  title?: string;
  subtitle?: string;
  containerStyles?: string;
};

const PasteLinkTextButton = ({
  icon,
  title,
  subtitle,
  containerStyles = '',
}: PasteLinkTextProps) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isText, setIsText] = useState(false);

  const handlePaste = () => {
    if (inputValue.trim() === '') return;
    setModalVisible(false);

    setInputValue('');
    setIsText(false);
  };

 return (
    <View className='w-full px-10'>
      {/* Main Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-full bg-primary rounded-3xl px-6 py-3 flex-row items-center space-x-4 shadow-md elevation-4"
      >
        <View className="w-12 h-12 justify-center items-center">
          {icon}
        </View>

        <View className="flex-1 px-3">
          <Text className="font-semibold text-lg text-white">{title}</Text>
          <Text className="text-sm text-gray-200">{subtitle}</Text>
        </View>
      </TouchableOpacity>

      {/* Modal for Pasting Text or Link */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-2xl p-5 w-full">
            <Text className="text-lg font-bold mb-2">Paste YouTube link, website, or text</Text>

            <TextInput
              multiline={isText}
              placeholder={isText ? "Paste or type your full text here..." : "Paste a link or text"}
              value={inputValue}
              onChangeText={text => {
                setInputValue(text);
                // Auto-switch to multiline if it's a paragraph
                if (text.length > 60 || text.includes('\n')) {
                  setIsText(true);
                } else {
                  setIsText(false);
                }
              }}
              className={`border rounded-2xl px-3 border-primary py-2 text-base ${
                isText ? 'h-32' : 'h-12'
              }`}
            />

            <View className="flex-row justify-end space-x-3 gap-4 mt-4">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setInputValue('');
                  setIsText(false);
                }}
              >
                <Text className="text-gray-500">Cancel</Text>
              </Pressable>

              <Pressable onPress={handlePaste}>
                <Text className="text-primary font-semibold">Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PasteLinkTextButton