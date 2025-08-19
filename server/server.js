import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore API!');
});

app.use('/books', bookRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
