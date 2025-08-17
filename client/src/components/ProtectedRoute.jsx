import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roleIdRequired }) {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If role is required (e.g., admin = 1) but user doesn't match, redirect home
  if (roleIdRequired && user.role_id !== roleIdRequired) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the protected page
  return <Outlet />;
}
