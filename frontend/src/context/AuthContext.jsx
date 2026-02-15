import { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from cookie session
  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data?.user || null);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ login after successful login API call
  const login = async () => {
    await loadUser();
  };

  // ✅ logout clears cookie + localStorage
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
