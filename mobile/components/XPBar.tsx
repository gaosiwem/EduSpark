// components/XPBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface XPBarProps {
  currentXp: number;
  currentLevel: number;
  xpToNextLevel: number; // XP remaining to next level
  totalXpForNextLevel: number; // Total XP required to reach the next level (threshold for currentLevel + 1)
}

export default function XPBar({ currentXp, currentLevel, xpToNextLevel, totalXpForNextLevel }: XPBarProps) {
  // Calculate the XP earned within the current level's band
  // Assuming totalXpForNextLevel is the threshold for the *next* level
  // And that the backend provides `progress_to_next_level` (XP remaining)
  const xpEarnedInCurrentBand = totalXpForNextLevel - xpToNextLevel;
  const xpForCurrentBand = totalXpForNextLevel - (currentLevel === 1 ? 0 : (currentXp - xpEarnedInCurrentBand)); // Adjust based on your level config's actual thresholds

  // Simpler progress calculation: percentage of current XP towards the *next* level's total threshold
  const progressPercentage = (currentXp / totalXpForNextLevel) * 100;
  const fillWidth = isNaN(progressPercentage) ? '0%' : `${Math.min(100, progressPercentage)}%`;

  return (
    <View className="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden shadow-inner">
      <View
        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 justify-center items-center" style={{ width: fillWidth }}
      >
        <Text className="text-xs text-white font-bold drop-shadow-sm">
          {currentXp} XP
        </Text>
      </View>
      <View className="absolute w-full h-full flex-row justify-between items-center px-3">
        <Text className="text-sm font-bold text-gray-700">Level {currentLevel}</Text>
        <Text className="text-sm font-bold text-gray-700">
          {xpToNextLevel > 0 ? `${xpToNextLevel} to next` : 'MAX LEVEL!'}
        </Text>
      </View>
    </View>
  );
}