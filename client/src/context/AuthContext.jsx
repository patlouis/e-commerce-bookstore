import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Run once when the app starts (or page refreshes)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // No token = guest

    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded); // Save user info (id, email, role_id, etc.)
      } else {
        localStorage.removeItem("token"); // Clean up expired token
      }
    } catch {
      localStorage.removeItem("token"); // Invalid token format
    }
  }, []);

  // Called after login
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  // Called when user logs out
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to auth state
export const useAuth = () => useContext(AuthContext);
