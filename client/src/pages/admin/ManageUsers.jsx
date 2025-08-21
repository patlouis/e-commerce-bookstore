import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
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

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;
    return [...users].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
  function UserCreateModal({ isOpen, onClose }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!username.trim() || !email.trim() || !password) {
        setError("All fields are required.");
        return;
      }
      try {
        await axios.post(
          `${API_BASE_URL}/users`,
          { username, email, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
        fetchUsers(token);
      } catch (err) {
        const backendMsg = err.response?.data?.message;
        setError(backendMsg || "Failed to create user.");
        console.error(err);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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
  function UserUpdateModal({ isOpen, user, onClose }) {
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [error, setError] = useState("");

    useEffect(() => {
      if (user) {
        setUsername(user.username);
        setEmail(user.email);
      }
    }, [user]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!username.trim() || !email.trim()) {
        setError("Username and email are required.");
        return;
      }
      try {
        await axios.put(
          `${API_BASE_URL}/users/${user.id}`,
          { username, email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
        fetchUsers(token);
      } catch (err) {
        const backendMsg = err.response?.data?.message;
        setError(backendMsg || "Failed to update user.");
        console.error(err);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
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
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-20 bg-[#f9f9f9] font-sans">
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md pl-3 py-1.5 w-full sm:w-64 bg-white"
              />
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition cursor-pointer"
              >
                Add New User
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
                      onClick={() => handleSort("username")}
                    >
                      Username {renderSortIcon("username")}
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email {renderSortIcon("email")}
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("role_name")}
                    >
                      Role {renderSortIcon("role_name")}
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      Created At {renderSortIcon("created_at")}
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("updated_at")}
                    >
                      Updated At {renderSortIcon("updated_at")}
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3">{u.username}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role_name}</td>
                      <td className="px-4 py-3">
                        {dayjs(u.created_at).format("YYYY-MM-DD")}
                      </td>
                      <td className="px-4 py-3">
                        {dayjs(u.updated_at).format("YYYY-MM-DD")}
                      </td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setUpdateUser(u);
                            setUpdateModalOpen(true);
                          }}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        No users found.
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
      <UserCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UserUpdateModal
        isOpen={updateModalOpen}
        user={updateUser}
        onClose={() => {
          setUpdateModalOpen(false);
          setUpdateUser(null);
        }}
      />

      <Footer />
    </>
  );
}
