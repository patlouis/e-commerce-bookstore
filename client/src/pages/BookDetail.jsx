import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:3000";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { book_id: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-600 text-lg">Loading book...</p>;
  if (error || !book)
    return <p className="text-center py-20 text-red-600 text-lg">{error || "Book not found."}</p>;

  return (
    <>
      <NavBar />

      <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-24 bg-[#f9f9f9] flex justify-center">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Cover Image */}
          <img
            src={book.cover}
            alt={book.title}
            className="w-full md:w-64 lg:w-72 h-80 md:h-96 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform self-center"
          />

          {/* Book Details */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-gray-500 text-lg mt-1">{book.author}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-4">₱{book.price}</p>
            <p className="text-gray-700 mt-6 whitespace-pre-wrap text-sm sm:text-base">{book.desc}</p>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-center font-medium cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:underline py-3 px-6 rounded-lg border border-blue-600 w-full sm:w-auto text-center font-medium cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
