// pages/OrderDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function OrderDetail() {
  const { id } = useParams(); // order id from URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(res.data.order);
        setItems(res.data.items);
      } catch (err) {
        console.error(err);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  if (!user) return <p className="text-center mt-12">Please log in to view this order.</p>;
  if (loading) return <p className="text-center mt-12">Loading order...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-12">Order not found.</p>;

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#f9f9f9]">
        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Order #{order.id}
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-semibold">Date:</span>{" "}
                {dayjs(order.created_at).isValid()
                  ? dayjs(order.created_at).format("MMMM D, YYYY h:mm A")
                  : "Unknown"}
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3">
              Items
            </h2>

            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.book_id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="text-sm sm:text-base text-gray-700">
                    {item.title}{" "}
                    <span className="text-gray-500">x {item.quantity}</span>
                  </div>
                  <div className="font-medium text-gray-800">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found for this order.</p>
            )}

            <div className="flex justify-between font-semibold text-lg sm:text-xl mt-4">
              <span>Total</span>
              <span className="text-green-600">₱{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Back to orders list */}
          <div className="mt-8 flex justify-center sm:justify-end">
            <button
              onClick={() => navigate("/orders")}
              className="w-full sm:w-auto bg-gray-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-700 transition cursor-pointer"
            >
              Back to My Orders
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
