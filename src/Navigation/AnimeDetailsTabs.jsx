// AnimeDetailsTabs.js
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import CharacterRow from '../components/CharacterRow';
import Recommendations from '../components/Recommendations';

const Tab = createMaterialTopTabNavigator();

const AnimeDetailsTabs = () => {
    return (<Tab.Navigator
            screenOptions={{
                headerShown: false,
                headerBackgroundContainerStyle: {backgroundColor: 'rgb(10 10 10)'},
                headerShadowVisible: false,
                headerBackVisible: false,
                tabBarAllowFontScaling: true,
                lazy: true,
                tabBarActiveTintColor: 'rgba(190, 242, 100,1)',
                tabBarLabelStyle: {
                    textTransform: 'none',
                },
                tabBarBounces: true,
                tabBarStyle: {
                    backgroundColor: 'rgb(10 10 10)',
                    elevation: -1,
                    width: responsiveWidth(70),
                    borderColor: 'rgba(190, 242, 100,1)',
                    borderWidth: 0,
                    borderRadius: 30,
                    marginTop: 10,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: 'rgba(190, 242, 100,1)', borderRadius: 40,
                },
            }}>
            <Tab.Screen
                name="Characters"
                component={CharacterRow}
                options={{animationEnabled: true, title: 'Characters'}}
            />
            <Tab.Screen
                name="Recommendations"
                component={Recommendations}
                options={{animationEnabled: true, title: 'Recommendations'}}
            />
        </Tab.Navigator>);
};

export default AnimeDetailsTabs;
