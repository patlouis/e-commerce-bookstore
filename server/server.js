import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRoutes from './routes/books.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore API!');
});

app.use('/books', booksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
