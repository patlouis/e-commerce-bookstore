import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
})

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// BOOKS API ENDPOINTS
// View all books
app.get('/books', (req, res) => {
    const QUERY = 'SELECT * FROM books';
    db.query(QUERY, (err, results) => {
        if (err) res.json(err)
        return res.json(results);
    })
});

//Create a new book
app.post('/books', (req, res) => {
    const QUERY = 'INSERT INTO books (title, desc, cover, price) VALUES (?)';
    const values = [
        req.body.title,
        req.body.desc,
        req.body.cover,
        req.body.price
    ]
    db.query(QUERY, [values], (err, results) => {
        if(err) return res.json(err);
        return res.json('Book has been created successfully');
    })
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const QUERY = 'DELETE FROM books WHERE id = ?';
    const booksId = req.params.id;
    db.query(QUERY, [booksId], (err, results) => {
        if(err) return res.json(err);
        return res.json('Book has been deleted successfully');
    })
});

// Update a book
app.put('/books/:id', (req, res) => {
    const QUERY = 'UPDATE books SET title = ?, desc = ?, cover = ?, price = ? WHERE id = ?';
    const booksId = req.params.id;
        const values = [
        req.body.title,
        req.body.desc,
        req.body.cover,
        req.body.price
    ]
    db.query(QUERY, [...values, booksId], (err, results) => {
        if(err) return res.json(err);
        return res.json('Book has been deleted successfully');
    })
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});   