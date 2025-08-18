import { useState, useEffect } from "react";
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

  // Fetch cart items
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

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  // Delete a cart item
  const handleRemoveItem = async (cart_item_id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to remove this item from your cart?"
  );
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/cart/${cart_item_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // Update local state after deletion
    setCartItems(cartItems.filter((item) => item.cart_item_id !== cart_item_id));
  } catch (err) {
    console.error("Failed to remove item from cart:", err);
    alert("Failed to remove item. Please try again.");
  }
};

  if (!user)
    return <p className="text-center mt-8">Please log in to view your cart.</p>;
  if (loading)
    return <p className="text-center mt-8">Loading cart...</p>;
  if (error)
    return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <>
      <NavBar />
      <main className="pt-32 p-4 sm:p-8 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full sm:w-32 h-40 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="text-sm text-gray-500">{item.author}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 sm:mt-0">
                      <p className="font-medium text-gray-800">
                        ₱{parseFloat(item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.cart_item_id)}
                        className="ml-4 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm cursor-pointer"
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
              <p className="text-gray-600 flex justify-between">
                Items: <span>{cartItems.length}</span>
              </p>
              <p className="font-semibold flex justify-between text-lg">
                Total: <span>₱{total.toFixed(2)}</span>
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
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
