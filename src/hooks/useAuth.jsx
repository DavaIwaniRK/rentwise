import { router } from "expo-router";
import { useState } from "react";
import { useAuthContext } from "../context/authContext";
import { loginUser, registerUser } from "../services/api";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: setLoginState } = useAuthContext();

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginUser(email, password);
      setLoginState(user, token);
      router.replace("/(tabs)");
    } catch (err) {
      setError(err.message || "Gagal login, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  async function register(username, email, password) {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await registerUser(username, email, password);
      setLoginState(user, token);
      router.replace("/(tabs)");
    } catch (err) {
      setError(err.message || "Gagal mendaftar, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return { login, register, loading, error };
}