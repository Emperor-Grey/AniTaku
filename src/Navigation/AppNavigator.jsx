// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {
//   Calendar,
//   Home2,
//   SearchNormal1,
//   TableDocument,
// } from 'iconsax-react-native';
import React from 'react';
import Calender from '../screens/Calender';
import Details from '../screens/Details';
import Home from '../screens/Home';
import RecentVideoPlayer from '../screens/RecentVideoPlayer';
import Search from '../screens/Search';
import VideoPlayer from '../screens/VideoPlayer';
import YoutubePlayerScreen from '../screens/YoutubePlayer';
import Library from '../screens/library';

const Stack = createNativeStackNavigator();
// const BottomTab = createBottomTabNavigator();

// function BottomNavigation() {
//   return (
//     <BottomTab.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: 'rgb(190 242 100)',
//         tabBarStyle: {
//           backgroundColor: '#0a0a0a',
//           elevation: 0,
//         },
//       }}>
//       <BottomTab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           title: 'Home',
//           tabBarIcon: ({size, color}) => <Home2 size={size} color={color} />,
//         }}
//       />
//       <BottomTab.Screen
//         name="Calender"
//         component={Calender}
//         options={{
//           title: 'Calender',
//           tabBarIcon: ({size, color}) => <Calendar size={size} color={color} />,
//         }}
//       />
//       <BottomTab.Screen
//         name="Search"
//         component={Search}
//         options={{
//           title: 'Search',
//           tabBarIcon: ({size, color}) => (
//             <SearchNormal1 size={size} color={color} />
//           ),
//         }}
//       />

//       <BottomTab.Screen
//         name="library"
//         component={library}
//         options={{
//           title: 'My List',
//           tabBarIcon: ({size, color}) => (
//             <TableDocument size={size} color={color} />
//           ),
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// }

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Calender" component={Calender} />
      <Stack.Screen name="library" component={Library} />
      <Stack.Screen name="YoutubePlayer" component={YoutubePlayerScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
      <Stack.Screen name="Recent" component={RecentVideoPlayer} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
