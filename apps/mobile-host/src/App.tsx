import React, {useState} from 'react';
import {LogBox} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {
  LocalizationContextProvider,
  QueryClient,
  QueryClientProvider,
  SnackbarContextProvider,
  ThemeProvider,
} from 'mobile-core';

import AnimatedBootSplash from './components/AnimatedBootSplash';
import MainNavigator from './navigation/MainNavigator';

// import {init} from '@module-federation/runtime';
// import mfConfig from '../module-federation.config.mjs';
// init(mfConfig);

LogBox.ignoreAllLogs();

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const queryClient = new QueryClient();

  const hideSplashScreen = () => {
    setSplashVisible(false);
  };

  return (
    <>
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
