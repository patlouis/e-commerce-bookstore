import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roleIdRequired, allowRoles }) {
  const { user } = useAuth();

  // If roleIdRequired → must match
  if (roleIdRequired) {
    if (!user || user.role_id !== roleIdRequired) {
      return <Navigate to="/" replace />;
    }
  }

  // If allowRoles → guest (null) or specific roles
  if (allowRoles) {
    const role = user ? user.role_id : null; // null = guest
    if (!allowRoles.includes(role)) {
      // If admin tries guest/user routes → send them to admin dashboard
      return <Navigate to={user?.role_id === 1 ? "/admin" : "/"} replace />;
    }
  }

  return <Outlet />;
}
