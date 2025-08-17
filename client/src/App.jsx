// App.jsx
// Main app router with public, protected, and admin routes

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import UserProfile from "./pages/UserProfile";

import ManageBooks from "./pages/admin/ManageBooks";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers";
import Create from "./pages/Create";
import Update from "./pages/Update";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (everyone can access) */}
          <Route path="/" element={<Home />} />

          {/* Guest-only routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Authenticated users */}
          <Route path="/user" element={<UserProfile />} />

          {/* Admin-only (role_id = 1) */}
          <Route element={<ProtectedRoute roleIdRequired={1} />}>
            <Route path="/manage/books" element={<ManageBooks />} />
            <Route path="/manage/categories" element={<ManageCategories />} />
            <Route path="/manage/users" element={<ManageUsers />} />
            <Route path="/books/create" element={<Create />} />
            <Route path="/books/update/:id" element={<Update />} />
          </Route>

          {/* Fallback (404 page) */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
