import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Categories from "../components/Categories";

// Custom hook to fetch data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(url);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error fetching data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true; // cancel fetch on unmount
    };
  }, [url]);

  return { data, loading, error };
}

function Books() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const { data: books, loading: loadingBooks, error: errorBooks } = useFetch(`${API_BASE_URL}/books`);
  const { data: categories, loading: loadingCategories, error: errorCategories } = useFetch(`${API_BASE_URL}/categories`);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Combined loading & error
  const loading = loadingBooks || loadingCategories;
  const error = errorBooks || errorCategories;

  // Memoize filtered books
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    if (selectedCategory === null) return books;
    return books.filter((book) => Number(book.category_id) === Number(selectedCategory));
  }, [books, selectedCategory]);

  // Category name
  const selectedCategoryName = useMemo(() => {
    if (!categories) return "Our Collection";
    if (selectedCategory === null) return "Our Collection";
    return categories.find((cat) => Number(cat.id) === Number(selectedCategory))?.name || "";
  }, [categories, selectedCategory]);

  const handleDelete = async (id) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistically update UI
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch {
      alert("Failed to delete book. Please try again.");
    }
  };

  const handleAddToCart = () => {
    alert("Please log in to add books to your cart.");
    navigate("/login");
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full px-10 py-16 flex flex-col items-center bg-[#f9f9f9] font-sans">
        <h1 className="text-3xl font-bold mb-6 max-w-[1300px] w-full" tabIndex={0}>
          {selectedCategoryName}
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {filteredBooks.length === 0 ? (
              <p>No books found in this category.</p>
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
                      {token ? (
                        <>
                          <Link to={`/update/${book.id}`} className="w-full">
                            <button
                              className="w-full bg-[#e6f0ff] text-[#0047ab] text-sm mt-3 py-2 rounded-md hover:bg-[#cce0ff] transition-colors cursor-pointer"
                              aria-label={`Update book ${book.title}`}
                            >
                              Update
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="w-full bg-[#ffe5e5] text-[#cc0000] text-sm mt-2 py-2 rounded-md hover:bg-[#ffcccc] transition-colors cursor-pointer"
                            aria-label={`Delete book ${book.title}`}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          className="w-full bg-orange-600 text-white text-sm mt-3 py-2 rounded-md hover:bg-orange-800 transition-colors cursor-pointer"
                          aria-label="Add book to cart (login required)"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Books;
