import {useNavigation} from '@react-navigation/native';
import {Star1} from 'iconsax-react-native';
import React from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const RowItem = props => {
  const navigation = useNavigation();

  const handleItemPress = async item => {
    if (item.rating) {
      navigation.navigate('Details', {item});
    } else {
      navigation.navigate('VideoPlayer', {item});
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      className="items-center mt-2 mb-2 justify-center px-1 flex-1"
      onPress={() => handleItemPress(item)}>
      <ImageBackground
        source={{uri: item.image}}
        resizeMode="cover"
        style={styles.image}>
        <View className="flex-1 items-start justify-start p-2">
          <Pressable className="bg-lime-200 px-1 py-[2] rounded-full flex-row items-center justify-center space-x-1">
            {item.rating ? (
              <>
                {/* Render Star1 or your rating component */}
                <Star1 variant="Bold" size={12} color="#000" />
                <Text className="text-black">{item.rating}</Text>
              </>
            ) : (
              <>
                {/* Render episode number or any other fallback */}
                <Text className="text-black">Ep {item.episodeNumber}</Text>
              </>
            )}
          </Pressable>
        </View>
      </ImageBackground>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="text-white text-base text-ellipsis mt-1 items-start justify-start overflow-hidden">
        {item.title.english && item.title.english.length <= 16
          ? item.title.english
          : item.title.english
          ? `${item.title.english.slice(0, 14)}...`
          : 'No Name'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-2 mb-2">
      <View className="justify-between items-center flex-row px-3">
        <Text className="text-lime-400 font-normal text-2xl">
          {props.name[0]}
          <Text className="text-white font-medium text-lg">
            {props.name.substring(1)}
          </Text>
        </Text>
        <TouchableOpacity>
          <Text className="text-lime-200 text-sm">View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        nestedScrollEnabled={true}
        scrollEventThrottle={0}
        horizontal
        data={props.data || []}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default RowItem;

const styles = StyleSheet.create({
  image: {
    borderRadius: 18,
    overflow: 'hidden',
    width: responsiveWidth(38),
    height: responsiveHeight(24),
  },
});
