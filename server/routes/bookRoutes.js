import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all books
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add book
router.post('/', (req, res) => {
  const { title, desc, cover, price } = req.body;
  if (!title || !desc || !cover || price == null)
    return res.status(400).json({ error: 'All fields are required' });

  const query = 'INSERT INTO books (`title`, `desc`, `cover`, `price`) VALUES (?, ?, ?, ?)';
  db.query(query, [title, desc, cover, price], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book created' });
  });
});

// Delete book
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book deleted' });
  });
});

// Update book
router.put('/:id', (req, res) => {
  const { title, desc, cover, price } = req.body;
  const query = 'UPDATE books SET `title`=?, `desc`=?, `cover`=?, `price`=? WHERE id=?';
  db.query(query, [title, desc, cover, price, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book updated' });
  });
});

export default router;
