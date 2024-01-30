/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StatusBar, View} from 'react-native';
import {
  getAnimeDataByGenre,
  getPopularData,
  getTrendingData,
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
  const [trendingData, setTrendingData] = useState([]);
  const [shuffledData, setShuffledData] = useState([]);
  const [genreData, setGenreData] = useState({});
  // const [recentEpisode, setRecentEpisode] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // for Pagination
  const [page, setPage] = useState(1);
  const initialItems = 6;

  const pagination = (items, pageNum, pageSize) => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    if (startIndex >= items.length) {
      return [];
    }

    return items.slice(startIndex, endIndex);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const popular = await getPopularData();
  //       const dataPromises = genres.map(async genre => {
  //         const genreData = await getAnimeDataByGenre(genre);
  //         return {[genre]: genreData};
  //       });
  //       const recentEpisodes = await getRecentEpisodes();

  //       const genreDataArray = await Promise.all(dataPromises);
  //       const combinedGenreData = Object.assign({}, ...genreDataArray);

  //       setPopularData(popular);
  //       setGenreData(combinedGenreData);
  //       setRecentEpisode(recentEpisodes);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popular = await getPopularData();
        const trending = await getTrendingData();
        const dataPromises = genres.map(async genre => {
          const genreData = await getAnimeDataByGenre(genre);
          return {[genre]: genreData};
        });
        // const recentEpisodes = await getRecentEpisodes();

        const genreDataArray = await Promise.all(dataPromises);
        const combinedGenreData = Object.assign({}, ...genreDataArray);

        // Shuffle the popularData array
        // const shuffledPopularData = [...popular];
        const shuffledPopularData = [...trending];
        for (let i = shuffledPopularData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPopularData[i], shuffledPopularData[j]] = [
            shuffledPopularData[j],
            shuffledPopularData[i],
          ];
        }

        setPopularData(popular);
        setTrendingData(trending);
        setShuffledData(shuffledPopularData);
        setGenreData(combinedGenreData);
        // setRecentEpisode(recentEpisodes);
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
          onEndReachedThreshold={0.5}
          // onEndReached={() =>{
          //   let newData = pagination();
          //   if(newData.length > 0){

          //   }
          // }}
          scrollEventThrottle={0.1}
          data={shuffledData}
          renderItem={({item}) => <HomeBanner data={item} />}
          keyExtractor={item => item.id.toString()}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-[85%]">
            <LottieView
              source={require('../../assets/Lottie/loading.json')}
              autoPlay
              loop
              style={{width: 200, height: 200}}
            />
          </View>
        ) : (
          <>
            {/* <RowItem name="Recent Episodes" data={recentEpisode} /> */}
            <RowItem name="Popular" data={popularData} />
            <RowItem name="Trending" data={trendingData} />
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
