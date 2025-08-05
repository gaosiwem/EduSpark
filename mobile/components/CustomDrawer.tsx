import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View className='align-middle mb-20 mt-10'>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          className='h-80 w-80 border-radius[40px]'
        />
        <Text className='mt-10 font-pbold text-size[18px]'>John Doe</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={() => alert('Logging out')}>
        <Text className='mt-20 ml-15 text-size[16px] color-red-600'>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
