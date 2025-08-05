import 'dotenv/config';

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    name: process.env.APP_NAME || "EduSpark",
    slug: process.env.APP_NAME || "EduSpark",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "restate", // This is your deep linking scheme
    // 'deepLinking' property is typically handled by 'expo-router' plugin or 'scheme' property
    // You don't usually need a top-level 'deepLinking: true' when using expo-router and scheme
    userInterfaceStyle: "light",
    // newArchEnabled: true, // This is usually managed by expo-cli/EAS build, no need to specify directly in app.config.ts unless you have a specific reason.
                           // If you uncomment this, ensure you understand the implications of the New Architecture.

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    // assetBundlePatterns: ["**/*"], // This is a common default, usually not explicitly needed unless you modify it.

    ios: {
      supportsTablet: true,
      // You might add bundleIdentifier here if you need a specific one, e.g., "bundleIdentifier": "co.za.3point3.eduspark"
      // Also, if you had other iOS-specific configurations in app.json, they'd go here.
    },
    android: {
      package: "co.za.three_point_three.eduspark",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      // You might add version code here, e.g., "versionCode": 1
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    // The platforms property is inferred by Expo now, and typically not explicitly needed in app.config.ts
    // If you explicitly need to limit platforms, you can include it:
    // platforms: ["ios", "android", "web"],

    plugins: [
      "expo-router", // expo-router should be a separate string element in the array
      "expo-font",   // expo-font should be a separate string element in the array
      // The Google Sign-In plugin needs to be its own array element with its configuration
      // [
      //   "@react-native-google-signin/google-signin",
      //   {
      //     "iosUrlScheme": "com.googleusercontent.apps.<YOUR_IOS_CLIENT_ID_REVERSED>",
      //     "androidClientId": "286381414921-e4jcfigupcbtetdvf4cr9uq630fl9fp9.apps.googleusercontent.com"
      //   }
      // ]
    ],
    // Extra config can be added here, e.g., for environment variables if needed
    extra: {
      "apiUrl": process.env.API_URL,
      "clientId": process.env.GOOGLE_MOBILE_CLIENT_ID,
      "expoPublicKey": process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
    },
  };
};

