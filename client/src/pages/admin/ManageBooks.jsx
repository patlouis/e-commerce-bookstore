import { useState, useEffect, useMemo } from "react"; // ⬅️ CHANGED: added useMemo
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = 'http://localhost:3000';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    desc: "",
    cover: "",
    price: "",
    category_id: ""
  });

  const [editingBookId, setEditingBookId] = useState(null);
  const [token, setToken] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/books`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load books.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const openModal = (book = null) => {
    if (book) {
      // ⬅️ CHANGED: Only map editable fields when editing
      setForm({
        title: book.title,
        author: book.author,
        desc: book.desc,
        cover: book.cover,
        price: book.price,
        category_id: book.category_id
      });
      setEditingBookId(book.id);
    } else {
      setForm({
        title: "",
        author: "",
        desc: "",
        cover: "",
        price: "",
        category_id: ""
      });
      setEditingBookId(null);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter((b) => b.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized");

    try {
      if (editingBookId) {
        await axios.put(`${API_BASE_URL}/books/${editingBookId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/books`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchBooks();
      setModalOpen(false);
    } catch (err) {
      alert("Save failed.");
      console.error(err);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {});
  }, [categories]);

  const sortedBooks = [...books].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA, valB;

    if (sortConfig.key === "category") {
      valA = categoryMap[a.category_id] || "";
      valB = categoryMap[b.category_id] || "";
    } else if (["created_at", "updated_at"].includes(sortConfig.key)) {
      valA = new Date(a[sortConfig.key]);
      valB = new Date(b[sortConfig.key]);
    } else {
      valA = a[sortConfig.key];
      valB = b[sortConfig.key];
    }

    if (typeof valA === "string" && !(valA instanceof Date)) {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 pt-20 bg-[#f9f9f9] font-sans">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Books</h1>
            <button
              onClick={() => openModal()}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition cursor-pointer"
            >
              Add New Book
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("title")}>
                      Title {renderSortIcon("title")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("author")}>
                      Author {renderSortIcon("author")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("price")}>
                      Price {renderSortIcon("price")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("category")}>
                      Category {renderSortIcon("category")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("created_at")}>
                      Created At {renderSortIcon("created_at")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("updated_at")}>
                      Updated At {renderSortIcon("updated_at")}
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBooks.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{b.title}</td>
                      <td className="px-4 py-3">{b.author}</td>
                      <td className="px-4 py-3">₱{b.price}</td>
                      <td className="px-4 py-3">{categoryMap[b.category_id] || ""}</td>
                      <td className="px-4 py-3">{dayjs(b.created_at).format("YYYY-MM-DD")}</td>
                      <td className="px-4 py-3">{dayjs(b.updated_at).format("YYYY-MM-DD")}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => openModal(b)}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {editingBookId ? "Edit Book" : "Add Book"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="url"
                  placeholder="Cover URL"
                  value={form.cover}
                  onChange={(e) => setForm({ ...form, cover: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
