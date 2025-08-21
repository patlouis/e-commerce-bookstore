import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    desc: "",
    price: "",
    cover: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://localhost:3000/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanedBook = {
    title: book.title.trim(),
    author: book.author.trim(),
    desc: book.desc.trim(),
    price: book.price.toString().trim(),
    cover: book.cover.trim(),
    category_id: book.category_id,
  };

  if (
    !cleanedBook.title ||
    !cleanedBook.author ||
    !cleanedBook.desc ||
    !cleanedBook.price ||
    !cleanedBook.cover ||
    !cleanedBook.category_id
  ) {
    setError("Please fill in all fields properly (no empty or whitespace-only).");
    return;
  }

  const priceNum = parseFloat(cleanedBook.price);
  if (isNaN(priceNum) || priceNum < 0) {
    setError("Price must be a valid number and cannot be negative.");
    return;
  }

  const finalBook = { ...cleanedBook, price: priceNum };

  try {
    await axios.post("http://localhost:3000/books", finalBook, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    navigate(-1);
  } catch (err) {
    console.error(err);
    setError("Something went wrong while creating the book.");
  }
};

  const inputClass =
    "w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md flex flex-col items-center gap-4 mt-10 mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Create a New Book</h1>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        {book.cover && (
          <img
            src={book.cover}
            alt="Cover Preview"
            className="w-[180px] h-[270px] object-cover rounded-md shadow-md mt-2"
          />
        )}

        <input
          type="text"
          placeholder="Title"
          className={inputClass}
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          className={inputClass}
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className={`${inputClass} resize-none h-24`}
          value={book.desc}
          onChange={(e) => setBook({ ...book, desc: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className={inputClass}
          value={book.price}
          onChange={(e) => setBook({ ...book, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          className={inputClass}
          value={book.cover}
          onChange={(e) => setBook({ ...book, cover: e.target.value })}
        />

        {/* Category Dropdown */}
        {loadingCategories ? (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading categories...</span>
          </div>
        ) : (
          <select
            value={book.category_id}
            onChange={(e) => setBook({ ...book, category_id: e.target.value })}
            className={`${inputClass} cursor-pointer`}
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
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 mt-3 rounded-lg text-sm hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer"
        >
          Create Book
        </button>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default Create;
