// app/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Constants from "expo-constants";
import { showMessage } from "react-native-flash-message";
import { WebView } from "react-native-webview";
import { icons } from "@/constants/index";
import { router } from 'expo-router';

import FileUploadButton from "@/components/FileUploadButton";
import PasteLinkTextButton from "@/components/PasteLinkTextButton";
import AudioVideoRecorder from "@/components/AudioVideoRecorder";
import LearnAnythingButton from "@/components/LearnAnythingButton";
import { useTranscriptStore } from '@/state/store/appStore';
import { getUploadedFiles } from "@/api-service/api-call";
import Menu from "./Menu";

const PDF_ICON = require("../assets/images/PDF_file_icon.png");

type Upload = {
  id: number;
  user_id: number;
  file_path: string;
  filename: string;
  file_type: string;
};

export default function HomeScreen() {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const setTranscriptData = useTranscriptStore((state) => state.setTranscriptData);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getUploadedFiles();
      setUploads(data)
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFileUpload:any = async (file: any) => {
    if (!file || file.canceled || !file.assets || !file.assets[0]) return;
    const asset = file.assets[0];
    const mimeType = asset.mimeType;
    const formData = new FormData();

    formData.append("file", {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType,
    } as any);

    await new Promise((res) => setTimeout(res, 30)); // Simulate delay

    let url = mimeType === "application/pdf" ? `${apiUrl}/upload-file/` :
              mimeType === "video/mp4" ? `${apiUrl}/process-video/` : "";

    if (!url) {
      showMessage({
        message: "Unsupported File Type",
        description: "Only PDF and MP4 are supported.",
        type: "warning",
      });
      return;
    }

    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const data = await response.json();

      if (response.ok) {
        const { transcript, fileName, filePath } = data;
        setTranscriptData({ transcript, fileName, filePath });

        showMessage({ message: "Upload Successful!", type: "success" });
        router.push("/learn");
      } else {
        showMessage({ message: data.message || "Upload Failed", type: "danger" });
      }
    } catch (error) {
      showMessage({ message: "Network Error", type: "danger" });
    }
  };

  const learnAnythingSubmit = async (text: string) => {
    console.log("Clicked Learn Anything");
  };

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

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-4" contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
              
      {/* Drawer Menu Button */}
      <Menu />

      <View className="items-center mb-6 pt-10">
        <Text className="font-pbold text-primary text-lg">Hi Mpho</Text>
        <Text className="font-pbold text-primary text-base">What would you like to learn today?</Text>
      </View>

      <View className="gap-6">
        <Controller
          control={control}
          name="file"
          defaultValue={null}
          render={({ field: { onChange } }) => (
            <FileUploadButton
              logo={<icons.CloudUpload color="#ffffff" />}
              title="Upload"
              subtitle="File, audio, video"
              onFilePicked={async (file) => {
                if (!file?.canceled) await handleFileUpload(file);
              }}
            />
          )}
        />

        <PasteLinkTextButton icon={<icons.PaperClip color="#ffffff" />} title="Paste" subtitle="YouTube, website, text" />

        <AudioVideoRecorder
          icon={<icons.Microphone />}
          title="Record"
          subtitle="Record class, video call"
          onAudioComplete={(uri) => console.log("Audio URI:", uri)}
          onVideoRecordRequest={() => console.log("Video recorder should open")}
        />

        <LearnAnythingButton placeholder="Learn anything..." onSubmit={learnAnythingSubmit} />
      </View>

      <View className="mt-10">
        <Text className="text-md font-bold mb-2">Uploaded Files</Text>
        <ScrollView horizontal className="flex-row pb-10 pr-6" contentContainerStyle={{ paddingHorizontal: 10 }}>
          {uploads.map((item) => (
            <TouchableOpacity
              key={item.id ?? item.file_path}
              activeOpacity={0.8}
              onPress={() => {
                setTranscriptData({ transcript: '', fileName: item.filename, filePath: item.file_path });
                router.push("/learn");
              }}
            >
              <View className="w-32 h-44 rounded-xl overflow-hidden border border-primary bg-gray-100 items-center justify-center p-2 mr-4">
                {item.file_type === "application/pdf" ? (
                  <View className="items-center justify-center">
                    <Image source={PDF_ICON} style={{ width: 30, height: 30, resizeMode: "contain" }} />
                    <Text className="mt-2 text-center px-1 text-xs" numberOfLines={2} ellipsizeMode="tail">
                      {item.filename}
                    </Text>
                  </View>
                ) : (
                  <WebView source={{ uri: `http://192.168.11.114:8004/${item.file_path}` }} style={{ width: "100%", height: "100%" }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
