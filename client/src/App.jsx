import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"
import OrderDetail from "./pages/OrderDetail";
import Orders from "./pages/Orders";
import BookDetail from "./pages/BookDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageOrders from "./pages/admin/ManageOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import Create from "./pages/admin/Create";
import Update from "./pages/admin/Update";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest + User only (admin blocked) */}
          <Route element={<ProtectedRoute allowRoles={[null, 2]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Route>

          {/* Guest-only */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User-only */}
          <Route element={<ProtectedRoute roleIdRequired={2} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />  
          </Route>

          {/* Admin-only */}
          <Route element={<ProtectedRoute roleIdRequired={1} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage/books" element={<ManageBooks />} />
            <Route path="/manage/categories" element={<ManageCategories />} />
            <Route path="/manage/users" element={<ManageUsers />} />
            <Route path="/books/create" element={<Create />} />
            <Route path="/manage/orders" element={<ManageOrders />} />
            <Route path="/manage/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/books/update/:id" element={<Update />} />
          </Route>

          {/* Authenticated-only */}
          <Route element={<ProtectedRoute allowRoles={[1, 2]} />}>
            <Route path="/user" element={<UserProfile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
