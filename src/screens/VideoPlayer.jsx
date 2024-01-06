/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
// import Video from 'react-native-video';
import VideoPlayer from 'react-native-media-console';
import {episodeData} from '../api/network';

export default function MyVideoPlayer({route}) {
  const videoRef = useRef();
  const {item} = route.params;
  const nav = useNavigation();
  const [episodeLinks, setEpisodeLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [isEmptySource, setIsEmptySource] = useState(false);

  const handleBack = () => {
    nav.goBack();
  };

  useEffect(() => {
    // Lock the screen to landscape when the component mounts
    Orientation.lockToLandscape();

    const fetchEpisodeLinks = async () => {
      try {
        const data = await episodeData(item.id);
        if (data && data.sources) {
          setEpisodeLinks(data.sources);
        }
      } catch (error) {
        console.error('Error fetching episode links:', error);
        // Handle error if needed
      } finally {
        setIsLoading(false);
        setIsEmptySource(!(episodeLinks.length > 0)); // Check if the source is empty
      }
    };

    fetchEpisodeLinks();

    // Unlock the screen when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [item.id, episodeLinks.length]);

  // Map the links to create an object with quality as the key and URL as the value
  const qualityLinks = {};

  episodeLinks.forEach(link => {
    qualityLinks[link.quality] = link.url;
  });

  // Use the selected quality link for the video source
  const selectedSource = qualityLinks[selectedQuality];

  // Function to handle quality change
  const changeQuality = newQuality => {
    setSelectedQuality(newQuality);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      {!isLoading && (
        <>
          <StatusBar translucent backgroundColor={'transparent'} />
          <VideoPlayer
            className="flex-1 items-center justify-center bg-black"
            videoRef={videoRef}
            source={{uri: selectedSource}}
            style={{width: '100%', height: '100%'}}
            resizeMode="stretch"
            disableFullscreen
            title={item.title.english || item.title.romaji}
            doubleTapTime={10}
            showHours
            seekColor="lime"
            isFullscreen={true}
            tapAnywhereToPause={false}
            navigator={nav}
            onBack={() => handleBack()}
            onLoad={() => setIsLoading(false)}
          />
          <TouchableOpacity
            className="absolute bottom-5 right-3 bg-neutral-900 p-1 rounded-md"
            onPress={() => {
              const qualities = Object.keys(qualityLinks);
              const currentIndex = qualities.indexOf(selectedQuality);
              const nextIndex = (currentIndex + 1) % qualities.length;
              const newQuality = qualities[nextIndex];
              changeQuality(newQuality);
            }}>
            <Text className="text-white text-base">{selectedQuality}</Text>
          </TouchableOpacity>
        </>
      )}
      {/* {!isLoading && isEmptySource && (
        <View className="flex-1 justify-center items-center bg-neutral-950">
          <Text className="text-white font-semibold text-xl px-8 text-center">
            Error Fetching Anime Info, Kindly Try Different Server
          </Text>
          <TouchableOpacity
            className="bg-red-400 p-2 mt-4 rounded-lg"
            onPress={() => nav.goBack()}>
            <Text className="text-neutral-50 text-md font-bold">Go back</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptySourceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptySourceText: {
    color: 'white',
    fontSize: 18,
  },
});
