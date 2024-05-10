import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './presentation/navigation/StackNavigator';
import { enableScreens } from 'react-native-screens';
import { PermissionsChecker } from './presentation/providers/PermissionsChecker';
import messaging from '@react-native-firebase/messaging';

enableScreens();

export const MapsApp = () => {

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestPermission();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <PermissionsChecker>
          <StackNavigator />
        </PermissionsChecker>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </PaperProvider>
  );
};
