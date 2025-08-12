import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    desc: '',
    price: '',
    cover: '',
    category_id: null,
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the book by id
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/books`);
        const selectedBook = res.data.find((b) => b.id === parseInt(id));
        if (selectedBook) {
          setBook(selectedBook);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, [id]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/categories');
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change for all fields including category_id
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: name === 'category_id' ? parseInt(value) : value,
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/books/${id}`, book);
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 mt-10 mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Update Book</h1>

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
          value={book.title}
          placeholder="Title"
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="author"
          value={book.author || ''}
          placeholder="Author"
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="desc"
          value={book.desc}
          placeholder="Description"
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          name="price"
          value={book.price}
          placeholder="Price"
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="cover"
          value={book.cover}
          placeholder="Cover Image URL"
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />

        {/* Category Dropdown */}
        <select
          name="category_id"
          value={book.category_id || ''}
          onChange={handleChange}
          className="w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>
            Select Category
          </option>
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
          Update
        </button>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline mt-2 bg-transparent border-none cursor-pointer"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default Update;
