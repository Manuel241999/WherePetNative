import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../infrastructure/interfaces/location';

export const getCurrentLocation = async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition((info) => {
          resolve({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
          })
        }, (error) => {
          console.log(`Cant get location`);
          reject(error);
        },{
            enableHighAccuracy:true
        })
      })
}
//Para que la camara siga al objeto en el mapa automaticamente

export const watchCurrentLocation = (
  locationCallback: (location: Location) => void,
): number => {
  return Geolocation.watchPosition(info => (
    locationCallback({
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
    })
  ), (error) => {
    throw new Error(`Cant get watchPosition`);
  }, {
    enableHighAccuracy: true,
  });
};

export const clearWatchLocation = (watchId: number) => {
  Geolocation.clearWatch(watchId);
}

