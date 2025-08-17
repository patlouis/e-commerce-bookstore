import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:3000";

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  // Fetch books (with search)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setErrorBooks(null);
        const res = await axios.get(`${API_BASE_URL}/books`, {
          params: { search },
        });
        setBooks(res.data);
      } catch (error) {
        setErrorBooks("Failed to load books. Please try again later.");
        console.error("Error fetching books:", error);
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
        setErrorCategories(null);
        const res = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        setErrorCategories("Failed to load categories.");
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter books by selected category
  const filteredBooks =
    selectedCategory === null
      ? books
      : books.filter(
          (book) => Number(book.category_id) === Number(selectedCategory)
        );

  const handleAddToCart = (book) => {
    // If not logged in, redirect to login
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add books to your cart.");
      navigate("/login");
      return;
    }

    // TODO: Replace with API call to add to cart
    alert(`Book "${book.title}" added to cart!`);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full px-10 py-16 flex flex-col items-center bg-[#f9f9f9] font-sans">

        {/* Books Grid */}
        {loadingBooks ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : errorBooks ? (
          <p className="text-red-600">{errorBooks}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="flex items-center justify-center py-10 text-gray-600">
            No books found{search ? ` for "${search}"` : ""} in this category.
          </p>
        ) : (
          <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4 items-stretch">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="w-[210px] h-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform"
                tabIndex={0}
                aria-label={`Book: ${book.title} by ${book.author}, price ₱${book.price}`}
              >
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-[180px] h-[270px] object-cover rounded-md bg-gray-300 self-center"
                />
                <h2 className="text-base font-semibold mt-4">{book.title}</h2>
                <p className="text-xs mt-1 text-gray-600">{book.author}</p>
                <p className="text-base font-medium mt-1.5">₱{book.price}</p>

                <div className="flex flex-col mt-auto w-full">
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-[#363A36] text-white text-sm mt-3 py-2 rounded-md hover:bg-orange-900 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
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
