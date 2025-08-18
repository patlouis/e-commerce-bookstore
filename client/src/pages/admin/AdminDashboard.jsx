// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Dropdown from "../../components/Dropdown";

const API_BASE_URL = "http://localhost:3000";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [token, setToken] = useState(null);

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  // Get token once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch books
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

  // Filtered & sorted books
  const filteredBooks = books
    .filter(
      (book) =>
        selectedCategory === null ||
        Number(book.category_id) === Number(selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const handleDelete = async (id) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      alert("Failed to delete book. Please try again.");
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-16 flex flex-col items-center bg-[#f9f9f9] font-sans">

      <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full max-w-[1300px] justify-start">
        {/* Category Dropdown */}
        <div className="w-60">
          <Dropdown
            options={[{ value: null, label: "All Categories" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            placeholder="Select Category"
          />
        </div>

        {/* Sort Dropdown */}
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
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : errorBooks ? (
          <p className="text-red-600">{errorBooks}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="flex items-center justify-center py-10 text-gray-600">
            No books found{search ? ` for "${search}"` : ""}.
          </p>
        ) : (
          <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform"
                tabIndex={0}
                aria-label={`Book: ${book.title} by ${book.author}, price ₱${book.price}`}
              >
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md bg-gray-300 self-center"
                />
                <h2 className="text-base font-semibold mt-4">{book.title}</h2>
                <p className="text-xs mt-1 text-gray-600">{book.author}</p>
                <p className="text-base font-medium mt-1.5">₱{book.price}</p>

                {/* Update & Delete Buttons */}
                {token && (
                  <div className="flex flex-col mt-auto w-full">
                    <Link to={`/books/update/${book.id}`} className="w-full">
                      <button className="w-full bg-[#e6f0ff] text-[#0047ab] text-sm mt-3 py-2 rounded-md hover:bg-[#cce0ff] transition-colors cursor-pointer">
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="w-full bg-[#ffe5e5] text-[#cc0000] text-sm mt-2 py-2 rounded-md hover:bg-[#ffcccc] transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard;
