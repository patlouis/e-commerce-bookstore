// pages/admin/ManageOrders.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      setError("Failed to load orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (["created_at"].includes(sortConfig.key)) {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (typeof valA === "string" && !(valA instanceof Date)) {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter orders
  const filteredOrders = sortedOrders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.username || "").toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q) ||
      (o.id || "").toString().includes(q)
    );
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
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-20 bg-[#f9f9f9] font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Orders</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md pl-3 py-1.5 w-full sm:w-64 bg-white"
              />
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
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("id")}>
                      ID {renderSortIcon("id")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("username")}>
                      Username {renderSortIcon("username")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("email")}>
                      Email {renderSortIcon("email")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("total")}>
                      Total {renderSortIcon("total")}
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("created_at")}>
                      Date {renderSortIcon("created_at")}
                    </th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{o.id}</td>
                      <td className="px-4 py-3">{o.username}</td>
                      <td className="px-4 py-3">{o.email}</td>
                      <td className="px-4 py-3">₱{o.total}</td>
                      <td className="px-4 py-3">
                        {dayjs(o.created_at).format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/manage/orders/${o.id}`)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
