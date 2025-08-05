import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { icons } from "@/constants/index";
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Menu = () => {
  
   const navigation = useNavigation<DrawerNavigationProp<any>>();
   const { top } = useSafeAreaInsets();

  return (
    <View className="absolute left-4 z-50" style={{ top: top + -30 }}>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <icons.Menu width={28} height={28} />
    </TouchableOpacity>
    </View>
  )
}

export default Menu