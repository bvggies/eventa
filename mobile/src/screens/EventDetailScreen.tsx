import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { eventsApi, usersApi, rsvpApi, ticketsApi } from '../services/api';
import { Event, PaymentData } from '../types';
import { formatDateTime, formatPrice } from '../utils';
import { VibeMeter } from '../components/VibeMeter';
import { PaymentModal } from '../components/PaymentModal';
import { PhotoGallery } from '../components/PhotoGallery';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export const EventDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { eventId } = route.params as { eventId: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [hasRsvped, setHasRsvped] = useState(false);

  useEffect(() => {
    loadEvent();
    checkSavedStatus();
  }, [eventId, user]);

  const loadEvent = async () => {
    try {
      const response = await eventsApi.getById(eventId);
      setEvent(response.data);
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  const checkSavedStatus = async () => {
    if (!user) return;
    try {
      const savedEvents = await usersApi.getSavedEvents();
      setIsSaved(savedEvents.data.some((e: Event) => e.id === eventId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigation.navigate('Auth' as never);
      return;
    }
    try {
      if (isSaved) {
        await usersApi.unsaveEvent(eventId);
      } else {
        await usersApi.saveEvent(eventId);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      navigation.navigate('Auth' as never);
      return;
    }
    try {
      await rsvpApi.rsvp(eventId, 'interested');
      setHasRsvped(true);
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    try {
      const message = `Check out this event: ${event.name}\n${event.location}\n${formatDateTime(event.date, event.time)}`;
      await Share.share({
        message,
        title: event.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWhatsAppShare = () => {
    if (!event) return;
    const message = `Check out this event: ${event.name}\n${event.location}\n${formatDateTime(event.date, event.time)}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('WhatsApp is not installed');
    });
  };

  const handleGetDirections = () => {
    if (!event || !event.latitude || !event.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
    Linking.openURL(url);
  };

  const handlePayment = async (paymentData: PaymentData) => {
    if (!event || !user) return;
    try {
      await ticketsApi.buy({
        eventId: event.id,
        ticketType: 'General',
        quantity: ticketQuantity,
        promoCode: paymentData.promoCode,
        paymentMethod: paymentData.paymentMethod,
      });
      setShowPaymentModal(false);
      navigation.navigate('Tickets' as never);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Failed to purchase ticket');
    }
  };

  const handleAfterParty = () => {
    navigation.navigate('AfterParty' as never, {
      eventId: event?.id,
      eventEndTime: event?.endTime || event?.time,
    } as never);
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.banner || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
            style={styles.banner}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(11, 15, 18, 0.9)']}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareIcon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppShare}>
              <Text style={styles.whatsappIcon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{event.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>
              {formatDateTime(event.date, event.time)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>💰</Text>
            <Text style={styles.metaText}>
              {formatPrice(event.ticketPrice, event.isFree)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <PhotoGallery
            photos={[
              event.banner || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
              'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            ]}
            eventName={event.name}
          />

          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizerCard}>
              <Text style={styles.organizerAvatar}>👤</Text>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{event.organizerName}</Text>
                <Text style={styles.organizerLabel}>Event Organizer</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={handleGetDirections}
          >
            <Text style={styles.directionsIcon}>📍</Text>
            <Text style={styles.directionsText}>Get Directions</Text>
          </TouchableOpacity>

          <VibeMeter
            eventId={event.id}
            currentRating={undefined}
            onRatingSubmit={() => loadEvent()}
          />

          <TouchableOpacity
            style={styles.afterPartyButton}
            onPress={handleAfterParty}
          >
            <Text style={styles.afterPartyIcon}>🎉</Text>
            <Text style={styles.afterPartyText}>Find After-Party Spots</Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.rsvpButton, hasRsvped && styles.rsvpButtonActive]}
              onPress={handleRSVP}
            >
              <Text style={[styles.rsvpText, hasRsvped && styles.rsvpTextActive]}>
                {hasRsvped ? '✓ Interested' : "I'm Interested"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <LinearGradient
                colors={['#7C3AED', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.ticketText}>Buy Tickets</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {event && (
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePayment}
          ticketPrice={event.ticketPrice}
          quantity={ticketQuantity}
          eventName={event.name}
          promoCode={event.promoCode}
          onPromoCodeApply={async (code) => {
            // Validate promo code
            if (code === event.promoCode && event.promoDiscount) {
              return { discount: (event.ticketPrice * event.promoDiscount) / 100 };
            }
            return null;
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F12',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  whatsappButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappIcon: {
    fontSize: 20,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    fontSize: 20,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#0F1724',
    borderWidth: 1,
    borderColor: '#2A2F36',
    marginBottom: 16,
  },
  directionsIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  directionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  afterPartyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#7C3AED20',
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginBottom: 16,
  },
  afterPartyIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  afterPartyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  rsvpButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  rsvpTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  metaText: {
    fontSize: 16,
    color: '#A3A3A3',
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#A3A3A3',
    lineHeight: 24,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 16,
  },
  organizerAvatar: {
    fontSize: 40,
    marginRight: 16,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  organizerLabel: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7C3AED',
    alignItems: 'center',
  },
  rsvpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  ticketButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
});

