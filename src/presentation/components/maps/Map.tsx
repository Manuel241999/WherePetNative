import { View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../store/location/useLocationStore';
import { Image } from 'react-native';

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({ showsUserLocation = false, initialLocation }: Props) => {
  const mapRef = useRef<MapView>();
  const camaraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);

  const {
    getLocation,
    lastKnownLocation,
    watchLocation,
    clearWatchLocation,
    userLocationList,
  } = useLocationStore();

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({
      center: location,
      pitch: 0,
      heading: 0,
      altitude: 0,
      zoom: 15,
    });
  };

  const moveToCurrentLocation = async () => {
    const location = await getLocation();
    console.log('Ubicación obtenida:', location);
    if (!location) return;
    moveCameraToLocation(location);
  };

  useEffect(() => {
    watchLocation();
    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCameraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

  return (
    <>
      <MapView
        ref={map => (mapRef.current = map!)}
        showsUserLocation={showsUserLocation}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        onTouchStart={() => setIsFollowingUser(false)}
        region={{
          latitude: camaraLocation.current.latitude,
          longitude: camaraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {isShowingPolyline && (
          <Polyline
            coordinates={userLocationList}
            strokeColor="red"
            strokeWidth={5}
          />
        )}

        {/* Personalized Marker */}
        <Marker
          coordinate={{
            latitude: lastKnownLocation?.latitude || initialLocation.latitude,
            longitude: lastKnownLocation?.longitude || initialLocation.longitude,
          }}
          title="Your Current Location"
        >
          <Image
            source={require("../../../assets/perro.png")}
            style={{ width: 50, height: 50 }}
          />
        </Marker>
      </MapView>

      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{
          bottom: 140,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{
          bottom: 80,
          right: 20,
        }}
      />

      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
};

export default Map;
