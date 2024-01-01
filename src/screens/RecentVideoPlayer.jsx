/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
// import Video from 'react-native-video';
import VideoPlayer from 'react-native-media-console';
import {RecentEpisodeData} from '../api/network';

export default function MyVideoPlayer({route}) {
  const videoRef = useRef(null);
  const {item} = route.params;
  const nav = useNavigation();
  const [episodeLinks, setEpisodeLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [error, setError] = useState(null); // New state for error handling

  const handleBack = () => {
    nav.goBack();
  };

  useEffect(() => {
    // Lock the screen to landscape when the component mounts
    Orientation.lockToLandscape();
    const fetchEpisodeLinks = async () => {
      try {
        if (typeof item.episodeId === 'undefined') {
          throw new Error('Episode ID is missing');
        }

        const data = await RecentEpisodeData(item.episodeId);
        if (data && data.sources) {
          setEpisodeLinks(data.sources);
        } else {
          throw new Error('No sources found for the episode');
        }
      } catch (err) {
        console.error('Error fetching episode links:', err.message);
        setError('Error fetching episode info. Please wait for a fix.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodeLinks();

    // Unlock the screen when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [item]);

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

  return !error ? (
    <View className="flex-1">
      {isLoading && (
        <View className="flex-1 justify-center items-center bg-neutral-900">
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
            className="absolute bottom-3 right-3 bg-neutral-900 p-1 rounded-md"
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
    </View>
  ) : (
    <View className="bg-neutral-900 justify-center items-center flex-1">
      <Text className="text-white text-2xl">{error}</Text>
      <TouchableOpacity
        className="bg-red-400 p-2 mt-4 rounded-lg"
        onPress={() => nav.goBack()}>
        <Text className="text-neutral-50 text-md font-bold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
