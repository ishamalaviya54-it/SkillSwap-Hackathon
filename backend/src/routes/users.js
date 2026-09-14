import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query(
      'SELECT id, name, email, college, bio, created_at FROM users ORDER BY created_at DESC'
    );

    const users = [];

    for (const user of rows) {
      const [skills] = await query(
        'SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC',
        [user.id]
      );

      users.push({ ...user, skills });
    }

    return res.json(users);
  } catch (error) {
    console.error('Fetch users failed:', error);
    return res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await query(
      'SELECT id, name, email, college, bio, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const [skills] = await query('SELECT * FROM skills WHERE user_id = ?', [req.params.id]);
    return res.json({ ...rows[0], skills });
  } catch (error) {
    console.error('Fetch one user failed:', error);
    return res.status(500).json({ message: 'Server error while fetching user.' });
  }
});

export default router;
