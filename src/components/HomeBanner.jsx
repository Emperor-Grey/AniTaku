import {Add, Play} from 'iconsax-react-native';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import HomeTop from './HomeTop';

export default function HomeBanner({data}) {
  const navigation = useNavigation();
  const openYouTubeVideo = () => {
    const videoId = data.trailer.id;
    // Navigate to the YoutubePlayer screen and pass the videoId as a parameter
    navigation.navigate('YoutubePlayer', {videoId});
  };

  return (
    <View style={style.imageContainer}>
      <ImageBackground
        source={{
          uri: data.image,
        }}
        resizeMode="cover"
        className="flex-1 w-full h-[100%]">
        <LinearGradient
          className=" flex-1"
          colors={[
            'rgba(0,0,0,0.17)',
            'rgba(0,0,0,0.09)',
            'rgba(10, 10, 10,0.95)',
            'rgba(10, 10, 10,1.2)',
          ]}
          locations={[0.1, 0.5, 0.9, 1]}>
          <View className="justify-between flex-1 mb-12">
            <HomeTop />
            <View className="items-center justify-center">
              <Text className="text-white font-extrabold text-2xl mb-1 text-center">
                {data.title.english}
              </Text>
              <View className="flex-row items-center justify-center mb-3">
                {data.genres.map((genre, index) => (
                  <React.Fragment key={index}>
                    <Text className="text-gray-300">{genre}</Text>
                    {index < data.genres.length - 1 && (
                      <Text className="text-gray-300">, </Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
              <View className="flex-row justify-evenly px-16 gap-5">
                <Pressable
                  className="flex-1 bg-lime-300 rounded-3xl flex-row items-center justify-center p-3 space-x-2"
                  onPress={() => {
                    openYouTubeVideo();
                  }}>
                  <Play size={17} color="#000" variant="Bold" />
                  <Text className="text-black font-medium">Play Trailer</Text>
                </Pressable>
                <TouchableOpacity className="flex-1 bg-transparent border flex-row border-solid border-gray-500 p-3 rounded-3xl space-x-2 items-center justify-center">
                  <Add size={17} color="#FFF" />
                  <Text className="text-white font-medium--dark">My List</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const style = StyleSheet.create({
  imageContainer: {
    height: responsiveHeight(62),
    width: responsiveWidth(100),
  },
});
