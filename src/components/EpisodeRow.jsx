import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {TickSquare} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const EpisodeRow = ({data, mainData, more}) => {
  const navigation = useNavigation();
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);

  const onPressItem = async item => {
    navigation.navigate('VideoPlayer', {item});

    const isSelected = selectedEpisodes.some(
      selected => selected.id === item.id,
    );

    if (isSelected) {
      setSelectedEpisodes(prevSelected =>
        prevSelected.filter(selected => selected.id !== item.id),
      );
    } else {
      setSelectedEpisodes(prevSelected => [...prevSelected, item]);
    }

    try {
      await AsyncStorage.setItem(
        'selectedEpisodes',
        JSON.stringify(selectedEpisodes),
      );
    } catch (error) {
      console.error('Error storing selected episodes:', error);
    }
  };

  useEffect(() => {
    const retrieveSelectedEpisodes = async () => {
      try {
        const storedSelectedEpisodes = await AsyncStorage.getItem(
          'selectedEpisodes',
        );
        if (storedSelectedEpisodes) {
          setSelectedEpisodes(JSON.parse(storedSelectedEpisodes));
        }
      } catch (error) {
        console.error('Error retrieving selected episodes:', error);
      }
    };

    retrieveSelectedEpisodes();
  }, []);

  const renderItem = ({item}) => {
    const isSelected = selectedEpisodes.some(
      selected => selected.id === item.id,
    );

    return (
      <TouchableOpacity
        style={styles.episodeItem}
        onPress={() => onPressItem(item)}>
        <ImageBackground
          source={{uri: item.image || more.image}}
          resizeMode="cover"
          style={styles.episodeImage}
          className="rounded-xl overflow-hidden mt-2">
          <LinearGradient
            className="flex-1 justify-end p-2"
            colors={['transparent', 'rgba(0,0,0,0.7)']}>
            <Text
              className="text-white font-medium text-base pr-7"
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.title}
            </Text>
          </LinearGradient>
          {isSelected && (
            <View style={styles.overlayContainer}>
              <LinearGradient
                style={styles.overlayGradient}
                colors={['rgba(190,242,100,0.2)', 'rgba(190,242,100,0.07)']}>
                <TickSquare size={35} color="green" variant="Bulk" />
              </LinearGradient>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      nestedScrollEnabled={true}
      horizontal
      scrollEventThrottle={0.1}
      alwaysBounceHorizontal={true}
      data={data || mainData[0].episodes}
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default EpisodeRow;

const styles = StyleSheet.create({
  episodeItem: {
    padding: 4,
  },
  episodeImage: {
    width: responsiveWidth(43),
    resizeMode: 'cover',
    height: responsiveHeight(15),
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 7,
  },
});
