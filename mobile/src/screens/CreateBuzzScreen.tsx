import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { buzzApi, eventsApi } from '../services/api';
import { Event } from '../types';

export const CreateBuzzScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [posting, setPosting] = useState(false);

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex)?.map((tag) => tag.substring(1)) || [];
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something to post');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please login to post');
      navigation.goBack();
      return;
    }

    setPosting(true);
    try {
      await buzzApi.createPost({
        content,
        eventId: selectedEvent?.id,
        hashtags: extractHashtags(content),
      });
      Alert.alert('Success', 'Your post has been shared!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const hashtags = extractHashtags(content);
  const characterCount = content.length;
  const maxCharacters = 280;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={posting || !content.trim()}
          style={[
            styles.postButton,
            (!content.trim() || posting) && styles.postButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.postButtonText,
              (!content.trim() || posting) && styles.postButtonTextDisabled,
            ]}
          >
            {posting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="What's happening? Share your experience..."
            placeholderTextColor="#A3A3A3"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={maxCharacters}
            autoFocus
          />

          <View style={styles.characterCount}>
            <Text
              style={[
                styles.characterCountText,
                characterCount > maxCharacters * 0.9 && styles.characterCountWarning,
              ]}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>

          {hashtags.length > 0 && (
            <View style={styles.hashtagsPreview}>
              <Text style={styles.hashtagsLabel}>Hashtags:</Text>
              <View style={styles.hashtagsList}>
                {hashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtagBadge}>
                    <Text style={styles.hashtagBadgeText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.eventPicker}
            onPress={() => {
              if (events.length === 0) loadEvents();
              setShowEventPicker(!showEventPicker);
            }}
          >
            <Text style={styles.eventPickerIcon}>🎉</Text>
            <Text
              style={[
                styles.eventPickerText,
                selectedEvent && styles.eventPickerTextSelected,
              ]}
            >
              {selectedEvent ? selectedEvent.name : 'Tag an event (optional)'}
            </Text>
            {selectedEvent && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(null);
                }}
              >
                <Text style={styles.removeEvent}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {showEventPicker && (
            <View style={styles.eventsList}>
              {events.slice(0, 5).map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventOption}
                  onPress={() => {
                    setSelectedEvent(event);
                    setShowEventPicker(false);
                  }}
                >
                  <Text style={styles.eventOptionName}>{event.name}</Text>
                  <Text style={styles.eventOptionLocation}>{event.location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <Text style={styles.tipsText}>
              • Use #hashtags to make your post discoverable{'\n'}
              • Tag events to connect with other attendees{'\n'}
              • Share photos and videos from events
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  cancelButton: {
    fontSize: 16,
    color: '#A3A3A3',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
  },
  postButtonDisabled: {
    backgroundColor: '#2A2F36',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  postButtonTextDisabled: {
    color: '#A3A3A3',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  characterCountText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  characterCountWarning: {
    color: '#F59E0B',
  },
  hashtagsPreview: {
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  hashtagsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  hashtagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#7C3AED20',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  hashtagBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  eventPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  eventPickerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  eventPickerText: {
    flex: 1,
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '400',
  },
  eventPickerTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  removeEvent: {
    fontSize: 18,
    color: '#A3A3A3',
    marginLeft: 8,
  },
  eventsList: {
    backgroundColor: '#0F1724',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
    overflow: 'hidden',
  },
  eventOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  eventOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventOptionLocation: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  tips: {
    backgroundColor: '#7C3AED20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#A3A3A3',
    lineHeight: 20,
  },
});

