import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';

function Books() {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Check for token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/books');
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(books.filter(book => book.id !== id)); // client-side update
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full px-10 py-16 flex flex-col items-center bg-[#f9f9f9] font-sans">
        
        {/* Add book button only if authenticated */}
        {token && (
          <button className="bg-orange-600 text-white px-5 py-2 rounded-md text-sm hover:bg-orange-800 transition-colors mb-6 cursor-pointer">
            <Link to="/create">+ Add New Book</Link>
          </button>
        )}

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-4 items-stretch">
        {books.map((book) => (
          <div
            key={book.id}
            className="w-[210px] h-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform"
          >
            {/* Image centered horizontally */}
            <img
              src={book.cover}
              alt={book.title}
              className="w-[180px] h-[270px] object-cover rounded-md bg-gray-300 self-center"
            />

            {/* Text left-aligned */}
            <h2 className="text-base font-semibold mt-4">{book.title}</h2>
            <p className="text-xs mt-1 text-gray-600">{book.author}</p>
            <p className="text-base font-medium mt-1.5">₱{book.price}</p>

            {/* Push price + buttons to bottom */}
            <div className="flex flex-col mt-auto w-full">
              {token ? (
                <>
                  <Link to={`/update/${book.id}`} className="w-full">
                    <button className="w-full bg-[#e6f0ff] text-[#0047ab] text-sm mt-3 py-2 rounded-md hover:bg-[#cce0ff] transition-colors cursor-pointer">
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="w-full bg-[#ffe5e5] text-[#cc0000] text-sm mt-2 py-2 rounded-md hover:bg-[#ffcccc] transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => console.log(`Add ${book.title} to cart`)}
                  className="w-full bg-orange-600 text-white text-sm mt-3 py-2 rounded-md hover:bg-orange-800 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}

export default Books;
