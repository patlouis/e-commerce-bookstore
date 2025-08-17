import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import UserProfile from "./pages/UserProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
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

          {/* Public routes */}
          <Route path="/" element={<Home />} />

          {/* Guest routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute roleIdRequired={1} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage/books" element={<ManageBooks />} />
            <Route path="/manage/categories" element={<ManageCategories />} />
            <Route path="/manage/users" element={<ManageUsers />} />
            <Route path="/books/create" element={<Create />} />
            <Route path="/books/update/:id" element={<Update />} />
          </Route>

          {/* Authenticated Users (User, Admin) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserProfile />} />
          </Route>

          {/* Fallback (404 page) */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
