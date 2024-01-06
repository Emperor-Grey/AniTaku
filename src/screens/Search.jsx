/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {Setting5} from 'iconsax-react-native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {searchAnime} from '../api/network';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [numColumns, setNumColumns] = useState(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllPages = async query => {
    let allResults = [];
    let currentPage = 1;

    try {
      while (true) {
        const searchData = await searchAnime(query, currentPage);
        const {results, lastPage} = searchData;

        allResults = [...allResults, ...results];
        currentPage++;

        if (currentPage > lastPage) {
          break;
        }
      }

      return allResults;
    } catch (error) {
      console.error('Error fetching all pages:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const newResults = await fetchAllPages(searchQuery);
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error handling search:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  const handleItemPress = async item => {
    if (item.rating) {
      navigation.navigate('Details', {item});
    } else {
      navigation.navigate('Recent', {item});
    }
  };

  const handleLongPress = async item => {
    navigation.navigate('NewDetails', {item});
  };
  const renderSearchItem = ({item}) => {
    return (
      <TouchableOpacity
        className="items-center justify-center flex-wrap p-[3.5px]"
        onLongPress={() => handleLongPress(item)}
        onPress={() => handleItemPress(item)}>
        <ImageBackground
          source={{uri: item.image}}
          resizeMode="cover"
          style={styles.image}>
          <View className="flex-1 items-start justify-start p-2">
            <Pressable className="bg-lime-200 px-1 py-[2] rounded-full flex-row items-center justify-center space-x-1">
              <Text className="text-black">{item.format}</Text>
            </Pressable>
          </View>
        </ImageBackground>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-white text-base text-ellipsis mt-1 items-start justify-start overflow-hidden">
          {item.rating
            ? item.title.english && item.title.english.length <= 16
              ? item.title.english
              : item.title.english
              ? `${item.title.english.slice(0, 14)}...`
              : 'No Name'
            : item.title.romaji.romaji && item.title.romaji.length <= 16
            ? item.title.romaji
            : item.title.romaji
            ? `${item.title.romaji.slice(0, 14)}...`
            : 'No Name'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-neutral-950 justify-center">
      <SafeAreaView>
        <View className="flex-row items-center justify-center mt-5 p-2">
          <TextInput
            className="bg-white w-[88%] h-11 rounded-md m-2 text-black font-normal text-base"
            placeholder="Search"
            clearButtonMode="always"
            numberOfLines={1}
            textAlignVertical="center"
            placeholderTextColor="#666"
            value={searchQuery}
            inputMode="search"
            blurOnSubmit
            onSubmitEditing={handleSearch}
            onChangeText={text => setSearchQuery(text)}
          />
          <TouchableOpacity
            onPress={handleSearch}
            className="rounded-lg bg-neutral-800 p-1">
            <Setting5 size="32" color="white" variant="Bold" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* <Text className="text-white text-3xl p-2">
        Results({searchResults.length.toString()})
      </Text> */}

      {loading && (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="large"
          color="#ffffff"
        />
      )}

      <FlatList
        data={searchResults}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSearchItem}
        numColumns={numColumns}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  image: {
    borderRadius: 18,
    overflow: 'hidden',
    width: responsiveWidth(32),
    height: responsiveHeight(21),
  },
});
