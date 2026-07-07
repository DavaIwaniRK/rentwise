import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  function login(userData, authToken) {
    setUser(userData);
    setToken(authToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext harus dipakai di dalam <AuthProvider>");
  }
  return context;
}