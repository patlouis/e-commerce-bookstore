import { Link, useLocation } from "react-router-dom";
import { Book, Layers, Users, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // adjust if needed

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  // Fetch categories for guests/users
  useEffect(() => {
    if (user?.role_id !== 1) {
      axios
        .get(`${API_BASE_URL}/categories`)
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Failed to fetch categories:", err));
    }
  }, [user]);

  // Admin nav items
  const adminNavItems = [
    { path: "/manage/books", label: "Manage Books", icon: <Book size={18} /> },
    { path: "/manage/categories", label: "Manage Categories", icon: <Layers size={18} /> },
    { path: "/manage/users", label: "Manage Users", icon: <Users size={18} /> },
    { path: "/manage/orders", label: "Manage Orders", icon: <ShoppingCart size={18} /> },
  ];

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && toggleSidebar();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggleSidebar]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 p-6 flex flex-col space-y-8 bg-gradient-to-b from-[#2c2f2c] to-[#363A36] text-white shadow-xl
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backdropFilter: "saturate(180%) blur(12px)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-wide">
            {user?.role_id === 1 ? "Admin Panel" : "Browse Categories"}
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-xl font-bold hover:text-orange-300"
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {user?.role_id === 1 ? (
            adminNavItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${
                    location.pathname === path
                      ? "bg-[#2c2f2c] text-white"
                      : "hover:bg-[#363A36] hover:text-white"
                  }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={toggleSidebar}
                className={`px-4 py-2 rounded-lg transition-colors
                  ${
                    location.pathname === `/category/${cat.id}`
                      ? "bg-[#2c2f2c] text-white"
                      : "hover:bg-[#363A36] hover:text-white"
                  }`}
              >
                {cat.name}
              </Link>
            ))
          )}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
