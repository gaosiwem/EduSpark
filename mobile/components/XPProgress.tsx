import { View, Text } from 'react-native'
import React from 'react'

interface Props{
    xp: number;
    level: number;
    xpToNext: number;
}

const XPProgress = ({
    xp,
    level,
    xpToNext
}: Props) => {

  const currentLevelXP = level * 100;
  const progress = (( xp - currentLevelXP) / 100 ) * 100


  return (
    <View className="bg-white p-4 rounded-2xl shadow-md">
      <Text className="text-lg font-bold mb-2">Level {level}</Text>
      <View className="w-full bg-gray-300 h-3 rounded-full">
        <View
          className="bg-green-600 h-3 rounded-full"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </View>
      <Text className="text-xs mt-2 text-gray-600">
        {xp} XP | {xpToNext} XP to next level
      </Text>
    </View>
  )
}

export default XPProgress