import express from 'express';
import { connectToDatabase } from '../lib/database.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import roles from '../config/roles.js';

const router = express.Router();

/** GET /books  
    Fetch all books, or filter by title/author
*/
router.get('/', async (req, res) => {
  const search = req.query.search?.trim();
  const category_id = req.query.category_id;
  try {
    const db = await connectToDatabase();
    let sql = `
      SELECT 
        b.*,
        c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (b.title LIKE ? OR b.author LIKE ? OR c.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category_id) {
      sql += ` AND b.category_id = ?`;
      params.push(category_id);
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
router.post('/', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
  let { title, author, desc, cover, price, category_id } = req.body;

  // Trim strings
  title = title?.trim();
  author = author?.trim();
  desc = desc?.trim();
  cover = cover?.trim();

  if (!title || !author || !desc || !cover || price == null || !category_id) {
    return res.status(400).json({ error: 'All fields are required, including category_id' });
  }

  price = parseFloat(price);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'Price must be a valid non-negative number' });
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
router.delete('/:id', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
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
router.put('/:id', verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
  let { title, author, desc, cover, price, category_id } = req.body;

  // Trim strings
  title = title?.trim();
  author = author?.trim();
  desc = desc?.trim();
  cover = cover?.trim();

  if (!title || !author || !desc || !cover || price == null || !category_id) {
    return res.status(400).json({ error: 'All fields are required, including category_id' });
  }

  price = parseFloat(price);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'Price must be a valid non-negative number' });
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
