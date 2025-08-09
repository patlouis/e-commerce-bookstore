import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Navbar */}
      <nav className="bg-orange-600 text-white px-6 py-3 flex justify-between items-center shadow-sm fixed top-0 w-full z-50">
        {/* Hamburger button, visible only on small screens */}
        <button
          onClick={toggleSidebar}
          className="mr-4 md:hidden flex flex-col justify-center items-center gap-1 cursor-pointer"
          aria-label="Toggle sidebar menu"
          style={{ width: 28, height: 24 }}
        >
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
        </button>

        {/* Left - logo/title */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="text-xl font-bold hover:underline">
            Fully Booked
          </Link>
        </div>

        {/* Center nav links */}
        <div className="hidden md:flex space-x-10 text-sm items-center justify-center flex-1">
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
        <div className="hidden md:flex space-x-8 text-sm items-center justify-end flex-1">
          {token ? (
            <>
              <Link to="/user" className="hover:underline">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline cursor-pointer">
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
