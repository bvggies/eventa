# Eventa - Ghana Events & Parties Explorer App

A comprehensive mobile and web application for discovering and managing events across Ghana. Built with Expo (React Native), React, Node.js, and Neon PostgreSQL.

![Eventa Logo](assets/eventa-app-icon.png)

## 🚀 Features

### Mobile App (Expo)
- **Event Discovery**: Browse parties, concerts, beach events, church programs, festivals, and more
- **🔥 Buzz Feed**: Social feed where users share event experiences with hashtags
- **Map View**: See events happening around you with Google Maps integration
- **Calendar**: Monthly event calendar with timeline view
- **Search & Filters**: Find events by name, location, price, date, and category
- **RSVP & Save**: Mark interest and save events to your personal calendar
- **Ticket Purchase**: Buy tickets with Mobile Money integration (MTN MoMo, Vodafone Cash)
- **Vibe Meter**: Rate events (Lit, Cool, Average, Dead)
- **After-Party Finder**: Discover nearby venues after events
- **QR Code Scanner**: Scan and validate tickets
- **Beautiful UI**: Dark mode with neon accents, glassy navigation effects, and smooth animations

### Admin Dashboard (React Web)
- **Event Management**: Create, edit, and delete events
- **Analytics**: View event statistics, views, RSVPs, and ticket sales with charts
- **Attendee Management**: View and export attendee lists
- **Ticket Sales**: Track revenue and sales metrics
- **Organizer Tools**: Manage your events and track performance

## 📁 Project Structure

```
eventa-app/
├── mobile/                 # Expo React Native app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # Navigation setup
│   │   ├── services/      # API services
│   │   ├── context/       # React context (Auth)
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── assets/            # Images and icons
├── admin-dashboard/        # React web admin panel
│   └── src/
│       ├── pages/         # Admin pages
│       ├── components/    # Reusable components
│       └── services/      # API services
└── backend/               # Node.js + Express + Neon PostgreSQL API
    └── src/
        ├── routes/        # API routes
        ├── controllers/   # Route controllers
        ├── middleware/    # Auth middleware
        └── config/        # Database config
```

## 🛠️ Tech Stack

### Mobile
- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **NativeWind** - Tailwind CSS for React Native
- **React Native Maps** - Map integration
- **React Native Reanimated** - Animations
- **Expo Blur** - Glassy effects
- **Expo Camera** - QR code scanning
- **Axios** - HTTP client

### Admin Dashboard
- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Neon PostgreSQL** - Database (cloud)
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Neon PostgreSQL account (already configured)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_vemRUch04xiY@ep-holy-scene-ahmoef41-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-secret-key-change-in-production-eventa-2024
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` and automatically create all database tables.

### 2. Mobile App Setup

```bash
cd mobile
npm install
```

Start Expo:
```bash
npm start
```

Scan QR code with Expo Go app or press `a` for Android / `i` for iOS simulator.

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

The admin dashboard will run on `http://localhost:3000`

## 🗄️ Database

The app uses **Neon PostgreSQL** (cloud database). The connection is already configured.

- Tables are created automatically on backend startup
- SSL connection required (already configured)
- See [NEON_SETUP.md](./NEON_SETUP.md) for details

## 🎨 UI Design

The app features a modern dark mode design with:
- **Primary Dark**: `#0B0F12`
- **Card Background**: `#0F1724`
- **Accent Purple**: `#7C3AED`
- **Accent Teal**: `#06B6D4`
- **Accent Gold**: `#F59E0B`

## 📱 Key Screens

### Mobile App
1. **Welcome Screen** - Animated splash with liquid/blob effects
2. **Home Feed** - Featured events, categories, and event listings
3. **🔥 Buzz** - Social feed with posts and trending hashtags
4. **Map View** - Interactive map with event markers
5. **Calendar** - Monthly calendar with event timeline
6. **Event Details** - Full event information, RSVP, and ticket purchase
7. **Tickets** - User's purchased tickets with QR codes
8. **Profile** - User profile and settings

### Admin Dashboard
1. **Login** - Authentication
2. **Dashboard** - Overview statistics with charts
3. **Events** - Event management
4. **Attendees** - View and manage event attendees
5. **Ticket Sales** - Sales analytics and reports
6. **Analytics** - Event analytics and insights

## 🔐 Authentication

The app uses JWT-based authentication. Users can:
- Register with email and password
- Login to access features
- Organizers can create and manage events

## 💳 Payment Integration

The app supports multiple payment methods:
- MTN Mobile Money
- Vodafone Cash
- Card payments (Stripe)
- Pay on arrival

## 🚀 Deployment

### Admin Dashboard (Vercel)

The admin dashboard is configured for deployment on Vercel with GitHub integration.

1. **Push to GitHub**: Push your code to this repository
2. **Connect to Vercel**: Import the repository in Vercel dashboard
3. **Configure Environment Variables**: Set `REACT_APP_API_URL` in Vercel
4. **Deploy**: Vercel will automatically deploy on every push

See [admin-dashboard/DEPLOYMENT.md](./admin-dashboard/DEPLOYMENT.md) for detailed instructions.

### Backend (Production)

Deploy the backend to:
- Railway
- Heroku
- DigitalOcean
- AWS
- Or any Node.js hosting service

Update the `DATABASE_URL` and `JWT_SECRET` for production.

### Mobile App (Production)

Build and deploy using:
- EAS Build for Expo
- Submit to App Store and Google Play Store

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Database Setup](./NEON_SETUP.md) - Neon database configuration
- [Deployment Guide](./admin-dashboard/DEPLOYMENT.md) - Admin dashboard deployment
- [Features List](./FEATURES.md) - Complete features documentation

## 🤝 Contributing

This is a private project. For issues or suggestions, please contact the development team.

## 📝 License

This project is private and proprietary.

## 📞 Support

For support, email support@eventa.com or open an issue in the repository.

---

Built with ❤️ for Ghana's event community
