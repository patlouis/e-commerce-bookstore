import express from 'express';
import { connectToDatabase } from '../database.js';
import { verifyToken } from './authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }      

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            message: 'Password must be minimum of 8 characters (include uppercase, lowercase, number, and special character).'
        });
    }

    try {
        const db = await connectToDatabase();
        // Check if email is already registered
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]
        );

        if (rows.length > 0) {
        return res.status(409).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into DB
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]
        );
        return res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error('[Signup Error]', err);
        return res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if(rows.length === 0) {
            return res.status(401).json({ message: 'User does not exist.' });
        }
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password.' });
        }
        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        return res.status(200).json({ token: token });
    } catch(error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
        if(rows.length === 0) {
            return res.status(401).json({ message: 'User does not exist.' });
        }
        return res.status(200).json({ user: rows[0] });
    } catch(error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.userId]
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


export default router;
