/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {useNavigation} from '@react-navigation/native';
import {Star1} from 'iconsax-react-native'; // Make sure to import your Star1 component here
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const RowItem = props => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [numColumns, setNumColumns] = useState(3);

  const handleItemPress = item => {
    if (item.rating) {
      navigation.navigate('Details', {item});
    } else {
      navigation.navigate('Recent', {item});
    }
  };

  const handleLongPress = item => {
    navigation.navigate('Details', {item});
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true; // Do not exit the app
      }
      return false; // Let the default back button behavior work
    };

    // Add event listener for hardware back button
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup the event listener on component unmount
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [modalVisible]);

  const renderModelData = ({item}) => {
    return (
      <TouchableOpacity
        className="items-center justify-center flex-wrap p-[3.5px]"
        onLongPress={() => handleLongPress(item)}
        onPress={() => handleItemPress(item)}>
        <ImageBackground
          source={{uri: item.image}}
          resizeMode="cover"
          style={styles.imageModel}>
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      className="items-center mt-2 mb-2 justify-center px-1 flex-1"
      onLongPress={() => handleLongPress(item)}
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

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="px-2 mb-2">
      <View className="justify-between items-center flex-row px-3">
        <Text className="text-lime-400 font-normal text-2xl">
          {props.name[0]}
          <Text className="text-white font-medium text-lg">
            {props.name.substring(1)}
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem(props.data);
            setModalVisible(true);
            setModelData(props.data);
          }}>
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
      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        style={{margin: 0}}
        propagateSwipe={true}
        swipeDirection={['down', 'up']}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View
          className="bg-neutral-950 h-[500px] rounded-t-3xl absolute bottom-0 right-0 left-0 flex-1"
          style={styles.modelHeight}>
          <View className="p-1 mt-3">
            <FlatList
              data={modelData}
              keyExtractor={item => item.id.toString()}
              renderItem={renderModelData}
              numColumns={numColumns}
              onEndReachedThreshold={0.1}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RowItem;

const styles = StyleSheet.create({
  image: {
    borderRadius: 18,
    overflow: 'hidden',
    width: responsiveWidth(34.5),
    height: responsiveHeight(22.6),
  },
  imageModel: {
    borderRadius: 18,
    overflow: 'hidden',
    width: responsiveWidth(31),
    height: responsiveHeight(21),
  },
  modelHeight: {
    padding: 0,
    margin: 0,
    height: responsiveHeight(54),
    width: responsiveWidth(100),
  },
});
