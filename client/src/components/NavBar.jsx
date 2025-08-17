import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./SideBar";

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <nav className="dark:bg-gray-800 text-white px-6 py-3 flex items-center shadow-sm fixed top-0 w-full z-50">
        {/* Left: Hamburger + Logo */}
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
          <Link to="/" className="text-xl font-bold hover:no-underline">
            FULLY BOOKED
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="flex-1 flex justify-center">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md flex bg-white rounded-sm overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 text-black text-[14px] outline-none"
            />
            <button
              type="submit"
              className="bg-gray-200 text-black px-4 hover:bg-gray-300"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Auth links */}
        <div className="flex-1 flex justify-end items-center space-x-4 text-sm">
          {user ? (
            <>
              <Link to="/user" className="hover:no-underline">
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
            <Link to="/login" className="hover:no-underline">
              Login/Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
