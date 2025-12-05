export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  category: EventCategory;
  banner: string;
  ticketPrice: number;
  currency: string;
  isFree: boolean;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  views: number;
  likes: number;
  saves: number;
  rsvps: number;
  vibeRating?: number;
  isFeatured: boolean;
  isTrending: boolean;
  promoCode?: string;
  promoDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 
  | 'Party'
  | 'Concert'
  | 'Beach'
  | 'Club'
  | 'School'
  | 'Church'
  | 'Fair'
  | 'Kids'
  | 'Movie'
  | 'Conference'
  | 'Festival';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  isOrganizer: boolean;
  savedEvents: string[];
  rsvpedEvents: string[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketType: string;
  quantity: number;
  price: number;
  total: number;
  promoCode?: string;
  discount?: number;
  paymentMethod: 'momo' | 'vodafone' | 'card' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  qrCode: string;
  createdAt: string;
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'interested' | 'going' | 'not-going';
  createdAt: string;
}

export interface VibeRating {
  id: string;
  eventId: string;
  userId: string;
  rating: 'lit' | 'cool' | 'average' | 'dead';
  comment?: string;
  createdAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isVerified: boolean;
  eventsCount: number;
  rating: number;
  createdAt: string;
}

export interface AfterPartyVenue {
  id: string;
  name: string;
  type: 'club' | 'restaurant' | 'chill-spot';
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  distance: number;
  image?: string;
}

export interface BuzzPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  eventId?: string;
  eventName?: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Hashtag {
  tag: string;
  count: number;
  trending: boolean;
}
