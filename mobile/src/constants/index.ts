// Update this to your backend URL
// For Android emulator: http://10.0.2.2:5000/api
// For iOS simulator: http://localhost:5000/api
// For physical device: http://YOUR_COMPUTER_IP:5000/api
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';

export const GHANA_CITIES = [
  'Accra',
  'Kumasi',
  'Tamale',
  'Takoradi',
  'Cape Coast',
  'Tema',
  'Sunyani',
  'Ho',
  'Koforidua',
  'Techiman',
];

export const EVENT_CATEGORIES = [
  { id: 'Party', label: '🎉 Parties', icon: '🎉' },
  { id: 'Concert', label: '🎤 Concerts', icon: '🎤' },
  { id: 'Beach', label: '🌊 Beach', icon: '🌊' },
  { id: 'Club', label: '🕺 Clubs', icon: '🕺' },
  { id: 'School', label: '🎓 School', icon: '🎓' },
  { id: 'Church', label: '🙏 Church', icon: '🙏' },
  { id: 'Fair', label: '🛍 Fairs', icon: '🛍' },
  { id: 'Kids', label: '👨‍👩‍👧 Kids', icon: '👨‍👩‍👧' },
  { id: 'Movie', label: '🎬 Movies', icon: '🎬' },
  { id: 'Conference', label: '💼 Conference', icon: '💼' },
  { id: 'Festival', label: '🎪 Festival', icon: '🎪' },
];

export const VIBE_RATINGS = [
  { id: 'lit', label: '🔥 Lit', emoji: '🔥' },
  { id: 'cool', label: '🙂 Cool', emoji: '🙂' },
  { id: 'average', label: '😐 Average', emoji: '😐' },
  { id: 'dead', label: '😴 Dead', emoji: '😴' },
];

export const COLORS = {
  primaryDark: '#0B0F12',
  cardBg: '#0F1724',
  accentPurple: '#7C3AED',
  accentTeal: '#06B6D4',
  accentGold: '#F59E0B',
  textMuted: '#A3A3A3',
  textWhite: '#FFFFFF',
  success: '#10B981',
  danger: '#EF4444',
};

