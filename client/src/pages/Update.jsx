import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Update = () => {
  const [book, setBook] = useState({
    title: '',
    desc: '',
    price: '',
    cover: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/books/${id}`, book);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        value={book.author}
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

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 mt-2 rounded-lg text-sm hover:bg-blue-800 transition-colors cursor-pointer"
      >
        Update
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

export default Update;
