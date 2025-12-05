# Neon Database Setup - Eventa

## ✅ Database Configured

Your Neon PostgreSQL database is now configured and ready to use!

## Connection Details

**Connection String:**
```
postgresql://neondb_owner:npg_vemRUch04xiY@ep-holy-scene-ahmoef41-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

This is already set in:
- `backend/.env.example` (template)
- `backend/src/config/database.ts` (fallback)

## Quick Start

1. **Create `.env` file in backend folder:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Or manually create `.env` with:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://neondb_owner:npg_vemRUch04xiY@ep-holy-scene-ahmoef41-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-secret-key-change-in-production-eventa-2024
   NODE_ENV=development
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Tables will be created automatically!**

## What Happens on Startup

When you start the backend server:
1. ✅ Connects to Neon database
2. ✅ Creates all required tables (if they don't exist)
3. ✅ Server starts on port 5000

## Database Tables

The following tables are created automatically:

- ✅ `users` - User accounts
- ✅ `events` - Event listings  
- ✅ `saved_events` - User saved events
- ✅ `rsvps` - Event RSVPs
- ✅ `tickets` - Purchased tickets
- ✅ `vibe_ratings` - Event vibe ratings
- ✅ `buzz_posts` - Social feed posts
- ✅ `buzz_likes` - Post likes
- ✅ `buzz_comments` - Post comments
- ✅ `buzz_shares` - Post shares

## Direct Database Access

You can connect directly using psql:

```bash
psql 'postgresql://neondb_owner:npg_vemRUch04xiY@ep-holy-scene-ahmoef41-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

Or use any PostgreSQL client with the connection string.

## Verification

After starting the backend, you should see:
```
✅ Database connected successfully to Neon
Database tables initialized successfully
🚀 Server is running on port 5000
📡 API available at http://localhost:5000/api
💾 Database: Neon PostgreSQL
```

## Security Notes

- ✅ SSL is required and configured
- ✅ Connection uses secure channel binding
- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Never commit `.env` file to git

## Troubleshooting

**Connection fails:**
- Check internet connection
- Verify connection string is correct
- Check Neon dashboard for database status

**Tables not created:**
- Check console for error messages
- Verify database permissions
- Tables use `IF NOT EXISTS` - safe to restart

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Test API: Visit `http://localhost:5000/api/health`
3. Start mobile app: `cd mobile && npm start`
4. Start admin dashboard: `cd admin-dashboard && npm start`

Your database is ready! 🎉

