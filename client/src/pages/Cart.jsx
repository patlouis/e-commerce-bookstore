import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:3000";

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleRemoveItem = async (cart_item_id) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/cart/${cart_item_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(cartItems.filter((item) => item.cart_item_id !== cart_item_id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  };

  const handleUpdateQuantity = async (cart_item_id, newQuantity) => {
    const item = cartItems.find((i) => i.cart_item_id === cart_item_id);
    if (!item) return;

    if (item.quantity === 1 && newQuantity < 1) {
      const confirmDelete = window.confirm("Do you want to remove this item?");
      if (confirmDelete) {
        handleRemoveItem(cart_item_id);
      }
      return;
    }

    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${API_BASE_URL}/cart/${cart_item_id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCartItems((prev) =>
        prev.map((i) =>
          i.cart_item_id === cart_item_id ? { ...i, quantity: newQuantity } : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity.");
    }
  };

  if (!user) return <p className="text-center mt-8">Please log in to view your cart.</p>;
  if (loading) return <p className="text-center mt-8">Loading cart...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <>
      <NavBar />
      <main className="py-20 px-4 sm:px-8 max-w-[1400px] mx-auto w-full bg-[#f9f9f9]">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full sm:w-32 h-40 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h2 className="text-lg font-semibold truncate">{item.title}</h2>
                      <p className="text-sm text-gray-500 truncate">{item.author}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-0 gap-2 sm:gap-2 flex-wrap">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cart_item_id, item.quantity - 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-2 py-0.5 rounded-md transition-colors text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cart_item_id, item.quantity + 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-2 py-0.5 rounded-md transition-colors text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-medium text-gray-800 sm:ml-2 truncate">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.cart_item_id)}
                        className="ml-0 sm:ml-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-xs flex-shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3 p-6 bg-white rounded-xl shadow flex flex-col gap-4 h-fit">
              <h2 className="text-xl font-bold border-b pb-2">Order Summary</h2>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="flex justify-between text-gray-700 text-sm"
                  >
                    <span className="truncate">
                      {item.title} x {item.quantity}
                    </span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 flex justify-between mt-2">
                Items: <span>{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </p>
              <p className="font-semibold flex justify-between text-lg">
                Total: <span>₱{total.toFixed(2)}</span>
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
