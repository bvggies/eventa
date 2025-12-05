import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { VIBE_RATINGS } from '../constants';
import { vibeApi } from '../services/api';

interface VibeMeterProps {
  eventId: string;
  currentRating?: string;
  onRatingSubmit?: () => void;
}

export const VibeMeter: React.FC<VibeMeterProps> = ({
  eventId,
  currentRating,
  onRatingSubmit,
}) => {
  const [selectedRating, setSelectedRating] = useState<string | null>(currentRating || null);
  const [submitting, setSubmitting] = useState(false);

  const handleRating = async (rating: string) => {
    if (submitting) return;
    
    setSelectedRating(rating);
    setSubmitting(true);
    
    try {
      await vibeApi.rate(eventId, rating as any);
      onRatingSubmit?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate the Vibe</Text>
      <Text style={styles.subtitle}>How was the event?</Text>
      
      <View style={styles.ratingsContainer}>
        {VIBE_RATINGS.map((rating) => {
          const isSelected = selectedRating === rating.id;
          return (
            <TouchableOpacity
              key={rating.id}
              style={[
                styles.ratingButton,
                isSelected && styles.ratingButtonSelected,
              ]}
              onPress={() => handleRating(rating.id)}
              disabled={submitting}
            >
              <Text style={styles.ratingEmoji}>{rating.emoji}</Text>
              <Text
                style={[
                  styles.ratingLabel,
                  isSelected && styles.ratingLabelSelected,
                ]}
              >
                {rating.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1724',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 16,
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ratingButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#0B0F12',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED20',
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  ratingLabelSelected: {
    color: '#7C3AED',
  },
});

