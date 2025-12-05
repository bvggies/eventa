import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { eventsApi } from '../services/api';
import { Event } from '../types';
import { formatDateTime } from '../utils';

interface SearchAutocompleteProps {
  onSelect: (event: Event) => void;
  onClose?: () => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      searchEvents();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getAll({ search: query });
      setResults(response.data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (event: Event) => {
    onSelect(event);
    setQuery('');
    setResults([]);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search events..."
        placeholderTextColor="#A3A3A3"
        value={query}
        onChangeText={setQuery}
        autoFocus
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.resultLocation} numberOfLines={1}>
                {item.location} • {formatDateTime(item.date, item.time)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      {query.length > 2 && results.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 12,
    maxHeight: 400,
  },
  input: {
    backgroundColor: '#0B0F12',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultLocation: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A3A3A3',
    fontSize: 14,
  },
});

