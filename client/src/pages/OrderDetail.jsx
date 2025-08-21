import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function OrderDetail() {
  const { id } = useParams();
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
      <main className="min-h-screen bg-gray-50 px-4 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-200">
          {/* Header */}
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold">Order Receipt</h1>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              {dayjs(order.created_at).format("MMMM D, YYYY h:mm A")}
            </p>
          </div>

          {/* Items */}
          <h2 className="font-semibold text-lg mb-3 text-gray-700">Items</h2>
          <div className="divide-y border rounded-lg">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.book_id}
                  className="flex justify-between items-center px-4 py-3 text-sm sm:text-base"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-500 text-xs">
                      Qty: {item.quantity} × ₱{item.price}
                    </p>
                  </div>
                  <div className="font-semibold">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-4">No items found for this order.</p>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-6 text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">₱{total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center sm:justify-end">
            <button
              onClick={() => navigate("/orders")}
              className="w-full sm:w-auto bg-gray-700 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
