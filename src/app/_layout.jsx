import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/authContext";

// Layout paling luar. Semua route (auth, tabs, detail kost) ada di dalam
// AuthProvider supaya status login bisa diakses dari mana saja.

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kost/[id]" />
      </Stack>
    </AuthProvider>
  );
}