import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { buzzApi } from '../services/api';
import { BuzzPost, Hashtag } from '../types';
import { formatDate } from '../utils';

export const BuzzScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<Hashtag[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  useEffect(() => {
    loadBuzz();
    loadTrendingHashtags();
  }, [selectedHashtag]);

  const loadBuzz = async () => {
    try {
      const response = selectedHashtag
        ? await buzzApi.getByHashtag(selectedHashtag)
        : await buzzApi.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading buzz:', error);
      // Mock data for demo
      setPosts(MOCK_POSTS);
    }
  };

  const loadTrendingHashtags = async () => {
    try {
      const response = await buzzApi.getTrendingHashtags();
      setTrendingHashtags(response.data);
    } catch (error) {
      console.error('Error loading hashtags:', error);
      setTrendingHashtags(MOCK_HASHTAGS);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBuzz();
    await loadTrendingHashtags();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    try {
      await buzzApi.likePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  };

  const renderHashtags = (text: string) => {
    const parts = text.split(/(#[\w]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text
            key={index}
            style={styles.hashtag}
            onPress={() => setSelectedHashtag(part.substring(1))}
          >
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Buzz</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateBuzz' as never)}
        >
          <Text style={styles.createButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Hashtags */}
        {trendingHashtags.length > 0 && (
          <View style={styles.hashtagsSection}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trendingHashtags.map((hashtag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.hashtagChip,
                    selectedHashtag === hashtag.tag && styles.hashtagChipActive,
                  ]}
                  onPress={() =>
                    setSelectedHashtag(selectedHashtag === hashtag.tag ? null : hashtag.tag)
                  }
                >
                  <Text
                    style={[
                      styles.hashtagChipText,
                      selectedHashtag === hashtag.tag && styles.hashtagChipTextActive,
                    ]}
                  >
                    #{hashtag.tag} ({hashtag.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Posts */}
        {selectedHashtag && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterText}>
              Showing: #{selectedHashtag}
            </Text>
            <TouchableOpacity onPress={() => setSelectedHashtag(null)}>
              <Text style={styles.filterClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {post.userAvatar || post.userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.userName}>{post.userName}</Text>
                  <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
                </View>
              </View>
            </View>

            {post.eventName && (
              <TouchableOpacity
                style={styles.eventTag}
                onPress={() =>
                  post.eventId &&
                  navigation.navigate('EventDetail' as never, { eventId: post.eventId } as never)
                }
              >
                <Text style={styles.eventTagIcon}>🎉</Text>
                <Text style={styles.eventTagText}>{post.eventName}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.postContent}>{renderHashtags(post.content)}</Text>

            {post.images && post.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.images}>
                {post.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Text style={[styles.actionIcon, post.isLiked && styles.actionIconLiked]}>
                  {post.isLiked ? '❤️' : '🤍'}
                </Text>
                <Text style={styles.actionCount}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionCount}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionCount}>{post.shares}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {posts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔥</Text>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share what's happening!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const MOCK_POSTS: BuzzPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Mensah',
    content: 'The vibes at #AfrobeatsBeachParty are absolutely 🔥🔥🔥! Best event of the year! #EventaGhana #PartyVibes',
    hashtags: ['AfrobeatsBeachParty', 'EventaGhana', 'PartyVibes'],
    eventId: '1',
    eventName: 'Afrobeats Beach Party',
    likes: 45,
    comments: 12,
    shares: 8,
    isLiked: false,
    createdAt: new Date().toISOString(),
    images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
  },
  {
    id: '2',
    userId: '2',
    userName: 'Kwame Asante',
    content: 'Just copped tickets to #SummerFestival2024! Who else is going? 🎉 #EventaGhana #SummerVibes',
    hashtags: ['SummerFestival2024', 'EventaGhana', 'SummerVibes'],
    eventId: '2',
    eventName: 'Summer Festival 2024',
    likes: 32,
    comments: 5,
    shares: 3,
    isLiked: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const MOCK_HASHTAGS: Hashtag[] = [
  { tag: 'EventaGhana', count: 1250, trending: true },
  { tag: 'AfrobeatsBeachParty', count: 890, trending: true },
  { tag: 'SummerVibes', count: 650, trending: true },
  { tag: 'AccraNightlife', count: 520, trending: false },
  { tag: 'PartyVibes', count: 480, trending: false },
];

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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  hashtagsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A3A3A3',
    marginBottom: 12,
  },
  hashtagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0F1724',
    borderWidth: 1,
    borderColor: '#2A2F36',
    marginRight: 8,
  },
  hashtagChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  hashtagChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
  },
  hashtagChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7C3AED20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  filterClose: {
    fontSize: 18,
    color: '#7C3AED',
    fontWeight: '300',
  },
  postCard: {
    backgroundColor: '#0F1724',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
    color: '#FFFFFF',
  },
  postTime: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 2,
  },
  eventTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  eventTagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  eventTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  postContent: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
  },
  hashtag: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  images: {
    marginBottom: 12,
  },
  postImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 8,
  },
  postActions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2F36',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  actionIconLiked: {
    fontSize: 20,
  },
  actionCount: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
});

