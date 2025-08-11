import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <nav className="bg-orange-600 text-white px-6 py-3 flex items-center shadow-sm fixed top-0 w-full z-50">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center flex-1">
          <button
            onClick={toggleSidebar}
            className="mr-4 flex flex-col justify-center items-center gap-1 cursor-pointer"
            aria-label="Toggle sidebar menu"
            style={{ width: 28, height: 24 }}
          >
            <span className="block w-5 h-0.5 bg-white rounded"></span>
            <span className="block w-5 h-0.5 bg-white rounded"></span>
            <span className="block w-5 h-0.5 bg-white rounded"></span>
          </button>
          <Link to="/" className="text-xl font-bold hover:underline">
            Fully Booked
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="flex-1 flex justify-center">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md flex bg-white rounded-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 text-black outline-none"
            />
            <button
              type="submit"
              className="bg-gray-200 text-black px-4 hover:bg-gray-300"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Auth controls */}
        <div className="flex-1 flex justify-end space-x-6 text-sm">
          {token ? (
            <>
              <Link to="/user" className="hover:underline">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
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
    </>
  );
}

export default NavBar;
