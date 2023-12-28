/* eslint-disable no-shadow */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  getAnimeDataByGenre,
  getPopularData,
  getRecentEpisodes,
} from '../api/network';
import Fab from '../components/Fab';
import HomeBanner from '../components/HomeBanner';
import RowItem from '../components/RowItem';

const genres = [
  'Comedy',
  'Fantasy',
  'Horror',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Thriller',
];

const Home = () => {
  const [popularData, setPopularData] = useState([]);
  const [genreData, setGenreData] = useState({});
  const [recentEpisode, setRecentEpisode] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popular = await getPopularData();
        const dataPromises = genres.map(async genre => {
          const genreData = await getAnimeDataByGenre(genre);
          return {[genre]: genreData};
        });
        const recentEpisodes = await getRecentEpisodes();

        const genreDataArray = await Promise.all(dataPromises);
        const combinedGenreData = Object.assign({}, ...genreDataArray);

        setPopularData(popular);
        setGenreData(combinedGenreData);
        setRecentEpisode(recentEpisodes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="bg-neutral-950 flex-1">
      <StatusBar translucent backgroundColor={'transparent'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          scrollEventThrottle={0.1}
          data={popularData}
          renderItem={({item}) => <HomeBanner data={item} />}
          keyExtractor={item => item.id.toString()}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-[100%]">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <>
            <RowItem name="Recent Episodes" data={recentEpisode} />
            <RowItem name="Popular" data={popularData} />
            {genres.map(genre => (
              <RowItem key={genre} name={genre} data={genreData[genre] || []} />
            ))}
          </>
        )}
      </ScrollView>
      <Fab />
    </View>
  );
};

export default Home;
