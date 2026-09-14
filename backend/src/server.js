import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow browser requests from the frontend.
app.use(cors());
app.use(express.json());

// Health check route to confirm the server is alive.
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();

  return res.json({
    status: 'ok',
    dbConnected,
    message: dbConnected ? 'Database connected.' : 'Database not connected yet. Please configure MySQL.',
  });
});

// API routes for login, users, skills, and swap requests.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Skill Swap API running on http://localhost:${PORT}`);
});
