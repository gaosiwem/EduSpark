import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';


type FileUploadButtonProps = {
  logo: any; // require('./path/to/logo.png')
  title?: string;
  subtitle?: string;
  onFilePicked?: (file: DocumentPicker.DocumentPickerResult) => Promise<void>;
  containerStyles?: string;
};

const FileUploadButton = ({
  logo,
  title = 'Upload Document',
  subtitle = 'Tap to choose a file',
  onFilePicked,
  containerStyles = '',
}: FileUploadButtonProps) => {

    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState<number>(0)

    const simulateUploadProgress = async () => {
      setProgress(0)
    for (let i = 1; i <= 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms steps
      setProgress(i);
    }
  };

    const handlePick = async () => {

    const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // or "application/pdf" / "image/*"
        copyToCacheDirectory: true,
    });

    if (result && !result.canceled && onFilePicked) {

        setUploading(true);

        await simulateUploadProgress();

        try {
          await onFilePicked(result)
        }
        catch (e) {
          console.error("Upload failed: ", e)
        }

        setUploading(false);
        setProgress(0);
    }
};

    return (
      <View className="w-full px-10"> {/* 👈 Adds space on both sides */}
      {uploading && (
        <View className='w-full bg-gray-300 h-2 rounded-full mb-2 overflow-hidden'>
          <View
            className="bg-primary h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={handlePick}
        className="w-full bg-primary rounded-3xl px-6 py-3 flex-row items-center space-x-4 shadow-md elevation-4"
      >
        {/* Logo block */}
        <View className="w-12 h-12 justify-center items-center">
          {logo}
        </View>

        {/* Text block */}
        <View className="flex-1 px-3">
          <Text className="font-semibold text-lg text-white">{title}</Text>
          <Text className="text-sm text-gray-200">
            {uploading ? `Uploading... ${progress}%` : subtitle}
          </Text>
        </View>

        {uploading && <ActivityIndicator size="small" color="#fff" />}
      </TouchableOpacity>
    </View>
  );
}

export default FileUploadButton