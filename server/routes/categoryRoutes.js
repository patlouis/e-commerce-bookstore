import express from 'express';
import { connectToDatabase } from '../lib/database.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const db = await connectToDatabase();
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const db = await connectToDatabase();
    await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
