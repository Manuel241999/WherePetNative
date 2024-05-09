<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { gql, useQuery } from '@apollo/client';
=======
import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, Image} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Circle,
} from 'react-native-maps';
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {gql, useQuery} from '@apollo/client';
>>>>>>> Manuel

// Definición del query de GraphQL
const GET_LOCATION_DATA = gql`
  query ObtenerZonas {
<<<<<<< HEAD
    obtenerZonas(input: { idUsuario: "6629b321d89f4e5852983afd" }) {
=======
    obtenerZonas(input: {idUsuario: "6629b321d89f4e5852983afd"}) {
>>>>>>> Manuel
      latitud
      longitud
    }
  }
`;

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({showsUserLocation = false, initialLocation}: Props) => {
  const mapRef = useRef<MapView>();
  const [locationHistory, setLocationHistory] = useState([initialLocation]);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [showPath, setShowPath] = useState(true);

<<<<<<< HEAD
  const { data, startPolling, stopPolling } = useQuery(GET_LOCATION_DATA, {
    fetchPolicy: 'network-only'
=======
  const {data, startPolling, stopPolling} = useQuery(GET_LOCATION_DATA, {
    fetchPolicy: 'network-only',
>>>>>>> Manuel
  });

  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (data && data.obtenerZonas && data.obtenerZonas.length > 0) {
      const lastLocation = data.obtenerZonas[data.obtenerZonas.length - 1];
<<<<<<< HEAD
      setLocationHistory(prev => [...prev, {
        latitude: lastLocation.latitud,
        longitude: lastLocation.longitud
      }]);
=======
      setLocationHistory(prev => [
        ...prev,
        {
          latitude: lastLocation.latitud,
          longitude: lastLocation.longitud,
        },
      ]);
>>>>>>> Manuel
    }
  }, [data]);

  const centerOnPet = () => {
    const lastLocation = locationHistory[locationHistory.length - 1];
    mapRef.current?.animateCamera({
      center: lastLocation,
      pitch: 0,
      heading: 0,
      altitude: 0,
      zoom: 18,
    });
  };

  return (
    <>
      <MapView
        ref={mapRef}
        showsUserLocation={showsUserLocation}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
<<<<<<< HEAD
        style={{ flex: 1 }}
=======
        style={{flex: 1}}
>>>>>>> Manuel
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
<<<<<<< HEAD
        }}
      >
        <Marker
          coordinate={locationHistory[locationHistory.length - 1]}
          title="Current Location"
        >
          <Image
            source={require("../../../assets/perro.png")}
            style={{ width: 50, height: 50 }}
          />
        </Marker>
        {showPath && <Polyline
          coordinates={locationHistory}
          strokeColor="red"
          strokeWidth={5}
        />}
      </MapView>

      <FAB
        iconName='eye-outline'
        onPress={() => setShowPath(!showPath)}
        style={{ bottom: 80, right: 20 }}
      />
      <FAB
        iconName='compass-outline'
        onPress={centerOnPet}
        style={{ bottom: 20, right: 20 }}
=======
        }}>
        <Marker
          coordinate={locationHistory[locationHistory.length - 1]}
          title="Current Location">
          <Image
            source={require('../../../assets/perro.png')}
            style={{width: 50, height: 50}}
          />
        </Marker>
        {showPath && (
          <Polyline
            coordinates={locationHistory}
            strokeColor="red"
            strokeWidth={5}
          />
        )}
        <Circle
          center={{latitude: 14.532903721556067, longitude: -90.5671667587012}}
          radius={20} // radio en metros
          fillColor="rgba(0, 128, 255, 0.3)" // Color del círculo
          strokeColor="blue" // Color del borde
        />
      </MapView>

      <FAB
        iconName="eye-outline"
        onPress={() => setShowPath(!showPath)}
        style={{bottom: 80, right: 20}}
      />
      <FAB
        iconName="compass-outline"
        onPress={centerOnPet}
        style={{bottom: 20, right: 20}}
>>>>>>> Manuel
      />
    </>
  );
};

export default Map;
