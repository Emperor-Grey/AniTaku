import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {hideNavigationBar, showNavigationBar} from 'react-native-navigation-bar-color';
import AppNavigator from './Navigation/AppNavigator';

const App = () => {
    useEffect(() => {
        // Hide the navigation bar when the component mounts
        hideNavigationBar();
        return () => {
            // Show the navigation bar when the component unmounts
            showNavigationBar();
        };
    }, []);

    return (<NavigationContainer>
        <AppNavigator/>
    </NavigationContainer>);
};

export default App;
