// AnimeDetailsTabs.js
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import RecommendationsScreen from './RecommendationsScreen';
import ShowCharactersScreen from './ShowCharactersScreen';

const Tab = createMaterialTopTabNavigator();

const AnimeDetailsTabs = () => {
    return (
        <Tab.Navigator>
          <Tab.Screen name="Charecters" component={HomeScreen} />
          <Tab.Screen name="Recomendations" component={SettingsScreen} />
        </Tab.Navigator>
      );
    }

export default AnimeDetailsTabs;
