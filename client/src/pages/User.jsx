import { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/books');
        setBooks(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen px-10 py-16 flex flex-col items-center text-center bg-[#f9f9f9] font-sans rounded-xl">
      <h1 className="text-3xl font-semibold mb-8">Patrick's Bookstore</h1>

      <div className="flex flex-wrap gap-5 justify-center">
        {books.map((book) => (
          <div
            className="w-[220px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:-translate-y-1 transition-transform"
            key={book.id}
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-[180px] h-[270px] object-cover rounded-md bg-gray-300"
            />
            <h2 className="text-lg font-semibold mt-4">{book.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{book.desc}</p>
            <p className="text-base font-medium mt-1 text-green-700">₱{book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default User;
