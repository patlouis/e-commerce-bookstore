import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user } = useAuth();

  // If already logged in, redirect to home (or dashboard)
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
