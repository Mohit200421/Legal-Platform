import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useContext(AuthContext);

  // ✅ don’t show loading screen (prevents flicker/back-forward glitch)
  if (loading) return null;

  // ❌ not logged in
  if (!user) return <Navigate to="/login" replace />;

  // ✅ allow can be string OR array
  if (allow) {
    const allowedRoles = Array.isArray(allow) ? allow : [allow];

    // ❌ role not allowed → redirect to correct dashboard
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "admin") return <Navigate to="/admin" replace />;
      if (user.role === "lawyer") return <Navigate to="/lawyer" replace />;
      return <Navigate to="/user" replace />;
    }
  }

  return children;
}
