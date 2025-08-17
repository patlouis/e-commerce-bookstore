// PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Redirect admins to /admin, regular users to /
  if (user) {
    return <Navigate to={user.role_id === 1 ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
}
