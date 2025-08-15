import express from 'express';
import { connectToDatabase } from '../lib/database.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/** GET /books  
    Fetch all books, or filter by title/author
*/
router.get('/', async (req, res) => {
  const search = req.query.search?.trim();
  try {
    const db = await connectToDatabase();
    let sql = `
      SELECT 
        b.*,
        c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
    `;
    const params = [];

    if (search) {
      sql += ` WHERE b.title LIKE ? OR b.author LIKE ? OR c.name LIKE ?`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [books] = await db.query(sql, params);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /books 
    Create a new book
*/
router.post('/', verifyToken, async (req, res) => {
  const { title, author, desc, cover, price, category_id } = req.body;
  if (!title || !author || !desc || !cover || price == null || !category_id) {
    return res.status(400).json({ error: 'All fields are required, including category_id' });
  }

  try {
    const db = await connectToDatabase();
    await db.query(
      'INSERT INTO books (`title`, `author`, `desc`, `cover`, `price`, `category_id`) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, desc, cover, price, category_id]
    );
    res.status(201).json({ message: 'Book created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** DELETE /books/:id
    Remove a book by its id 
*/ 
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** PUT /books/:id
    Update a book by its id 
*/ 
router.put('/:id', verifyToken, async (req, res) => {
  const { title, author, desc, cover, price, category_id } = req.body;
  if (!title || !author || !desc || !cover || price == null || !category_id) {
    return res.status(400).json({ error: 'All fields are required, including category_id' });
  }

  try {
    const db = await connectToDatabase();
    await db.query(
      'UPDATE books SET `title`=?, `author`=?, `desc`=?, `cover`=?, `price`=?, `category_id`=? WHERE id=?',
      [title, author, desc, cover, price, category_id, req.params.id]
    );
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
