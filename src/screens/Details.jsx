/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2, Heart} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  Clipboard,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
// import AnimeDetailsTabs from '../navigation/AnimeDetailsTabs'
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import AnimeDetailsTabs from '../Navigation/AnimeDetailsTabs';
import {getEpisodeData} from '../api/network';
import EpisodeRow from '../components/EpisodeRow';

const Details = ({route}) => {
    const {item} = route.params;
    const nav = useNavigation();
    const [isFav, setIsFav] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enteredEpisode, setEnteredEpisode] = useState('');
    const [animeDetails, setAnimeDetails] = useState(null);

    useEffect(() => {
        const fetchAnimeDetails = async id => {
            try {
                const details = await getEpisodeData(id);
                setAnimeDetails(detsails.anime);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching anime details:', error);
                setLoading(false);
            }
        };

        // Call the fetchAnimeDetails function
        fetchAnimeDetails(item.id);
    }, [item.id]);

    if (loading) {
        // Render loading indicator while data is being fetched
        return (<View className="flex-1 justify-center items-center bg-neutral-950">
                <LottieView
                    source={require('../../assets/Lottie/loading.json')}
                    autoPlay
                    loop
                    style={{width: 200, height: 200}}
                />
            </View>);
    }

    if (!animeDetails.title) {
        // Handle the case where animeDetails is still null (data fetching failed)
        return (<View className="flex-1 justify-center items-center bg-neutral-950">
                <Text className="text-white font-semibold text-xl px-8 text-center">
                    Error Fetching Anime Info Kindly Try Different Server
                </Text>
                <TouchableOpacity
                    className="bg-red-400 p-2 mt-4 rounded-lg"
                    onPress={() => nav.replace('NewDetails', {item})}>
                    <Text className="text-neutral-50 text-md font-bold">Let's go</Text>
                </TouchableOpacity>
            </View>);
    }

    return (<ScrollView className="flex-1 bg-neutral-950">
            <ImageBackground
                source={{uri: animeDetails.image}}
                resizeMode="cover"
                style={styles.image}>
                <LinearGradient
                    className="flex-1"
                    colors={['rgba(0,0,0,0.17)', 'rgba(0,0,0,0.09)', 'rgba(11, 11, 11,0.95)', 'rgba(11, 11, 11,1.4)']}
                    locations={[0.1, 0.5, 0.9, 1]}>
                    <View className="justify-between flex-1">
                        <SafeAreaView>
                            <View className="flex-row items-center justify-between p-3 mt-1">
                                <TouchableOpacity
                                    className="rounded-xl p-1"
                                    onPress={() => nav.goBack()}
                                    style={{backgroundColor: item.color}}>
                                    <ArrowLeft2 size={26} strokeWidth={2.5} color="#FFF"/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Heart
                                        size={35}
                                        strokeWidth={2.5}
                                        color={isFav ? 'red' : 'white'}
                                        onPress={() => setIsFav(!isFav)}
                                        variant="Bold"
                                    />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                        <View className="justify-end flex-1 items-center px-4">
                            <Text className="text-lime-400 text-center text-3xl font-bold tracking-wider">
                                {animeDetails.title.english[0]}
                                <Text className="text-white font-medium text-2xl">
                                    {animeDetails.title.english.substring(1)}
                                </Text>
                            </Text>
                        </View>
                        <View className="flex-row justify-center items-center mt-1">
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {animeDetails.status} •
                            </Text>
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {' '}
                                {animeDetails.releaseDate} •
                            </Text>
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {' '}
                                {animeDetails.duration} hrs
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-center mb-3 px-9">
                        <ScrollView
                            nestedScrollEnabled
                            horizontal
                            contentContainerStyle={styles.center}
                            showsHorizontalScrollIndicator={false}>
                            {animeDetails.genres.map((genre, index) => (<React.Fragment key={index}>
                                    <Text className="text-gray-300 text-center justify-center items-center">
                                        {genre}
                                    </Text>
                                    {index < animeDetails.genres.length - 1 && (<Text
                                            className="text-neutral-400 font-semibold text-2xl text-center justify-center items-center">
                                            {' '}
                                            •{' '}
                                        </Text>)}
                                </React.Fragment>))}
                        </ScrollView>
                    </View>
                </LinearGradient>
            </ImageBackground>

            {/* Content below ImageBackground */}
            <View className="flex-1 bg-neutral-950 p-2">
                <View className="flex-row justify-between items-center">
                    <Text className="text-lime-300 text-3xl font-medium px-1">
                        S
                        <Text className="text-white text-2xl font-medium">
                            tory{' '}
                            <Text className="text-lime-300 text-3xl font-medium">
                                L<Text className="text-white text-2xl font-medium">ine</Text>
                            </Text>
                        </Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => nav.replace('NewDetails', {item})}
                        className="bg-lime-300 p-1 mr-1 rounded-md">
                        <Text className="text-black">Change Server</Text>
                    </TouchableOpacity>
                </View>

                <Text
                    className="text-sm text-white p-3 font-normal"
                    onLongPress={() => Clipboard.setString(animeDetails.description)}>
                    {showFullDescription ? animeDetails.description : animeDetails.description.substring(0, 320) + '...'}
                    {!showFullDescription ? (<Text
                            className="text-lime-300 text-sm"
                            onPress={() => setShowFullDescription(true)}>
                            Read More
                        </Text>) : (<Text
                            className="text-lime-300 text-sm"
                            onPress={() => setShowFullDescription(false)}>
                            Read Less
                        </Text>)}
                </Text>
                {/* episode Row */}
                <View className="justify-between items-center flex-row">
                    <Text className="text-lime-300 text-3xl font-medium px-1">
                        E
                        <Text className="text-white text-2xl font-medium">
                            pisodes ({animeDetails.totalEpisodes})
                        </Text>
                    </Text>
                    <TextInput
                        className="border-gray-600 border rounded-md w-28 h-10 text-white mr-2"
                        keyboardType="numeric"
                        placeholder="Enter ep"
                        placeholderTextColor="white"
                        placeholderStyle={{fontSize: 13, padding: 2}}
                        value={enteredEpisode}
                        onChangeText={text => {
                            setEnteredEpisode(text);
                        }}
                    />
                </View>
                {/* FlatList For Episodes */}
                <EpisodeRow
                    data={animeDetails.episodes}
                    enteredEpisode={enteredEpisode}
                />

                {/* Character and Recommendations Components  */}
                {/* <AnimeDetailsTabs /> */}
            </View>
        </ScrollView>);
};

export default Details;

const styles = StyleSheet.create({
    image: {
        resizeMode: 'stretch', width: responsiveWidth(100), height: responsiveHeight(63),
    }, center: {
        justifyContent: 'center', alignItems: 'center',
    }, episodeImage: {
        width: responsiveWidth(44), resizeMode: 'cover', height: responsiveHeight(18),
    },
});
