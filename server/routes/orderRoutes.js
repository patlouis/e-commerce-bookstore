import express from 'express';
import { connectToDatabase } from '../lib/database.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Checkout - create an order from the user's cart
 * POST /orders/checkout
 */
router.post('/checkout', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;

  try {
    const db = await connectToDatabase();

    // Find user's cart
    const [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
    if (cartRows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const cart_id = cartRows[0].id;

    // Get all cart items with book prices
    const [cartItems] = await db.query(
      `SELECT ci.book_id, ci.quantity, b.price
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    // Create new order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [user_id, total]
    );
    const order_id = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.book_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id]);

    res.json({ message: 'Order placed successfully.', order_id, total });
  } catch (err) {
    console.error('[Checkout Error]', err);
    res.status(500).json({ message: 'Checkout failed.' });
  }
});

/**
 * Get all orders for the logged-in user
 * GET /orders/my
 */
router.get('/my', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;

  try {
    const db = await connectToDatabase();

    const [orders] = await db.query(
      `SELECT o.id, o.total, o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json({ orders });
  } catch (err) {
    console.error('[My Orders Error]', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

/**
 * Get order details (for a specific order of the logged-in user)
 * GET /orders/:id
 */
router.get('/:id', verifyToken, authorizeRoles(2), async (req, res) => {
  const user_id = req.user.id;
  const order_id = req.params.id;

  try {
    const db = await connectToDatabase();

    // Check order belongs to user
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [order_id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query(
      `SELECT oi.book_id, oi.quantity, oi.price, b.title, b.author, b.cover
       FROM order_items oi
       JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.json({ order, items });
  } catch (err) {
    console.error('[Order Details Error]', err);
    res.status(500).json({ message: 'Failed to fetch order details.' });
  }
});

/**
 * Admin: Get all orders
 * GET /orders
 */
router.get('/', verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const db = await connectToDatabase();

    const [orders] = await db.query(
      `SELECT o.id, o.total, o.created_at, u.username, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    res.json({ orders });
  } catch (err) {
    console.error('[All Orders Error]', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

export default router;
