import React, {useState} from 'react';
import {LogBox, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {
  LocalizationContextProvider,
  QueryClient,
  QueryClientProvider,
  SnackbarContextProvider,
  ThemeProvider,
} from 'mobile-core';

import '../global.css';

import AnimatedBootSplash from './components/AnimatedBootSplash';
import MainNavigator from './navigation/MainNavigator';

LogBox.ignoreAllLogs();

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const queryClient = new QueryClient();

  const hideSplashScreen = () => {
    setSplashVisible(false);
  };

  return (
    <>
      <View testID="nativewind-host" className="p-24 bg-blue-500">
        <Text className="text-red-500">I am supposed to be styled!</Text>
      </View>
      {isSplashVisible ? (
        <AnimatedBootSplash onAnimationEnd={hideSplashScreen} />
      ) : null}
      <ThemeProvider>
        <LocalizationContextProvider>
          <QueryClientProvider client={queryClient}>
            <SnackbarContextProvider>
              <NavigationContainer>
                <MainNavigator />
              </NavigationContainer>
            </SnackbarContextProvider>
          </QueryClientProvider>
        </LocalizationContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
