// pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:3000";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCartItems(res.data.cart);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!window.confirm("Confirm and place your order?")) return;

    try {
        const res = await axios.post(
        `${API_BASE_URL}/orders/checkout`,
        {},
        {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
        );

        // use order_id from backend
        navigate(`/orders/${res.data.order_id}`);
    } catch (err) {
        console.error(err);
        alert("Failed to place order. Try again.");
    }
    };

  if (!user) return <p className="text-center mt-12">Please log in to checkout.</p>;
  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;

  return (
    <>
      <NavBar />
      {/* 👇 full page background */}
      <div className="min-h-screen bg-[#f9f9f9]">
        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Checkout
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Order Summary */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="text-sm sm:text-base text-gray-700">
                      {item.title}{" "}
                      <span className="text-gray-500">x {item.quantity}</span>
                    </div>
                    <div className="font-medium text-gray-800">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="flex justify-between text-gray-600 mt-2 text-sm sm:text-base">
                  <span>Items</span>
                  <span>{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg sm:text-xl mt-2">
                  <span>Total</span>
                  <span className="text-green-600">₱{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <div className="mt-8 flex justify-center sm:justify-end">
            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full sm:w-auto bg-green-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
