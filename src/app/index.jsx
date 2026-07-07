import { Redirect } from "expo-router";
import { useAuthContext } from "../context/authContext";

export default function Index() {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/auth/login" />;
}