import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/button";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { useAuthContext } from "../../context/authContext";
import { getProfile } from "../../services/api";

export default function ProfileScreen() {
  const { logout } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={48} color={colors.textMuted} />
        </View>
      </View>

      <ProfileRow label="Nama" value={profile?.nama || "-"} />
      <ProfileRow label="Bio" value={profile?.bio || "-"} />
      <ProfileRow label="Email" value={profile?.email || "-"} />
      <ProfileRow label="Password" value={profile?.password || "-"} />

      <View style={{ height: 24 }} />
      <Button title="Logout" variant="outline" onPress={handleLogout} />
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginTop: 12,
    marginBottom: 20,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: typography.size.base,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
});