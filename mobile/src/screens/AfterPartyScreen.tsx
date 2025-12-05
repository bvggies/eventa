import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { AfterPartyVenue } from '../types';
import { afterpartyApi } from '../services/api';

const MOCK_VENUES: AfterPartyVenue[] = [
  {
    id: '1',
    name: 'Skybar Lounge',
    type: 'club',
    location: 'Airport City, Accra',
    latitude: 5.6037,
    longitude: -0.1870,
    rating: 4.5,
    distance: 2.3,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  },
  {
    id: '2',
    name: 'Republic Bar & Grill',
    type: 'restaurant',
    location: 'Osu, Accra',
    latitude: 5.5500,
    longitude: -0.1833,
    rating: 4.2,
    distance: 3.1,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  },
  {
    id: '3',
    name: 'Labadi Beach',
    type: 'chill-spot',
    location: 'Labadi, Accra',
    latitude: 5.5833,
    longitude: -0.1167,
    rating: 4.7,
    distance: 5.2,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  },
];

export const AfterPartyScreen: React.FC = () => {
  const route = useRoute();
  const { eventId, eventEndTime } = route.params as { eventId?: string; eventEndTime?: string };
  const [venues, setVenues] = useState<AfterPartyVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      // Default to Accra coordinates
      const response = await afterpartyApi.getNearby(5.6037, -0.1870, 10);
      setVenues(response.data);
    } catch (error) {
      console.error('Error loading venues:', error);
      setVenues(MOCK_VENUES);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (venue: AfterPartyVenue) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
    Linking.openURL(url);
  };

  const getVenueTypeIcon = (type: string) => {
    switch (type) {
      case 'club':
        return '🕺';
      case 'restaurant':
        return '🍽️';
      case 'chill-spot':
        return '🌴';
      default:
        return '📍';
    }
  };

  const getVenueTypeLabel = (type: string) => {
    switch (type) {
      case 'club':
        return 'Club';
      case 'restaurant':
        return 'Restaurant';
      case 'chill-spot':
        return 'Chill Spot';
      default:
        return 'Venue';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>After-Party Spots</Text>
        <Text style={styles.subtitle}>Continue the night at these nearby venues</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading venues...</Text>
          </View>
        ) : venues.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No venues found nearby</Text>
          </View>
        ) : (
          venues.map((venue) => (
          <TouchableOpacity key={venue.id} style={styles.venueCard} activeOpacity={0.9}>
            <Image
              source={{ uri: venue.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800' }}
              style={styles.venueImage}
              resizeMode="cover"
            />
            <View style={styles.venueContent}>
              <View style={styles.venueHeader}>
                <View style={styles.venueInfo}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <View style={styles.venueMeta}>
                    <Text style={styles.venueType}>
                      {getVenueTypeIcon(venue.type)} {getVenueTypeLabel(venue.type)}
                    </Text>
                    <Text style={styles.venueDistance}>📍 {venue.distance} km away</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingIcon}>⭐</Text>
                  <Text style={styles.rating}>{venue.rating}</Text>
                </View>
              </View>
              <Text style={styles.venueLocation}>{venue.location}</Text>
              <View style={styles.venueActions}>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => handleGetDirections(venue)}
                >
                  <Text style={styles.directionsText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookText}>Book Table</Text>
                </TouchableOpacity>
              </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F12',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  venueCard: {
    backgroundColor: '#0F1724',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  venueImage: {
    width: '100%',
    height: 180,
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  venueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueType: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  venueDistance: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  venueLocation: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 12,
  },
  venueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  bookButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#06B6D4',
    alignItems: 'center',
  },
  bookText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#A3A3A3',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A3A3A3',
  },
});

