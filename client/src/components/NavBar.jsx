import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./SideBar";
import { User, ShoppingCart, LogOut, Search } from "lucide-react";

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (user?.role_id === 1) {
      navigate(`/admin?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }

    setSearchTerm("");
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <nav className="dark:bg-gray-800 text-white px-4 md:px-6 py-3 flex items-center shadow-sm fixed top-0 w-full z-50">
        {/* SideBar */}
        <div className="flex items-center flex-1">
          <button
            onClick={toggleSidebar}
            className="mr-4 flex flex-col justify-center items-center gap-1 cursor-pointer"
            style={{ width: 28, height: 24 }}
          >
            <span className="block w-5 h-0.5 bg-white rounded"></span>
            <span className="block w-5 h-0.5 bg-white rounded"></span>
            <span className="block w-5 h-0.5 bg-white rounded"></span>
          </button>
          <Link
            to="/"
            className="text-lg md:text-xl font-extrabold hover:no-underline tracking-wide"
          >
            FULLY BOOKED
          </Link>
        </div>

        {/* Center: Search bar (hidden on small, show on md+) */}
        <div className="hidden md:flex flex-1 justify-center">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md flex bg-white rounded-md overflow-hidden shadow-sm"
          >
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 text-black text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-gray-200 text-black px-3 flex items-center justify-center hover:bg-gray-300 transition cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Right: Auth links + Cart */}
        <div className="flex-1 flex justify-end items-center space-x-4 text-sm">
          {user ? (
            <>
              {user.role_id !== 1 && (
                <Link
                  to="/cart"
                  className="flex items-center space-x-1 hover:no-underline hover:text-gray-300 transition"
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  <span>Cart</span>
                </Link>
              )}

              <Link
                to="/user"
                className="flex items-center space-x-1 hover:no-underline hover:text-gray-300 transition"
              >
                <User size={18} strokeWidth={2} />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:no-underline hover:text-gray-300 transition cursor-pointer"
              >
                <LogOut size={18} strokeWidth={2} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-1 hover:no-underline hover:text-gray-300 transition"
              >
                <ShoppingCart size={18} strokeWidth={2} />
                <span>Cart</span>
              </Link>

              <Link
                to="/login"
                className="flex items-center space-x-1 hover:no-underline hover:text-gray-300 transition"
              >
                <User size={18} strokeWidth={2} />
                <span>Login/Register</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile search bar (separate below nav) */}
      <div className="md:hidden mt-14 px-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex bg-white rounded-md overflow-hidden shadow-sm"
        >
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 text-black text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-gray-200 text-black px-3 flex items-center justify-center hover:bg-gray-300 transition"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>
      </div>
    </>
  );
}

export default NavBar;
