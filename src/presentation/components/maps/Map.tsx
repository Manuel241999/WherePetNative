import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle } from 'react-native-maps';
import { gql, useQuery } from '@apollo/client';
import { FAB } from '../ui/FAB';
import PushNotification from 'react-native-push-notification';

// Definición del query de GraphQL
const GET_LOCATION_DATA = gql`
  query ObtenerZonas {
    obtenerZonas(input: {idUsuario: "6629b321d89f4e5852983afd"}) {
      latitud
      longitudimport React, { useEffect, useRef, useState } from 'react';
      import { View, Platform, Image, Alert } from 'react-native';
      import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle, Region } from 'react-native-maps';
      import { gql, useQuery } from '@apollo/client';
      import {FAB} from '../ui/FAB';
      
      // Definición del query de GraphQL
      const GET_LOCATION_DATA = gql`
        query ObtenerZonas {
          obtenerZonas(input: {idUsuario: "6629b321d89f4e5852983afd"}) {
            latitud
            longitud
          }
        }
      `;
      
      interface Location {
        latitude: number;
        longitude: number;
      }
      
      interface Props {
        showsUserLocation?: boolean;
        initialLocation: Location;
      }
      
      export const Map = ({ showsUserLocation = false, initialLocation }: Props) => {
        const mapRef = useRef<MapView | null>(null);
        const [locationHistory, setLocationHistory] = useState<Location[]>([initialLocation]);
        const [showPath, setShowPath] = useState(true);
        const safeZoneCenter: Location = {latitude: 14.532903721556067, longitude: -90.5671667587012};
        const safeZoneRadius = 20; // radius in meters
      
        const {data, startPolling, stopPolling} = useQuery(GET_LOCATION_DATA, {
          fetchPolicy: 'network-only',
        });
      
        useEffect(() => {
          startPolling(5000);
          return () => stopPolling();
        }, []);
      
        useEffect(() => {
          if (data && data.obtenerZonas && data.obtenerZonas.length > 0) {
            const lastLocation = data.obtenerZonas[data.obtenerZonas.length - 1];
            const newLocation = {
              latitude: lastLocation.latitud,
              longitude: lastLocation.longitud,
            };
            setLocationHistory(prev => [...prev, newLocation]);
      
            // Check if the pet is outside the safe zone
            if (getDistanceFromLatLonInMeters(newLocation, safeZoneCenter) > safeZoneRadius) {
              Alert.alert("Alerta", "Tu mascota ha salido de la zona segura.");
            }
          }
        }, [data]);
      
        const getDistanceFromLatLonInMeters = (loc1: Location, loc2: Location): number => {
          const R = 6371; // Radius of the earth in km
          const dLat = deg2rad(loc2.latitude - loc1.latitude);
          const dLon = deg2rad(loc2.longitude - loc1.longitude);
          const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(loc1.latitude)) * Math.cos(deg2rad(loc2.latitude)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          return R * c * 1000; // Distance in meters
        };
      
        const deg2rad = (deg: number): number => {
          return deg * (Math.PI / 180);
        };
      
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
              style={{flex: 1}}
              initialRegion={{
                latitude: initialLocation.latitude,
                longitude: initialLocation.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
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
                center={safeZoneCenter}
                radius={safeZoneRadius}
                fillColor="rgba(255, 0, 0, 0.3)"
                strokeColor="red"
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
            />
          </>
        );
      };
      
      export default Map;
      
    }
  }
`;

interface Location {
  latitude: number;
  longitude: number;
}

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({ showsUserLocation = false, initialLocation }: Props) => {
  const mapRef = useRef<MapView | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([initialLocation]);
  const [showPath, setShowPath] = useState(true);
  const safeZoneCenter: Location = {latitude: 14.532903721556067, longitude: -90.5671667587012};
  const safeZoneRadius = 20; // radius in meters

  // Configuración inicial de notificaciones push
  useEffect(() => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);
        // Manejo de la notificación aquí si es necesario
      },
      requestPermissions: true,  // Solicitar permisos automáticamente en iOS, en Android se recomienda hacerlo manualmente si es necesario
    });

    // Crear canal de notificaciones para Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: "default-channel", // Debe ser único
        channelName: "Default channel", // Nombre del canal
        channelDescription: "A default channel for basic notifications", // Descripción del canal
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      });
    }
  }, []);

  const { data, startPolling, stopPolling } = useQuery(GET_LOCATION_DATA, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (data && data.obtenerZonas && data.obtenerZonas.length > 0) {
      const lastLocation = data.obtenerZonas[data.obtenerZonas.length - 1];
      const newLocation = {
        latitude: lastLocation.latitud,
        longitude: lastLocation.longitud,
      };
      setLocationHistory(prev => [...prev, newLocation]);

      if (getDistanceFromLatLonInMeters(newLocation, safeZoneCenter) > safeZoneRadius) {
        PushNotification.localNotification({
          channelId: "default-channel",  // Usar el ID del canal creado
          title: "Alerta de mascota",
          message: "Tu mascota ha salido de la zona segura.",
          playSound: true,
          soundName: "default",
        });
      }
    }
  }, [data]);

  const getDistanceFromLatLonInMeters = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Radio de la tierra en km
    const dLat = deg2rad(loc2.latitude - loc1.latitude);
    const dLon = deg2rad(loc2.longitude - loc1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(loc1.latitude)) * Math.cos(deg2rad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c * 1000; // Distancia en metros
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

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
        style={{flex: 1}}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
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
          center={safeZoneCenter}
          radius={safeZoneRadius}
          fillColor="rgba(255, 0, 0, 0.3)"
          strokeColor="red"
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
      />
    </>
  );
};

export default Map;
