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
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kost/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}