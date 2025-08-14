import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import FlashMessage from "react-native-flash-message";
<<<<<<< HEAD
import { Slot } from 'expo-router';
import { useState } from 'react';
import Constants from "expo-constants";
import { useAuth } from "@/state/store/appStore";
=======
>>>>>>> 518d66beec0f529d7042d4a1c6d23e4970fef251


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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

<<<<<<< HEAD
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
=======
  if (!fontsLoaded) return null;

  return (
        <>
          <Slot />;
          <FlashMessage position="top" />
        </>
  )
>>>>>>> 518d66beec0f529d7042d4a1c6d23e4970fef251
}
