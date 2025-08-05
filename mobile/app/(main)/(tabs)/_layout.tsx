import { Tabs } from 'expo-router';
import icons from '@/constants/icons';
import { JSX } from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: "#0C577D",
        },
        tabBarIcon: ({ color, size }) => {
          let icon: JSX.Element | null = null;

          switch (route.name) {
            case 'index':
              icon = <icons.Email color='#fff'/>;
              break;
            case 'learn':
              icon = <icons.Learn color='#fff'/>;
              break;
            // case 'settings':
            //   icon = <icons.Settings color='#fff'/>;
            //   break;
            // case 'profile':
            //   icon = <icons.Name color='#fff'/>;
            //   break;
          }
          return icon;
        }
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
     {/*  <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} /> */}
    </Tabs>
  );
}