import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const API_BASE_URL = "http://localhost:3000";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Modal controls
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if(storedToken) {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load categories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Delete failed.");
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

  const sortedCategories = useMemo(() => {
    if (!sortConfig.key) return categories;
    const sorted = [...categories].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [categories, sortConfig]);

  const filteredCategories = sortedCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  // ===== Create Modal Component =====
  function CategoryCreateModal({ isOpen, onClose }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) {
        setError("Category name is required.");
        return;
      }
      try {
        await axios.post(
          `${API_BASE_URL}/categories`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
        fetchCategories();
      } catch (err) {
        setError("Failed to create category.");
        console.error(err);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-600 text-white px-3.5 py-1.5 rounded hover:bg-orange-700 cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ===== Update Modal Component =====
  function CategoryUpdateModal({ isOpen, category, onClose }) {
    const [name, setName] = useState(category?.name || "");
    const [error, setError] = useState("");

    useEffect(() => {
      if (category) setName(category.name);
    }, [category]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) {
        setError("Category name is required.");
        return;
      }
      try {
        await axios.put(
          `${API_BASE_URL}/categories/${category.id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
        fetchCategories();
      } catch (err) {
        setError("Failed to update category.");
        console.error(err);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-600 text-white px-3.5 py-1.5 rounded hover:bg-orange-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 pt-20 bg-[#f9f9f9] font-sans">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md pl-3 py-1.5 w-full sm:w-64 bg-white"
              />
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition cursor-pointer"
              >
                Add New Category
              </button>
            </div>
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
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      ID {renderSortIcon("id")}
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name {renderSortIcon("name")}
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{c.id}</td>
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setUpdateCategory(c);
                            setUpdateModalOpen(true);
                          }}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CategoryCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <CategoryUpdateModal
        isOpen={updateModalOpen}
        category={updateCategory}
        onClose={() => {
          setUpdateModalOpen(false);
          setUpdateCategory(null);
        }}
      />

      <Footer />
    </>
  );
}
