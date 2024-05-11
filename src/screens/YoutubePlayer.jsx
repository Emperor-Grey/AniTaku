import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function YoutubePlayerScreen({route}) {
    const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
    const playerRef = useRef(null);

    const navigation = useNavigation();
    const {videoId} = route.params;
    const [isYouTubeVisible, setIsYouTubeVisible] = useState(true);

    const closeYouTube = () => {
        setIsYouTubeVisible(false);
        Orientation.lockToPortrait();
        navigation.goBack();
    };

    useEffect(() => {
        // Lock the screen to landscape when the component mounts
        Orientation.lockToLandscape();
        // Unlock the screen when the component unmounts
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <>
            {isYouTubeVisible && (
                <YoutubePlayer
                    className="flex-1 justify-center items-center"
                    ref={playerRef}
                    height={SCREEN_WIDTH}
                    width={SCREEN_HEIGHT}
                    // style={{width: '100%', height: '100%'}}
                    play={isYouTubeVisible}
                    webViewProps={{
                        injectedJavaScript: `
              var element = document.getElementsByClassName('container')[0];
              element.style.position = 'unset';
              element.style.paddingBottom = 'unset';
              true;
            `,
                    }}
                    initialPlayerParams={{preventFullScreen: false}}
                    videoId={videoId}
                    forceAndroidAutoplay
                    allowWebViewZoom
                    onChangeState={state => {
                        if (state === 'ended') {
                            closeYouTube();
                        }
                    }}
                />
            )}
        </>
    );
}
