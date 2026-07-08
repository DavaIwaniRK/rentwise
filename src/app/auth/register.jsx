import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { validateEmail, validatePassword, validateUsername } from "../../../utils/validator";
import { Button } from "../../components/button";
import { InputField } from "../../components/inputField";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error } = useAuth();

  function handleSubmit() {
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (usernameError || emailError || passwordError) {
      setFieldErrors({ username: usernameError, email: emailError, password: passwordError });
      return;
    }
    setFieldErrors({});
    register(username, email, password);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>Rent{"\n"}Wise</Text>
      </View>

      <InputField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder=""
        error={fieldErrors.username}
      />
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
      <Button title="Sign Up" onPress={handleSubmit} loading={loading} />

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Sudah punya akun? </Text>
        <Link href="/auth/login" style={styles.loginLink}>
          Login
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
  logo: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    textAlign: "center",
    lineHeight: 30,
  },
  apiError: {
    color: colors.danger,
    fontSize: typography.size.sm,
    marginBottom: 8,
    textAlign: "center",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});