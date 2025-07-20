import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Create = () => {
  const [book, setBook] = useState({
    title: '',
    desc: '',
    price: '',
    cover: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title || !book.desc || !book.price || !book.cover) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/books', book);
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Something went wrong while creating the book.');
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 mt-10 mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Create a New Book</h1>

      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      {book.cover && (
        <img
          src={book.cover}
          alt="Cover Preview"
          className="w-[180px] h-[270px] object-cover rounded-md bg-gray-300 mt-2"
        />
      )}

      <input
        type="text"
        name="title"
        placeholder="Title"
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setBook({ ...book, title: e.target.value })}
      />
      <input
        type="text"
        name="desc"
        placeholder="Description"
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setBook({ ...book, desc: e.target.value })}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setBook({ ...book, price: e.target.value })}
      />
      <input
        type="text"
        name="cover"
        placeholder="Cover Image URL"
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setBook({ ...book, cover: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 mt-2 rounded-lg text-sm hover:bg-blue-800 transition-colors cursor-pointer"
      >
        Create
      </button>

      <Link
        to="/"
        className="text-sm text-blue-600 hover:underline mt-2"
      >
        ← Back to Books
      </Link>
    </div>
  );
};

export default Create;
