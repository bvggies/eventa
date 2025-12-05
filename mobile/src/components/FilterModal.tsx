import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { EVENT_CATEGORIES, GHANA_CITIES, VIBE_RATINGS } from '../constants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  categories: string[];
  cities: string[];
  priceRange: { min: number; max: number };
  dateRange: { start: string; end: string };
  vibe: string[];
  search: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      categories: [],
      cities: [],
      priceRange: { min: 0, max: 1000 },
      dateRange: { start: '', end: '' },
      vibe: [],
      search: '',
    }
  );

  const toggleCategory = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const toggleCity = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const toggleVibe = (vibeId: string) => {
    setFilters((prev) => ({
      ...prev,
      vibe: prev.vibe.includes(vibeId)
        ? prev.vibe.filter((id) => id !== vibeId)
        : [...prev.vibe, vibeId],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      cities: [],
      priceRange: { min: 0, max: 1000 },
      dateRange: { start: '', end: '' },
      vibe: [],
      search: '',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Search */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search events..."
                  placeholderTextColor="#A3A3A3"
                  value={filters.search}
                  onChangeText={(text) => setFilters({ ...filters, search: text })}
                />
              </View>

              {/* Categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.chipContainer}>
                  {EVENT_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.chip,
                        filters.categories.includes(category.id) && styles.chipSelected,
                      ]}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.categories.includes(category.id) && styles.chipTextSelected,
                        ]}
                      >
                        {category.icon} {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cities */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.chipContainer}>
                  {GHANA_CITIES.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={[
                        styles.chip,
                        filters.cities.includes(city) && styles.chipSelected,
                      ]}
                      onPress={() => toggleCity(city)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.cities.includes(city) && styles.chipTextSelected,
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Price Range</Text>
                <View style={styles.priceContainer}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    value={filters.priceRange.min.toString()}
                    onChangeText={(text) =>
                      setFilters({
                        ...filters,
                        priceRange: { ...filters.priceRange, min: parseFloat(text) || 0 },
                      })
                    }
                  />
                  <Text style={styles.priceSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    value={filters.priceRange.max.toString()}
                    onChangeText={(text) =>
                      setFilters({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: parseFloat(text) || 1000 },
                      })
                    }
                  />
                </View>
              </View>

              {/* Date Range */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date Range</Text>
                <View style={styles.dateContainer}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Start Date (YYYY-MM-DD)"
                    placeholderTextColor="#A3A3A3"
                    value={filters.dateRange.start}
                    onChangeText={(text) =>
                      setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, start: text },
                      })
                    }
                  />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="End Date (YYYY-MM-DD)"
                    placeholderTextColor="#A3A3A3"
                    value={filters.dateRange.end}
                    onChangeText={(text) =>
                      setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, end: text },
                      })
                    }
                  />
                </View>
              </View>

              {/* Vibe */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vibe</Text>
                <View style={styles.chipContainer}>
                  {VIBE_RATINGS.map((vibe) => (
                    <TouchableOpacity
                      key={vibe.id}
                      style={[
                        styles.chip,
                        filters.vibe.includes(vibe.id) && styles.chipSelected,
                      ]}
                      onPress={() => toggleVibe(vibe.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.vibe.includes(vibe.id) && styles.chipTextSelected,
                        ]}
                      >
                        {vibe.emoji} {vibe.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurContainer: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#0F1724',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#A3A3A3',
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#0B0F12',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0B0F12',
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  chipSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  chipText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#0B0F12',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#A3A3A3',
  },
  dateContainer: {
    gap: 12,
  },
  dateInput: {
    backgroundColor: '#0B0F12',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2F36',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2F36',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

