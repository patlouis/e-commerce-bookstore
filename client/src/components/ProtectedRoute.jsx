// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roleRequired }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
