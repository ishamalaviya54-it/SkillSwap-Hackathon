import express from 'express';
import { query } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all swap requests for the logged-in user.
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await query(
      `SELECT sr.*, requester.name AS requester_name, target.name AS target_name
       FROM swap_requests sr
       JOIN users requester ON requester.id = sr.requester_id
       JOIN users target ON target.id = sr.target_id
       WHERE sr.requester_id = ? OR sr.target_id = ?
       ORDER BY sr.created_at DESC`,
      [req.user.id, req.user.id]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Fetch requests failed:', error);
    return res.status(500).json({ message: 'Server error while fetching requests.' });
  }
});

// Create a new swap request.
router.post('/', verifyToken, async (req, res) => {
  try {
    const { targetId, message } = req.body;

    if (!targetId) {
      return res.status(400).json({ message: 'Please select a person to swap with.' });
    }

    if (Number(targetId) === Number(req.user.id)) {
      return res.status(400).json({ message: 'You cannot request a swap with yourself.' });
    }

    const [result] = await query(
      'INSERT INTO swap_requests (requester_id, target_id, message) VALUES (?, ?, ?)',
      [req.user.id, targetId, message || 'Hi! I would like to swap skills with you.']
    );

    return res.status(201).json({
      id: result.insertId,
      requester_id: req.user.id,
      target_id: Number(targetId),
      message: message || 'Hi! I would like to swap skills with you.',
      status: 'pending',
    });
  } catch (error) {
    console.error('Create request failed:', error);
    return res.status(500).json({ message: 'Server error while sending a swap request.' });
  }
});

// Update request status (accept or reject).
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['accepted', 'rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected.' });
    }

    const [rows] = await query('SELECT * FROM swap_requests WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    const request = rows[0];

    if (request.target_id !== req.user.id) {
      return res.status(403).json({ message: 'You cannot update this request.' });
    }

    await query('UPDATE swap_requests SET status = ? WHERE id = ?', [status, req.params.id]);

    return res.json({ message: `Request ${status}.` });
  } catch (error) {
    console.error('Update request failed:', error);
    return res.status(500).json({ message: 'Server error while updating request.' });
  }
});

export default router;
