import express from 'express';
import { connectToDatabase } from '../lib/database.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Add a book to the user's cart
 * POST /cart/add
 * Body: { book_id }
 */
router.post('/add', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({ message: 'book_id is required.' });
  }

  try {
    const db = await connectToDatabase();

    // Check if user already has a cart
    let [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
    let cart_id;

    if (cartRows.length === 0) {
      // Create a new cart
      const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [user_id]);
      cart_id = result.insertId;
    } else {
      cart_id = cartRows[0].id;
    }

    // Check if the book is already in the cart
    const [existingItems] = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND book_id = ?',
      [cart_id, book_id]
    );

    if (existingItems.length > 0) {
      // Increment quantity
      await db.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND book_id = ?',
        [cart_id, book_id]
      );
    } else {
      // Insert new cart item with default quantity 1
      await db.query(
        'INSERT INTO cart_items (cart_id, book_id, quantity) VALUES (?, ?, 1)',
        [cart_id, book_id]
      );
    }

    res.json({ message: 'Book added to cart successfully.' });
  } catch (err) {
    console.error('[Add to Cart Error]', err);
    res.status(500).json({ message: 'Failed to add book to cart.' });
  }
});

/**
 * Get current user's cart
 * GET /cart
 */
router.get('/', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;
  console.log('User ID from token:', user_id);

  try {
    const db = await connectToDatabase();

    const [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
    console.log('Cart rows:', cartRows);

    if (cartRows.length === 0) return res.json({ cart: [] });

    const cart_id = cartRows[0].id;

    const [items] = await db.query(
      `SELECT ci.id AS cart_item_id, b.id AS book_id, b.title, b.author, b.cover, b.price, ci.quantity
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );
    console.log('Cart items:', items);

    res.json({ cart: items });
  } catch (err) {
    console.error('[Get Cart Error]', err);
    res.status(500).json({ message: 'Failed to fetch cart.' });
  }
});

/**
 * Remove a book from the cart
 * DELETE /cart/:cart_item_id
 */
router.delete('/:cart_item_id', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;
  const cart_item_id = req.params.cart_item_id;

  try {
    const db = await connectToDatabase();

    // Ensure the cart item belongs to the user's cart
    const [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
    if (cartRows.length === 0) return res.status(404).json({ message: 'Cart not found.' });

    const cart_id = cartRows[0].id;

    const [result] = await db.query(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [cart_item_id, cart_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found.' });

    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error('[Remove Cart Item Error]', err);
    res.status(500).json({ message: 'Failed to remove item.' });
  }
});

/**
 * Update quantity of a cart item
 * PUT /cart/:cart_item_id
 * Body: { quantity }
 */
router.put('/:cart_item_id', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;
  const cart_item_id = req.params.cart_item_id;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const db = await connectToDatabase();

    // Ensure the cart item belongs to the user's cart
    const [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
    if (cartRows.length === 0) return res.status(404).json({ message: 'Cart not found.' });

    const cart_id = cartRows[0].id;

    const [result] = await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?',
      [quantity, cart_item_id, cart_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found.' });

    res.json({ message: 'Quantity updated successfully.' });
  } catch (err) {
    console.error('[Update Cart Item Error]', err);
    res.status(500).json({ message: 'Failed to update quantity.' });
  }
});

export default router;
