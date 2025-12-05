import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { eventsApi } from '../services/api';
import { Event } from '../types';

export const MapScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [region, setRegion] = useState({
    latitude: 5.6037, // Accra coordinates
    longitude: -0.1870,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsApi.getNearby(
        region.latitude,
        region.longitude
      );
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude || region.latitude,
              longitude: event.longitude || region.longitude,
            }}
            title={event.name}
            description={event.location}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F12',
  },
  map: {
    flex: 1,
  },
});

