import express from 'express';
import { query } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query(
      `SELECT s.*, u.name AS user_name, u.college, u.email
       FROM skills s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error('Fetch skills failed:', error);
    return res.status(500).json({ message: 'Server error while fetching skills.' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Skill name and category are required.' });
    }

    const [result] = await query(
      'INSERT INTO skills (user_id, name, category, description) VALUES (?, ?, ?, ?)',
      [req.user.id, name, category, description || '']
    );

    return res.status(201).json({
      id: result.insertId,
      user_id: req.user.id,
      name,
      category,
      description: description || '',
    });
  } catch (error) {
    console.error('Create skill failed:', error);
    return res.status(500).json({ message: 'Server error while creating skill.' });
  }
});

export default router;
