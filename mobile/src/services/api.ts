import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Event, User, Ticket, RSVP, VibeRating, BuzzPost, Hashtag } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Token will be added from auth context
  return config;
});

// Events
export const eventsApi = {
  getAll: (params?: { category?: string; city?: string; date?: string; search?: string }) => 
    api.get<Event[]>('/events', { params }),
  
  getById: (id: string) => 
    api.get<Event>(`/events/${id}`),
  
  getFeatured: () => 
    api.get<Event[]>('/events/featured'),
  
  getTrending: () => 
    api.get<Event[]>('/events/trending'),
  
  getNearby: (lat: number, lng: number, radius?: number) => 
    api.get<Event[]>('/events/nearby', { params: { lat, lng, radius } }),
  
  create: (data: Partial<Event>) => 
    api.post<Event>('/events', data),
  
  update: (id: string, data: Partial<Event>) => 
    api.put<Event>(`/events/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/events/${id}`),
};

// Users
export const usersApi = {
  getProfile: () => 
    api.get<User>('/users/profile'),
  
  updateProfile: (data: Partial<User>) => 
    api.put<User>('/users/profile', data),
  
  getSavedEvents: () => 
    api.get<Event[]>('/users/saved-events'),
  
  saveEvent: (eventId: string) => 
    api.post(`/users/saved-events/${eventId}`),
  
  unsaveEvent: (eventId: string) => 
    api.delete(`/users/saved-events/${eventId}`),
};

// RSVP
export const rsvpApi = {
  rsvp: (eventId: string, status: 'interested' | 'going' | 'not-going') => 
    api.post<RSVP>('/rsvp', { eventId, status }),
  
  getMyRsvps: () => 
    api.get<RSVP[]>('/rsvp'),
  
  cancelRsvp: (eventId: string) => 
    api.delete(`/rsvp/${eventId}`),
};

// Tickets
export const ticketsApi = {
  buy: (data: { eventId: string; ticketType: string; quantity: number; promoCode?: string; paymentMethod: string }) => 
    api.post<Ticket>('/tickets', data),
  
  getMyTickets: () => 
    api.get<Ticket[]>('/tickets'),
  
  getTicketById: (id: string) => 
    api.get<Ticket>(`/tickets/${id}`),
};

// Vibe Ratings
export const vibeApi = {
  rate: (eventId: string, rating: 'lit' | 'cool' | 'average' | 'dead', comment?: string) => 
    api.post<VibeRating>('/vibe', { eventId, rating, comment }),
  
  getEventRatings: (eventId: string) => 
    api.get<VibeRating[]>(`/vibe/event/${eventId}`),
};

// Buzz (Social Feed)
export const buzzApi = {
  getAll: () => 
    api.get<BuzzPost[]>('/buzz'),
  
  getById: (id: string) => 
    api.get<BuzzPost>(`/buzz/${id}`),
  
  getByHashtag: (hashtag: string) => 
    api.get<BuzzPost[]>(`/buzz/hashtag/${hashtag}`),
  
  createPost: (data: { content: string; eventId?: string; hashtags: string[]; images?: string[] }) => 
    api.post<BuzzPost>('/buzz', data),
  
  likePost: (postId: string) => 
    api.post(`/buzz/${postId}/like`),
  
  getTrendingHashtags: () => 
    api.get<Hashtag[]>('/buzz/hashtags/trending'),
};

// After Party
export const afterpartyApi = {
  getNearby: (lat: number, lng: number, radius?: number) => 
    api.get('/afterparty/nearby', { params: { lat, lng, radius } }),
};

export default api;
