
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    access: null,
    refresh: null,
  });

  // ✅ Load from localStorage once
  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const username = localStorage.getItem("username");

    if (access && username) {
      setAuth({
        user: username,
        access,
        refresh,
      });
    }
  }, []);

  // ✅ LOGIN
  const login = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("username", data.username);

    setAuth({
      user: data.username,
      access: data.access,
      refresh: data.refresh,
    });
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    setAuth({
      user: null,
      access: null,
      refresh: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook
export const useAuth = () => useContext(AuthContext);