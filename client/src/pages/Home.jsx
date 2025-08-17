import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";

const API_BASE_URL = "http://localhost:3000";

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setErrorBooks(null);
        const res = await axios.get(`${API_BASE_URL}/books`, { params: { search } });
        setBooks(res.data);
      } catch (err) {
        setErrorBooks("Failed to load books");
        console.error(err);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, [search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        setErrorCategories("Failed to load categories");
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Filtered & sorted books
  const filteredBooks = books
    .filter(book => selectedCategory === null || Number(book.category_id) === Number(selectedCategory))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      if (sortOrder === "a-z") return a.title.localeCompare(b.title);
      if (sortOrder === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const handleAddToCart = (book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add books to your cart.");
      navigate("/login");
      return;
    }
    alert(`Book "${book.title}" added to cart!`);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-16 flex flex-col items-center bg-[#f9f9f9] dark:bg-gray-900 font-sans">

{/* Filters */}
<div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-[1300px]">
  {/* Category Dropdown */}
  <div className="w-full sm:w-1/5">
    <Dropdown
      options={[{ value: null, label: "All Categories" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
      selected={selectedCategory}
      setSelected={setSelectedCategory}
      placeholder="Select Category"
    />
  </div>

  {/* Sort Dropdown */}
  <div className="w-full sm:w-1/5">
    <Dropdown
      options={[
        { value: "", label: "Sort by" },
        { value: "asc", label: "Price: Low → High" },
        { value: "desc", label: "Price: High → Low" },
        { value: "a-z", label: "Title: A → Z" },
        { value: "z-a", label: "Title: Z → A" },
      ]}
      selected={sortOrder}
      setSelected={setSortOrder}
      placeholder="Sort by"
    />
  </div>
</div>



        {/* Books Grid */}
        {loadingBooks ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : errorBooks ? (
          <p className="text-red-600 dark:text-red-400">{errorBooks}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="flex items-center justify-center py-10 text-gray-600 dark:text-gray-300">
            No books found{search ? ` for "${search}"` : ""}.
          </p>
        ) : (
          <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
            {filteredBooks.map(book => (
              <article
                key={book.id}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform"
                tabIndex={0}
              >
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md bg-gray-300 dark:bg-gray-600 self-center"
                />
                <h2 className="text-base font-semibold mt-4 text-gray-900 dark:text-white">{book.title}</h2>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{book.author}</p>
                <p className="text-base font-medium mt-1.5 text-gray-900 dark:text-white">₱{book.price}</p>
                <button
                  onClick={() => handleAddToCart(book)}
                  className="w-full bg-[#363A36] dark:bg-gray-700 text-white text-sm mt-3 py-2 rounded-md hover:bg-orange-900 dark:hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Home;
