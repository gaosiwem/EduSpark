// components/Notification.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

interface NotificationProps {
  message: string;
  duration?: number; // How long it stays visible in ms
}

const { width } = Dimensions.get('window');

export default function Notification({ message, duration = 2000 }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade in/out
  const slideAnim = useRef(new Animated.Value(-100)).current; // For slide in from top

  useEffect(() => {
    setIsVisible(true); // Reset visibility for new message
    fadeAnim.setValue(0); // Reset animation values
    slideAnim.setValue(-100);

    // Slide in and Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stay for duration, then fade out and slide out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setIsVisible(false));
      }, duration);
    });
  }, [message, duration]); // Re-trigger if message changes

  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute top-10 self-center bg-gray-900 px-5 py-3 rounded-full shadow-xl flex-row items-center z-50"
      style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: width * 0.8 }]} // Adjust width dynamically
    >
      <Text className="text-white font-semibold text-base text-center flex-1">{message}</Text>
    </Animated.View>
  );
}