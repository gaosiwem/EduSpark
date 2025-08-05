import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';

type Props = {
  icon: any;
  title: string;
  subtitle: string;
  onAudioComplete: (uri: string) => void;
  onVideoRecordRequest?: () => void; // Placeholder for next step
};

const AudioVideoRecorder = ({ onAudioComplete, onVideoRecordRequest, icon, title, subtitle }: Props) => {

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const startAudioRecording = async () => {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
  };

  const stopAudioRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setIsRecording(false);
    onAudioComplete(uri!);
  };

  return (
    <View className="w-full px-10"> {/* 👈 Adds space on both sides */}
      {isRecording ? (
        <TouchableOpacity onPress={stopAudioRecording} className="w-full bg-primary rounded-3xl px-6 py-3 flex-row items-center space-x-4 shadow-md elevation-4">
          <Text className="text-white text-center">⏹ Stop Audio</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startAudioRecording} className="w-full bg-primary rounded-3xl px-6 py-3 flex-row items-center space-x-4 shadow-md elevation-4">
          <Text className="text-white text-center">🎙 Start Audio</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onVideoRecordRequest}
        className="w-full bg-primary rounded-3xl px-6 py-3 flex-row items-center space-x-4 shadow-md elevation-4"
      >
            <View className="w-12 h-12 justify-center items-center">
              {icon}
            </View>
    
            {/* Text block */}
            <View className="flex-1 px-3">
              <Text className="font-semibold text-lg text-white">{title}</Text>
              <Text className="text-sm text-gray-200">{subtitle}</Text>
            </View>
      </TouchableOpacity>
    </View>
  );
}

export default AudioVideoRecorder