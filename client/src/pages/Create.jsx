import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    desc: '',
    price: '',
    cover: '',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !book.title ||
      !book.author ||
      !book.desc ||
      !book.price ||
      !book.cover ||
      !book.category_id
    ) {
      setError('Please fill in all fields including category.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/books', book);
      navigate(-1);
    } catch (error) {
      console.error(error);
      setError('Something went wrong while creating the book.');
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 mt-10 mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Create a New Book</h1>

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

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
        name="author"
        placeholder="Author"
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setBook({ ...book, author: e.target.value })}
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

      {/* Category dropdown */}
      <select
        name="category_id"
        value={book.category_id}
        onChange={(e) => setBook({ ...book, category_id: e.target.value })}
        className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 mt-2 rounded-lg text-sm hover:bg-blue-800 transition-colors cursor-pointer"
      >
        Create
      </button>

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mt-2 bg-transparent border-none cursor-pointer"
      >
        ← Go Back
      </button>
    </div>
  );
};

export default Create;
