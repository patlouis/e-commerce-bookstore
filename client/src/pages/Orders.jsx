import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("dateDesc");

  const sortOptions = [
    { value: "dateDesc", label: "Newest First" },
    { value: "dateAsc", label: "Oldest First" },
    { value: "priceHigh", label: "Price: High → Low" },
    { value: "priceLow", label: "Price: Low → High" },
  ];

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/orders/my`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "dateDesc") return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "dateAsc") return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "priceHigh") return b.total - a.total;
    if (sortBy === "priceLow") return a.total - b.total;
    return 0;
  });

  if (!user) {
    return <p className="text-center mt-20 text-gray-600">Please log in to view your orders.</p>;
  }

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading your orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#f9f9f9]">
        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <div className="w-48">
              <Dropdown
                options={sortOptions}
                selected={sortBy}
                setSelected={setSortBy}
                placeholder="Sort by"
              />
            </div>
          </div>

          {sortedOrders.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedOrders.map((order) => (
                <Link
                  to={`/orders/${order.id}`}
                  key={order.id}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      Order #{order.id}
                    </p>
                    <span className="text-green-600 font-bold">
                      ₱{parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {dayjs(order.created_at).isValid()
                      ? dayjs(order.created_at).format("MMMM D, YYYY h:mm A")
                      : "Unknown date"}
                  </p>

                  {order.items && order.items.length > 0 && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {order.items[0].title}
                      {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
                    </p>
                  )}

                  {order.status && (
                    <span
                      className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-20">
              <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
              <Link
                to="/"
                className="mt-6 px-6 py-2 bg-blue-600 text-white text-sm rounded-xl shadow hover:bg-blue-700 transition"
              >
                Browse Books
              </Link>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
