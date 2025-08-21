import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3000";

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id: categoryIdParam } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  const { user } = useAuth();

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setErrorBooks(null);

        const res = await axios.get(`${API_BASE_URL}/books`, {
          params: {
            search,
            category_id: categoryIdParam || undefined,
          },
        });
        setBooks(res.data);
      } catch (error) {
        setErrorBooks("Failed to load books. Please try again later.");
        console.error(error);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, [search, categoryIdParam]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        setErrorCategories("Failed to load categories.");
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Find selected category (so dropdown shows label not just id)
  const selectedCategory = categoryIdParam
    ? categories.find((c) => String(c.id) === String(categoryIdParam))?.id
    : null;

  // Sorting
  const sortedBooks = books.sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    if (sortOrder === "a-z") return a.title.localeCompare(b.title);
    if (sortOrder === "z-a") return b.title.localeCompare(a.title);
    return 0;
  });

  const handleAddToCart = async (book_id) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { book_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-16 flex flex-col items-center bg-[#f9f9f9] font-sans">
        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full max-w-[1300px] justify-start">
          <div className="w-60">
            <Dropdown
              options={[
                { value: null, label: "All Categories" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              selected={selectedCategory}
              setSelected={(val) => navigate(val ? `/category/${val}` : "/")}
              placeholder="Select Category"
            />
          </div>
          <div className="w-61">
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
          <p>Loading books...</p>
        ) : errorBooks ? (
          <p className="text-red-600">{errorBooks}</p>
        ) : sortedBooks.length === 0 ? (
          <p className="flex items-center justify-center py-10 text-gray-600">
            No books found{search ? ` for "${search}"` : ""}.
          </p>
        ) : (
          <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
            {sortedBooks.map((book) => (
              <article
                key={book.id}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform"
              >
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md bg-gray-300 self-center"
                />
                <h2 className="text-base font-semibold mt-4">{book.title}</h2>
                <p className="text-xs mt-1 text-gray-600">{book.author}</p>
                <p className="text-base font-medium mt-1.5">₱{book.price}</p>
                <button
                  onClick={() => handleAddToCart(book.id)}
                  className="w-full bg-gray-600 text-white text-sm mt-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
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
