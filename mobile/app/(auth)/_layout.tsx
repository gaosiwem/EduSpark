import { useAuth } from '@/state/store/appStore';
import { Redirect, Slot, Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';


export default function AuthRoutesLayout() {
  const user = useAuth((state) => state.user);
  const hydrated = useAuth((state) => state.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}