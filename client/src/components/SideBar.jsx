import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-orange-800 text-white w-64 p-6 space-y-6
          transform transition-transform duration-300 z-40 shadow-lg rounded-tr-xl rounded-br-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backdropFilter: 'saturate(180%) blur(12px)' }}
      >
        <button
          onClick={toggleSidebar}
          className="mb-6 self-end text-white text-2xl font-bold hover:text-orange-300"
          aria-label="Close sidebar"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-4 text-base font-semibold">
          <Link to="/manage/books" onClick={toggleSidebar} className="hover:text-orange-300">
            Manage Books
          </Link>
          <Link to="/manage/categories" onClick={toggleSidebar} className="hover:text-orange-300">
            Manage Categories
          </Link>
          <Link to="/manage/users" onClick={toggleSidebar} className="hover:text-orange-300">
            Manage Users
          </Link>
        </nav>
      </div>

      {/* Blur overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
