// /routes/bookRoutes.js
import express from 'express';
import { connectToDatabase } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [books] = await db.query('SELECT * FROM books');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, desc, cover, price } = req.body;
  if (!title || !desc || !cover || price == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = await connectToDatabase();
    await db.query(
      'INSERT INTO books (`title`, `desc`, `cover`, `price`) VALUES (?, ?, ?, ?)',
      [title, desc, cover, price]
    );
    res.status(201).json({ message: 'Book created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, desc, cover, price } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query(
      'UPDATE books SET `title`=?, `desc`=?, `cover`=?, `price`=? WHERE id=?',
      [title, desc, cover, price, req.params.id]
    );
    res.json({ message: 'Book updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
