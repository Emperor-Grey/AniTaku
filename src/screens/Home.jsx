import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  getPopularData,
  getRecentEpisodes,
  getTrendingData,
} from '../api/network';
import Fab from '../components/Fab';
import HomeBanner from '../components/HomeBanner';
import RowItem from '../components/RowItem';

const Home = () => {
  const [popularData, setPopularData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [recentEpisode, setRecentEpisode] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popular = await getPopularData();
        const trending = await getTrendingData();
        const recentEpisodes = await getRecentEpisodes();

        setPopularData(popular);
        setTrendingData(trending);
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
            <RowItem name="Trending" data={trendingData} />
          </>
        )}
      </ScrollView>
      <Fab />
    </View>
  );
};

export default Home;
