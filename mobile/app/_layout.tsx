import { router, SplashScreen, Stack, useNavigation } from "expo-router";
import {useFonts} from 'expo-font'
import "../global.css";
import { Drawer } from 'expo-router/drawer';
import { useEffect } from "react";
import { Pressable } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { icons } from "@/constants";
import FlashMessage from "react-native-flash-message";
import { Slot } from 'expo-router';
import { useState } from 'react';
import Constants from "expo-constants";
import { useAuth } from "@/state/store/appStore";


const expoPublicKey = Constants.expoConfig?.extra?.expoPublicKey;

export default function RootLayout() {

    const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const token = useAuth((state) => state.token);
  const [ready, setReady] = useState(false);

   useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !token) {
      router.replace("/(auth)/login");
    }
  }, [ready, token]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}
