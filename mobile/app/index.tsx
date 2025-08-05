import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    // Wait until router is ready before redirecting
    setTimeout(() => {
      router.replace('/(main)');
    }, 0);
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
      <Text>Redirecting...</Text>
    </View>
  );
}