import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './Navigation/AppNavigator';
const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
