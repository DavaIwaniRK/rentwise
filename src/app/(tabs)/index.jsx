import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, FlatList, Image, Pressable,
  RefreshControl, StyleSheet, Text, View,
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getKostList()
      .then((data) => { if (isMounted) setKostList(data); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getKostList()
      .then((data) => { setKostList(data); })
      .catch((err) => console.error("Gagal refresh:", err))
      .finally(() => { setRefreshing(false); });
  };

  function handleSearchTap() {
    router.push("/(tabs)/search");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER LOGO MODERN */}
      <View style={styles.headerRow}>
        <Image 
          source={require("../../assets/images/logo.png")}
          style={styles.logoTop}
          resizeMode="contain"
        />
        <Text style={styles.welcome}>
          Welcome, <Text style={styles.userName}>{user?.nama || "Pengguna"}</Text> !
        </Text>
      </View>

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  logoTop: {
    width: 100,
    height: 100,

  },
  welcome: {
    fontSize: typography.size.lg,
    color: colors.text,
    fontWeight: "500",
  },
  userName: {
    fontWeight: typography.weight.bold,
    color: "#0f6244", // Warna hijau botol yang elegan menyesuaikan logo
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