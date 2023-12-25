import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2, Heart} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {getEpisodeData} from '../api/network';

const Details = ({route}) => {
  const {item} = route.params;
  const nav = useNavigation();
  const [isFav, setIsFav] = useState(false);
  const [animeDetails, setAnimeDetails] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async id => {
      try {
        const details = await getEpisodeData(id);
        setAnimeDetails(details.anime);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };

    // Call the fetchAnimeDetails function
    fetchAnimeDetails(item.id);
  }, [item.id]);

  console.log(animeDetails);

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
          <View className="justify-between flex-1">
            <SafeAreaView>
              <View className="flex-row items-center justify-between p-2.5 mt-1">
                <TouchableOpacity
                  className="rounded-xl p-1"
                  onPress={() => nav.goBack()}
                  style={{backgroundColor: item.color}}>
                  <ArrowLeft2 size={26} strokeWidth={2.5} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Heart
                    size={35}
                    strokeWidth={2.5}
                    color={isFav ? 'red' : 'white'}
                    onPress={() => setIsFav(!isFav)}
                    variant="Bold"
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            <View className="justify-end flex-1 items-center px-4">
              <Text className="text-lime-400 text-center text-3xl font-bold tracking-wider">
                {item.title.english[0]}
                <Text className="text-white font-medium text-2xl">
                  {item.title.english.substring(1)}
                </Text>
              </Text>
            </View>
            <View className="flex-row justify-center items-center mt-1">
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {item.status} •
              </Text>
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {' '}
                {item.releaseDate} •
              </Text>
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {' '}
                {item.duration} hrs
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-center mb-3">
            {item.genres.map((genre, index) => (
              <React.Fragment key={index}>
                <Text className="text-gray-300">{genre}</Text>
                {index < item.genres.length - 1 && (
                  <Text className="text-neutral-400 font-semibold text-2xl text-center">
                    {' '}
                    •{' '}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>
      </ImageBackground>
      <Text className="text-neutral-400 mx-4 tracking-wide">
        {item.description}
      </Text>
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
