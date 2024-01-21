/* eslint-disable react/no-unstable-nested-components */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Calender from '../screens/Calender';
import Details from '../screens/Details';
import Home from '../screens/Home';
import NewDetails from '../screens/NewDetails';
import RecentVideoPlayer from '../screens/RecentVideoPlayer';
import Search from '../screens/Search';
import MyVideoPlayer from '../screens/VideoPlayer';
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
//         headerBackgroundContainerStyle: {backgroundColor: 'rgb(10 10 10)'},
//         headerShadowVisible: false,
//         headerBackVisible: false,
//         tabBarActiveTintColor: 'rgb(190 242 100)',

//         tabBarStyle: {
//           backgroundColor: 'rgb(10 10 10)',
//           elevation: -1,
//           height: responsiveHeight(6.2),
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
//         component={Library}
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
      {/* <Stack.Screen name="BottomNav" component={BottomNavigation} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Calender" component={Calender} />
      <Stack.Screen name="library" component={Library} />
      <Stack.Screen name="YoutubePlayer" component={YoutubePlayerScreen} />
      <Stack.Screen name="VideoPlayer" component={MyVideoPlayer} />
      <Stack.Screen name="Recent" component={RecentVideoPlayer} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="NewDetails" component={NewDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
