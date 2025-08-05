// components/LevelUpAnimation.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import LottieView from 'lottie-react-native';

interface LevelUpAnimationProps {
  newLevel: number;
  unlockedBadge?: string;
  onAnimationFinish: () => void;
}

export default function LevelUpAnimation({
  newLevel,
  unlockedBadge,
  onAnimationFinish,
}: LevelUpAnimationProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
    // Set a timeout to automatically dismiss the animation after a few seconds
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 4000); // Animation plays for 4 seconds

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, []);

  // You might have a local map for badge images if they are static assets
  const getBadgeImage = (badgeName?: string) => {
    switch (badgeName) {
      //case 'Novice Learner': return require('@/assets/badges/novice_learner.png');
      //case 'Apprentice Scholar': return require('@/assets/badges/apprentice_scholar.png');
      // Add more cases for other badges
      default: return null; // Or a default badge image
    }
  };

  const badgeImageSource = getBadgeImage(unlockedBadge);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onAnimationFinish}
    >
      <TouchableOpacity activeOpacity={1} onPress={onAnimationFinish}
         className="flex-1 bg-black/70 justify-center items-center">
        <View className="w-11/12 h-3/4 bg-white rounded-2xl overflow-hidden justify-center items-center p-5 relative shadow-2xl">
          <LottieView
            ref={animationRef}
            source={require('@/assets/animations/levelup_confetti.json')} // Path to your Lottie JSON file
            autoPlay
            loop={false}
            style={StyleSheet.absoluteFillObject} // Fill parent container
            className="z-0" // Ensure it's behind the text content
            onAnimationFinish={onAnimationFinish} // Also dismiss when Lottie animation finishes
          />

          <View className="z-10 items-center justify-center flex-1">
            <Text style={styles.title}>LEVEL UP!</Text>
            <Text className="text-3xl font-bold text-green-600 mb-4">
              You reached Level {newLevel}!
            </Text>
            {unlockedBadge && (
              <Text className="text-xl text-gray-700 italic mb-4">
                Unlocked: {unlockedBadge}
              </Text>
            )}
            {badgeImageSource && (
              <Image source={badgeImageSource} className="w-28 h-28 mb-6" resizeMode="contain" />
            )}

            <TouchableOpacity onPress={onAnimationFinish}
              className="mt-8 py-3 px-8 bg-indigo-700 rounded-full shadow-lg">
              <Text className="text-white text-lg font-bold">Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 8,
  },
});