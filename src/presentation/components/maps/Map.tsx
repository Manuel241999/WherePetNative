import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { gql, useQuery } from '@apollo/client';

// Definición del query de GraphQL
const GET_LOCATION_DATA = gql`
  query ObtenerZonas {
    obtenerZonas(input: { idUsuario: "6629b321d89f4e5852983afd" }) {
      latitud
      longitud
    }
  }
`;

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({ showsUserLocation = false, initialLocation }: Props) => {
  const mapRef = useRef<MapView>();
  const [locationHistory, setLocationHistory] = useState([initialLocation]);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [showPath, setShowPath] = useState(true);

  const { data, startPolling, stopPolling } = useQuery(GET_LOCATION_DATA, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (data && data.obtenerZonas && data.obtenerZonas.length > 0) {
      const lastLocation = data.obtenerZonas[data.obtenerZonas.length - 1];
      setLocationHistory(prev => [...prev, {
        latitude: lastLocation.latitud,
        longitude: lastLocation.longitud
      }]);
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
        style={{ flex: 1 }}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
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
      />
    </>
  );
};

export default Map;
