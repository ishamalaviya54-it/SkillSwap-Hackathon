import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase();
    const [existingUsers] = await query('SELECT id FROM users WHERE email = ?', [cleanEmail]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await query(
      'INSERT INTO users (name, email, password_hash, college, bio) VALUES (?, ?, ?, ?, ?)',
      [name, cleanEmail, passwordHash, college || '', bio || '']
    );

    const token = jwt.sign(
      { id: result.insertId, email: cleanEmail },
      process.env.JWT_SECRET || 'skillswap-secret-key',
      { expiresIn: '7d' }
    );

    const [newUser] = await query(
      'SELECT id, name, email, college, bio, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      token,
      user: newUser[0],
    });
  } catch (error) {
    console.error('Register failed:', error);
    return res.status(500).json({ message: 'Server error while registering user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'skillswap-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Server error while logging in.' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await query(
      'SELECT id, name, email, college, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    console.error('Profile fetch failed:', error);
    return res.status(500).json({ message: 'Server error while fetching profile.' });
  }
});

export default router;
