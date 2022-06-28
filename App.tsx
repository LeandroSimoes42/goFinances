import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './src/global/styles/theme';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { StatusBar, View } from 'react-native';
import AppRoutes from './src/routes/index.routes';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignIn from './src/screens/SignIn';
import { AuthProvider } from './src/providers/Auth/auth';
import Routes from './src/routes';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_700Bold
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
      <View style={{flex: 1}} onLayout={onLayoutRootView}>
        <GestureHandlerRootView style={{flex: 1}}>
          <ThemeProvider theme={theme}>
                <StatusBar barStyle={'light-content'} translucent backgroundColor={'transparent'}/>
                <AuthProvider>
                  <Routes/>
                </AuthProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </View>
  );
}
