import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    desc: "",
    price: "",
    cover: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [loadingBook, setLoadingBook] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the book by id
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoadingBook(true);
        const res = await axios.get(`http://localhost:3000/books`);
        const selectedBook = res.data.find((b) => b.id === parseInt(id));
        if (selectedBook) {
          setBook({
            ...selectedBook,
            price: selectedBook.price.toString(), // keep as string for input
          });
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load book details.");
      } finally {
        setLoadingBook(false);
      }
    };
    fetchBook();
  }, [id]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://localhost:3000/categories");
        setCategories(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]:
        name === "category_id"
          ? value
          : value, // keep everything as string until submit
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim & clean
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
      setError("Price must be a valid non-negative number.");
      return;
    }

    const finalBook = { ...cleanedBook, price: priceNum };

    try {
      await axios.put(`http://localhost:3000/books/${id}`, finalBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate(-1);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while updating the book.");
    }
  };

  if (loadingBook || loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass =
    "w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 mt-10 mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Update Book</h1>

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
          value={book.title}
          placeholder="Title"
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="author"
          value={book.author}
          placeholder="Author"
          onChange={handleChange}
          className={inputClass}
        />
        <textarea
          name="desc"
          value={book.desc}
          placeholder="Description"
          onChange={handleChange}
          className={`${inputClass} resize-none h-24`}
        />
        <input
          type="number"
          name="price"
          value={book.price}
          placeholder="Price"
          min="0"
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="cover"
          value={book.cover}
          placeholder="Cover Image URL"
          onChange={handleChange}
          className={inputClass}
        />

        <select
          name="category_id"
          value={book.category_id || ""}
          onChange={handleChange}
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

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 mt-2 rounded-lg text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
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
