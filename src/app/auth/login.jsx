import { Link } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native"; // 1. Tambahkan import Image di sini
import { validateEmail, validatePassword } from "../../../utils/validator";
import { Button } from "../../components/button";
import { InputField } from "../../components/inputField";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loading, error } = useAuth();

  function handleSubmit() {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setFieldErrors({ email: emailError, password: passwordError });
      return;
    }
    setFieldErrors({});
    login(email, password);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 2. GANTI STRUKTUR LOGOWRAP MENGGUNAKAN IMAGE */}
      <View style={styles.logoWrap}>
        <Image 
          source={require("../../assets/images/logo.png")} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder=""
        keyboardType="email-address"
        error={fieldErrors.email}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder=""
        secureTextEntry
        error={fieldErrors.password}
      />

      {error ? <Text style={styles.apiError}>{error}</Text> : null}

      <View style={{ height: 8 }} />
      <Button title="Login" onPress={handleSubmit} loading={loading} />

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Belum punya akun? </Text>
        <Link href="/auth/register" style={styles.signupLink}>
          Sign Up
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 40,
  },
  // 3. Tambahkan styling khusus untuk mengatur dimensi logo agar proporsional
  logoImage: {
    width: 200,
    height: 100,
  },
  apiError: {
    color: colors.danger,
    fontSize: typography.size.sm,
    marginBottom: 8,
    textAlign: "center",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  signupLink: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});