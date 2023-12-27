/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import {RecentEpisodeData} from '../api/network';

export default function RecentVideoPlayer({route}) {
  const videoRef = useRef(null);
  const {item} = route.params;
  const [episodeLinks, setEpisodeLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock the screen to landscape when the component mounts
    Orientation.lockToLandscape();

    const fetchEpisodeLinks = async () => {
      try {
        const data = await RecentEpisodeData(item.episodeId);
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

    // Unlock the screen when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [item.episodeId]);

  // Map the links to create an object with quality as the key and URL as the value
  const qualityLinks = {};

  episodeLinks.forEach(link => {
    qualityLinks[link.quality] = link.url;
  });

  // Use the '720p' link for the video source
  const selectedSource = qualityLinks['720p'];

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      {!isLoading && (
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
});
