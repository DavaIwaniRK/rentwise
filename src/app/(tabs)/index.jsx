import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KostCard } from "../../components/kostCard";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { useAuthContext } from "../../context/authContext";
import { getKostList } from "../../services/api";

export default function HomeScreen() {
  const { user } = useAuthContext();
  const [kostList, setKostList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getKostList()
      .then((data) => { if (isMounted) setKostList(data); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  // Saat search bar di-tap, langsung pindah ke halaman Search
  function handleSearchTap() {
    router.push("/(tabs)/search");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>
        Welcome, {user?.nama || "Pengguna"} !
      </Text>

      {/* Search bar hanya sebagai tombol navigasi ke halaman Search */}
      <Pressable onPress={handleSearchTap} style={styles.searchWrap}>
        <View style={styles.searchBar} pointerEvents="none">
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>
            Cari tempat tinggalmu disini
          </Text>
        </View>
      </Pressable>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={kostList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <KostCard kost={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada kost yang tersedia</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginTop: 12,
    marginBottom: 16,
  },
  searchWrap: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 40,
  },
});