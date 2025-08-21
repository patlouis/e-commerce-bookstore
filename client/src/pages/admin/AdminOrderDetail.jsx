import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:3000";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/orders/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        setError("Failed to load order.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-red-600">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) return null;

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 sm:px-8 lg:px-20 py-20 bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-200">
          {/* Header */}
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-wide">Order Details</h1>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              {dayjs(order.created_at).format("MMMM D, YYYY h:mm A")}
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-6 text-gray-700">
            <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
            <p>
              <span className="font-medium">Name:</span> {order.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.email}
            </p>
          </div>

          {/* Items */}
          <h2 className="font-semibold text-lg mb-3 text-gray-700">Items</h2>
          <div className="divide-y border rounded-lg">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-3 text-sm sm:text-base"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500 text-xs">
                    Qty: {item.quantity} × ₱{item.price}
                  </p>
                </div>
                <div className="font-semibold">
                  ₱{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-6 text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">₱{total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center sm:justify-end gap-3">
            <button
              onClick={() => navigate("/manage/orders")}
              className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
