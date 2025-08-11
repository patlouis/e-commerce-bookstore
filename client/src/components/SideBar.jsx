import { Link, useLocation } from "react-router-dom";
import { Book, Layers, Users } from "lucide-react";
import { useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { path: "/manage/books", label: "Manage Books", icon: <Book size={18} /> },
    { path: "/manage/categories", label: "Manage Categories", icon: <Layers size={18} /> },
    { path: "/manage/users", label: "Manage Users", icon: <Users size={18} /> },
  ];

  // Close on ESC key for practicality
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
          <h2 className="text-lg font-bold tracking-wide">Admin Panel</h2>
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
          {navItems.map(({ path, label, icon }) => (
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
          ))}
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
