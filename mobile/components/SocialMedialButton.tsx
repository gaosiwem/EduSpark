import { Icon } from 'lucide-react-native';
import React from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";


type Props = {
    title: string;
    handlePress: () => void;
    image: any;
    containerStyles?: object;
    textStyles?: object;
    isLoading?: boolean;
}

const SocialMedialButton = ({
    title,
    handlePress,
    image,
    containerStyles,
    textStyles,
    isLoading,
}: Props ) => {

  return  (
    <TouchableOpacity
  onPress={handlePress}
  activeOpacity={0.7}
  className={`relative bg-white border-2 border-primary mt-5 rounded-[30px] min-h-[62px] flex flex-row justify-center items-center w-full ${containerStyles} ${
    isLoading ? "opacity-50" : ""
  }`}
  disabled={isLoading}>
  {/* Centered text + optional loader */}
  <View className="flex flex-row items-center">
    <Text className={`text-black font-psemibold text-2xl ${textStyles}`}>
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
     <Image source={image} style={{ width: 24, height: 24 }} />
  </View>
</TouchableOpacity>
  );
};


export default SocialMedialButton