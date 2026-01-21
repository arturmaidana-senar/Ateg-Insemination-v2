import React from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
import { disableFontScaling } from './src/utils/fontConfig';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthContextProvider from './src/contexts/auth';
import MainStack from './src/stacks/MainStack';
import { AlertNotificationRoot } from 'react-native-alert-notification';

disableFontScaling();

export default () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AlertNotificationRoot>
              <MainStack />
              <Toast config={toastConfig} />
            </AlertNotificationRoot>
          </GestureHandlerRootView>
        </AuthContextProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
