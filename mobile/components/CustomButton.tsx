import { Icon } from 'lucide-react-native';
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import icons from '../constants/icons/index'

type Props = {
    title: string;
    handlePress: () => void;
    containerStyles?: object;
    textStyles?: object;
    isLoading?: boolean;
}

const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading
}: Props ) => {

  return  (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`relative bg-primary mt-10 mb-3 rounded-[30px] min-h-[62px] flex flex-row justify-center items-center w-full ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}>
      {/* Centered text + optional loader */}
      <View className="flex flex-row items-center">
        <Text className={`text-white font-psemibold text-2xl ${textStyles}`}>
          {title}
        </Text>
        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
          />
        )}
      </View>

      {/* Arrow icon fixed to the right edge */}
      <View className="absolute right-4">
        <icons.RightArrow color="#0C577D" size={24} />
      </View>
</TouchableOpacity>
  );
};


export default CustomButton