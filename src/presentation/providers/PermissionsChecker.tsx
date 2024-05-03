import {PropsWithChildren, useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {usePermissionStore} from '../store/permissions/usePermissionStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checkLocationPermission} = usePermissionStore();
  const navigator = useNavigation<NavigationProp<RootStackParams>>();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      setUserLoggedIn(!!token);
    };

    checkUserLoggedIn();
  }, []);

  // Verificar permisos y navegar si es necesario
  useEffect(() => {
    if (userLoggedIn && locationStatus === 'granted') {
      navigator.reset({
        routes: [{name: 'MapScreen'}],
      });
    } else if (!userLoggedIn) {
      navigator.navigate('Login');
    }
  }, [userLoggedIn, locationStatus]);

  // Escuchar cambios de estado de la app para verificar permisos
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
