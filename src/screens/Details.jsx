import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const Details = ({route}) => {
  const {item} = route.params;
  return (
    <View className="flex-1 bg-neutral-950">
      <ImageBackground
        source={{uri: item.image}}
        resizeMode="cover"
        style={styles.image}>
        <LinearGradient
          className="flex-1"
          colors={[
            'rgba(0,0,0,0.17)',
            'rgba(0,0,0,0.09)',
            'rgba(11, 11, 11,0.95)',
            'rgba(11, 11, 11,1.4)',
          ]}
          locations={[0.1, 0.5, 0.9, 1]}>
          <View className="justify-end flex-1 items-center mb-7 p-3">
            <Text
              className="text-lime-400 text-center font-normal text-3xl"
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.title.english[0]}
              <Text className="text-white font-medium text-2xl">
                {item.title.english.substring(1)}
              </Text>
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'stretch',
    width: responsiveWidth(100),
    height: responsiveHeight(55),
  },
});
