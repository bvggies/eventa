import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { EventCard } from '../components/EventCard';
import { FilterModal, FilterState } from '../components/FilterModal';
import { SearchAutocomplete } from '../components/SearchAutocomplete';
import { eventsApi } from '../services/api';
import { Event } from '../types';
import { EVENT_CATEGORIES, GHANA_CITIES } from '../constants';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Accra');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadEvents();
    loadFeaturedEvents();
  }, [selectedCategory, selectedCity, searchQuery]);

  const loadEvents = async () => {
    try {
      const response = await eventsApi.getAll({
        category: selectedCategory || undefined,
        city: selectedCity,
        search: searchQuery || undefined,
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadFeaturedEvents = async () => {
    try {
      const response = await eventsApi.getFeatured();
      setFeaturedEvents(response.data);
    } catch (error) {
      console.error('Error loading featured events:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Discover Events</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search events...</Text>
        </TouchableOpacity>

        <View style={styles.citySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {GHANA_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityChip,
                  selectedCity === city && styles.cityChipActive,
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  style={[
                    styles.cityChipText,
                    selectedCity === city && styles.cityChipTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {featuredEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Featured Events</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {featuredEvents.map((event) => (
                <View key={event.id} style={styles.featuredCard}>
                  <EventCard
                    event={event}
                    onPress={() => navigation.navigate('EventDetail' as never, { eventId: event.id } as never)}
                    onSave={() => {}}
                    onRSVP={() => {}}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Events</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory('')}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  !selectedCategory && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {EVENT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive,
                  ]}
                >
                  {category.icon} {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.eventsList}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => navigation.navigate('EventDetail' as never, { eventId: event.id } as never)}
                onSave={() => {}}
                onRSVP={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setSelectedCategory(newFilters.categories[0] || '');
          setSelectedCity(newFilters.cities[0] || 'Accra');
          setSearchQuery(newFilters.search);
        }}
        initialFilters={filters || undefined}
      />

      {showSearch && (
        <Modal
          visible={showSearch}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSearch(false)}
        >
          <View style={styles.searchModalContainer}>
            <View style={styles.searchModalContent}>
              <View style={styles.searchModalHeader}>
                <Text style={styles.searchModalTitle}>Search Events</Text>
                <TouchableOpacity onPress={() => setShowSearch(false)}>
                  <Text style={styles.searchModalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <SearchAutocomplete
                onSelect={(event) => {
                  navigation.navigate('EventDetail' as never, { eventId: event.id } as never);
                  setShowSearch(false);
                }}
                onClose={() => setShowSearch(false)}
              />
            </View>
          </View>
        </Modal>
      )}
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
    backgroundColor: '#0B0F12',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F1724',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1724',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#A3A3A3',
    fontSize: 16,
    marginLeft: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  searchModalContent: {
    backgroundColor: '#0B0F12',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchModalClose: {
    fontSize: 24,
    color: '#A3A3A3',
    fontWeight: '300',
  },
  citySelector: {
    marginBottom: 8,
  },
  cityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0F1724',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cityChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  cityChipText: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '500',
  },
  cityChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  featuredCard: {
    marginRight: 16,
  },
  categoriesScroll: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0F1724',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryChipText: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: 16,
  },
});

