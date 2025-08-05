import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import icons from '@/constants/icons';
import Menu from "@/components/Menu";
import { router } from "expo-router";
import { getUploadedFiles } from "@/api-service/api-call";

const mockFiles = [
  { id: "vid-001", title: "Photosynthesis Basics.mp4", type: "video" },
  { id: "file-002", title: "Acids & Bases Notes.pdf", type: "file" },
  { id: "vid-003", title: "Periodic Table Explained.mp4", type: "video" },
];

type Upload = {
  id: number;
  user_id: number;
  file_path: string;
  filename: string;
  file_type: string;
};

const FileSelection = () => {

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);

useEffect(() => {
      let isMounted = true; // Flag to track component mount status
  
      const files = async () => {
        try {
          const data = await getUploadedFiles();
          if (isMounted) setUploads(data); // Update state only if mounted
        } catch (error) {
          console.error("Failed to fetch uploaded files:", error);
        }
      };
  
      files();
  
      // Cleanup: Set isMounted to false when component unmounts
      return () => {
        isMounted = false;
      };
  }, []);

  const toggleFileSelect = (title: string) => {
    setSelectedFiles(prev =>
      prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title]
    );
  };

  const handleGenerateQuiz = () => {

    router.push(`/(quiz)/${selectedFiles}`)
    // console.log('selected file')
    // console.log(selectedFiles)
  };

  return (
    <View className="flex-1 bg-white">
      {/* Fixed Menu */}
      <View className="absolute top-20 left-0 right-0 z-10">
        <Menu />
      </View>

      {/* Scrollable Content */}
      <ScrollView className="mt-40 px-4 mb-32">
        <Text className="text-center text-xl font-bold mb-6 text-gray-800">
          Select a file or video to start a quiz
        </Text>

        {uploads.map(file => {
          const isSelected = selectedFiles.includes(file.filename);
          return (
            <TouchableOpacity
              key={file.id}
              onPress={() => toggleFileSelect(file.filename)}
              className={`flex-row items-center justify-between p-4 rounded-lg mb-3 border ${
                isSelected ? "bg-blue-100 border-primary" : "border-gray-200"
              }`}
            >
              <View className="flex-row items-center gap-4">
                {file.file_type === "video" ? (
                  <icons.Video size={24} />
                ) : (
                  <icons.Document size={24} />
                )}
                <View>
                  <Text className="text-base font-semibold text-gray-900">
                    {file.filename}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {file.file_type.toUpperCase()}
                  </Text>
                </View>
              </View>

              {isSelected && (
                <View className="w-4 h-4 rounded-full bg-primary" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fixed Generate Button */}
      {selectedFiles.length > 0 && (
        <View className="absolute bottom-10 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleGenerateQuiz}
            className="bg-primary rounded-xl py-3"
          >
            <Text className="text-center text-white font-semibold text-lg">
              Generate Quiz
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default FileSelection
