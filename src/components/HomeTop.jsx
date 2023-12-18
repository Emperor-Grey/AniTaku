import { Setting2 } from 'iconsax-react-native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeTop() {
  return (
    <SafeAreaView>
    <View className="flex-row items-center justify-between p-2.5">
      <View className="w-11 h-11 rounded-full border border-blue-300 bg-blue-50 overflow-hidden">
        <Image
          className="w-full h-full"
          resizeMode="cover"
          source={{
            uri: 'https://i.pinimg.com/236x/a7/96/e9/a796e9b1fdd519489599cb7a238fa6bc.jpg',
          }}
        />
      </View>
      <TouchableOpacity>
        <Setting2 size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
}
