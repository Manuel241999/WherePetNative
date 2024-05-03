import 'react-native-gesture-handler';

//import {enableLatestRenderer} from 'react-native-maps';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {StackNavigator} from './presentation/navigation/StackNavigator';
import {enableScreens} from 'react-native-screens';
import {PermissionsChecker} from './presentation/providers/PermissionsChecker';
enableScreens();

export const MapsApp = () => {
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
