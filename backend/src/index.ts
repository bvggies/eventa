import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import rsvpRoutes from './routes/rsvp';
import ticketRoutes from './routes/tickets';
import vibeRoutes from './routes/vibe';
import afterpartyRoutes from './routes/afterparty';
import buzzRoutes from './routes/buzz';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/vibe', vibeRoutes);
app.use('/api/afterparty', afterpartyRoutes);
app.use('/api/buzz', buzzRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Eventa API is running' });
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully to Neon');
    client.release();
    
    // Initialize database tables
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`💾 Database: Neon PostgreSQL`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

initializeServer();

export default app;

