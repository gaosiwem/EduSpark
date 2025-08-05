import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ChevronUp from '@/constants/icons/chevronUp';
import ChevronDown from '@/constants/icons/chevronDown';
import icons from '@/constants/icons';

interface Props {
  fileType: string;
  fileName: string;
}

const CollapsibleFileSection: React.FC<Props> = ({ fileType, fileName }) => {
  const [open, setOpen] = useState(true);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center p-4 bg-white rounded-xl shadow-sm"
      >
        <View className="flex-row items-center gap-2">
          {fileType === 'pdf' && <icons.PDF color="#000000" />}
          {fileType === 'word' && <icons.Document color="#000000" />}
          {fileType === 'video' && <icons.Video color="#000000" />}
          {fileType === 'audio' && <icons.Microphone color="#000000" />}
          <Text className="font-medium text-gray-800">
            {fileName ||
              (fileType === 'pdf'
                ? 'PDF Document'
                : fileType === 'word'
                ? 'Word Document'
                : fileType === 'video'
                ? 'Video File'
                : fileType === 'audio'
                ? 'Audio File'
                : 'File')}
          </Text>
        </View>
        {open ? <ChevronUp color="#4B5563" /> : <ChevronDown color="#4B5563" />}
      </TouchableOpacity>
      {open && (
        <View className="py-8 items-center border-2 border-dashed border-gray-200 rounded-lg bg-white p-6 rounded-b-xl shadow-sm">
          {fileType === 'pdf' && <icons.PDF color="#000000" />}
          {fileType === 'word' && <icons.Document color="#000000" />}
          {fileType === 'video' && <icons.Video color="#000000" />}
          {fileType === 'audio' && <icons.Microphone color="#000000" />}
          <Text className="font-medium text-gray-600 mt-2">{fileName || `This is a ${fileType} file`}</Text>
          <Text className="text-gray-500 text-sm mt-1">Uploaded document</Text>
        </View>
      )}
    </View>
  );
};

export default CollapsibleFileSection;
