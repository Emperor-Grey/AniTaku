/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import {episodeData} from '../api/network';

export default function VideoPlayer({route}) {
  const videoRef = useRef(null);
  const {item} = route.params;
  const nav = useNavigation();
  const [episodeLinks, setEpisodeLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('720p');

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
      }
    };

    fetchEpisodeLinks();

    // Add a listener for the hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        nav.goBack(); // Call nav.goBack() when the back button is pressed
        return true; // Return true to prevent the default behavior (exit the app)
      },
    );

    // Unlock the screen when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [item.id, nav]);

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
          <Video
            className="flex-1 items-center justify-center bg-black"
            ref={videoRef}
            source={{uri: selectedSource}}
            style={{width: '100%', height: '100%'}}
            resizeMode="stretch"
            fullscreen={true}
            paused={false}
            controls={true}
            onLoad={() => setIsLoading(false)}
          />
          <TouchableOpacity
            // style={styles.qualityButton}
            className="absolute top-2 right-2 bg-neutral-900 p-1 rounded-md"
            onPress={() => {
              // On tap, toggle between different quality options
              const qualities = Object.keys(qualityLinks);
              const currentIndex = qualities.indexOf(selectedQuality);
              const nextIndex = (currentIndex + 1) % qualities.length;
              const newQuality = qualities[nextIndex];
              changeQuality(newQuality);
            }}>
            <Text
              // style={styles.qualityButtonText}
              className="text-white text-base">
              {selectedQuality}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  qualityButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  qualityButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
