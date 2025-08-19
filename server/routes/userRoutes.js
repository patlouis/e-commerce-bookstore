import express from 'express';
import { connectToDatabase } from '../lib/database.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import roles from '../config/roles.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Get all users (protected, maybe admin only)
router.get('/', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.created_at, 
        u.updated_at,
        r.role AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
    `);
    res.json(users);
  } catch (error) {
    console.error('[Get Users Error]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create new user (protected)
router.post('/', verifyToken, authorizeRoles(roles.ADMIN),async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const db = await connectToDatabase();

    // Check if username already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const [existingEmails] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmails.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('[Create User Error]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Display user's personal information
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email, u.created_at, r.role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password (logged-in user)
router.put('/profile/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }

  // Optional: enforce strong password
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPasswordRegex.test(newPassword)) {
    return res.status(400).json({ message: 'New password must be strong (8+ chars, uppercase, lowercase, number, special).' });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // Check current password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[Change Password Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single user by id (protected)
router.get('/:id', verifyToken, authorizeRoles(roles.ADMIN),async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await connectToDatabase();
    const [users] = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error('[Get User Error]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update user by id (protected)
router.put('/:id', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    const db = await connectToDatabase();

    // Optional: Validate input here (e.g. check email format)

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateQuery = `
      UPDATE users 
      SET username = ?, email = ? ${password ? ', password = ?' : ''} 
      WHERE id = ?
    `;

    const params = password
      ? [username, email, hashedPassword, userId]
      : [username, email, userId];

    const [result] = await db.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('[Update User Error]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete user by id (protected)
router.delete('/:id', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await connectToDatabase();
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('[Delete User Error]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
