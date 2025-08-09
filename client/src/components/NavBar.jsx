import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []); // run once on mount

  return (
    <nav className="bg-orange-600 text-white px-6 py-3 flex justify-between items-center shadow-sm fixed top-0 w-full z-50">
      {/* Left - logo/title */}
      <div className="w-1/3 flex items-center">
        <Link to="/" className="text-xl font-bold hover:underline">
          Fully Booked
        </Link>
      </div>

      {/* Center nav links */}
      <div className="flex space-x-10 text-sm items-center justify-center w-1/3">
        <Link to="/user" className="hover:underline">
          Categories
        </Link>
        {token ? (
          <Link to="/create" className="hover:underline">
            Add Books
          </Link>
        ) : (
          <Link to="/" className="hover:underline">
            Categories
          </Link>
        )}
      </div>

      {/* Right auth controls */}
      <div className="flex space-x-8 text-sm items-center justify-end w-1/3">
        {token ? (
          <>
            <Link to="/user" className="hover:underline">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
