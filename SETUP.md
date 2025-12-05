# Eventa Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/eventa
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 2. Mobile App Setup

```bash
cd mobile
npm install
```

Start Expo:
```bash
npm start
```

### 3. Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
```

Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the admin dashboard:
```bash
npm start
```

## Database Setup

Your Neon PostgreSQL database is already configured! 

1. The connection string is set in `backend/.env`
2. The tables will be created automatically when the backend starts
3. No additional setup needed - just start the backend server

**Note:** The database connection uses SSL (required by Neon) and is already configured.

## Testing the App

### Mobile App
1. Install Expo Go on your phone
2. Scan the QR code from the terminal
3. Or press `a` for Android emulator / `i` for iOS simulator

### Admin Dashboard
1. Open http://localhost:3000
2. Login with your credentials (register first via API or create user in database)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/featured` - Get featured events
- `GET /api/events/trending` - Get trending events
- `GET /api/events/nearby` - Get nearby events
- `POST /api/events` - Create event (auth required)
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Delete event (auth required)

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/saved-events` - Get saved events (auth required)
- `POST /api/users/saved-events/:eventId` - Save event (auth required)
- `DELETE /api/users/saved-events/:eventId` - Unsave event (auth required)

### RSVP
- `POST /api/rsvp` - RSVP to event (auth required)
- `GET /api/rsvp` - Get my RSVPs (auth required)
- `DELETE /api/rsvp/:eventId` - Cancel RSVP (auth required)

### Tickets
- `POST /api/tickets` - Buy ticket (auth required)
- `GET /api/tickets` - Get my tickets (auth required)
- `GET /api/tickets/:id` - Get ticket by ID (auth required)

### Vibe Ratings
- `POST /api/vibe` - Rate event (auth required)
- `GET /api/vibe/event/:eventId` - Get event ratings

## Troubleshooting

### Backend Issues
- Make sure PostgreSQL is running
- Check database connection string
- Verify JWT_SECRET is set

### Mobile App Issues
- Clear Expo cache: `expo start -c`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Check API URL in `src/constants/index.ts`

### Admin Dashboard Issues
- Check API URL in `.env`
- Verify backend is running
- Check browser console for errors

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a production database (Neon, Supabase, etc.)
3. Set a strong `JWT_SECRET`
4. Deploy to Heroku, Railway, or similar

### Mobile App
1. Build with EAS: `eas build`
2. Submit to app stores

### Admin Dashboard
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or similar

