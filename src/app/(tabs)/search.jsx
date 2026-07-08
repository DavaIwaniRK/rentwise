import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KostCard } from "../../components/kostCard";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { searchKost, WILAYAH } from "../../services/api";

// Aktifkan LayoutAnimation di Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDaerah, setSelectedDaerah] = useState("");
  const [expandedKota, setExpandedKota] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mode, setMode] = useState("wilayah");

  const inputRef = useRef(null);

  // Auto-focus input saat halaman dibuka
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // Jalankan pencarian setiap kali keyword/area/daerah berubah
  useEffect(() => {
    if (!keyword && !selectedArea && !selectedDaerah) {
      setResults([]);
      setHasSearched(false);
      setMode("wilayah");
      return;
    }
    const timer = setTimeout(() => {
      runSearch(keyword, selectedArea, selectedDaerah);
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [keyword, selectedArea, selectedDaerah]);

  async function runSearch(kw, area, daerah) {
    setLoading(true);
    setHasSearched(true);
    setMode("hasil");
    try {
      const data = await searchKost({ keyword: kw, area, daerah });
      setResults(data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleToggleKota(kota) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedKota(expandedKota === kota ? null : kota);
  }

  function handlePilihKota(kota) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedArea(kota);
    setSelectedDaerah("");
    setExpandedKota(kota);
  }

  function handlePilihDaerah(daerah) {
    setSelectedDaerah(daerah);
    setExpandedKota(null);
  }

  function handleReset() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyword("");
    setSelectedArea("");
    setSelectedDaerah("");
    setExpandedKota(null);
    setResults([]);
    setHasSearched(false);
    setMode("wilayah");
    inputRef.current?.focus();
  }

  function renderKotaItem({ item }) {
    const isExpanded = expandedKota === item.kota;
    const isSelected = selectedArea === item.kota;

    return (
      <View>
        <Pressable
          style={[styles.kotaRow, isSelected && styles.kotaRowSelected]}
          onPress={() => handleToggleKota(item.kota)}
        >
          <View style={styles.kotaLeft}>
            <Ionicons
              name="location-outline"
              size={18}
              color={isSelected ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.kotaText, isSelected && styles.kotaTextSelected]}>
              {item.kota}
            </Text>
            {isSelected && selectedDaerah ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{selectedDaerah}</Text>
              </View>
            ) : null}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textMuted}
          />
        </Pressable>

        {isExpanded && (
          <View style={styles.daerahContainer}>
            <Pressable
              style={[
                styles.daerahRow,
                isSelected && !selectedDaerah && styles.daerahRowSelected,
              ]}
              onPress={() => handlePilihKota(item.kota)}
            >
              <Text
                style={[
                  styles.daerahText,
                  isSelected && !selectedDaerah && styles.daerahTextSelected,
                ]}
              >
                Semua wilayah {item.kota}
              </Text>
              {isSelected && !selectedDaerah && (
                <Ionicons name="checkmark" size={16} color={colors.primary} />
              )}
            </Pressable>

            {item.daerah.map((d) => (
              <Pressable
                key={d}
                style={[
                  styles.daerahRow,
                  selectedDaerah === d && styles.daerahRowSelected,
                ]}
                onPress={() => handlePilihDaerah(d)}
              >
                <Text
                  style={[
                    styles.daerahText,
                    selectedDaerah === d && styles.daerahTextSelected,
                  ]}
                >
                  {d}
                </Text>
                {selectedDaerah === d && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header: tombol back + search input */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Cari nama kost, kota, atau daerah..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="search"
          />
          {keyword.length > 0 && (
            <Pressable onPress={() => setKeyword("")}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Chip filter aktif */}
      {(selectedArea || selectedDaerah) && (
        <View style={styles.filterRow}>
          <Ionicons name="filter" size={14} color={colors.primary} />
          <Text style={styles.filterText}>
            {selectedArea}{selectedDaerah ? ` › ${selectedDaerah}` : ""}
          </Text>
          <Pressable onPress={handleReset} style={styles.resetBtn}>
            <Ionicons name="close" size={14} color={colors.white} />
          </Pressable>
        </View>
      )}

      {/* Konten: daftar wilayah ATAU hasil pencarian */}
      {mode === "wilayah" ? (
        <FlatList
          data={WILAYAH}
          keyExtractor={(item) => item.kota}
          renderItem={renderKotaItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>Pilih wilayah</Text>
          }
        />
      ) : loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Mencari kost...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerWrap}>
          <Ionicons name="search-outline" size={56} color={colors.border} />
          <Text style={styles.notFoundTitle}>Pencarian tidak ditemukan</Text>
          <Text style={styles.notFoundSub}>
            Tidak ada kost yang cocok dengan{"\n"}
            <Text style={{ fontWeight: typography.weight.semibold }}>
              "{keyword || selectedArea || selectedDaerah}"
            </Text>
          </Text>
          <Pressable onPress={handleReset} style={styles.cariLainBtn}>
            <Text style={styles.cariLainText}>Cari dengan kata lain</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <KostCard kost={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>
              {results.length} kost ditemukan
            </Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 4,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundMuted,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: colors.backgroundMuted,
  },
  filterText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  resetBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  kotaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kotaRowSelected: {
    borderBottomColor: colors.primaryLight,
  },
  kotaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  kotaText: {
    fontSize: typography.size.base,
    color: colors.text,
  },
  kotaTextSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  badge: {
    backgroundColor: colors.primaryLight + "22",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: typography.size.xs,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  daerahContainer: {
    backgroundColor: colors.backgroundMuted,
    marginBottom: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  daerahRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  daerahRowSelected: {
    backgroundColor: colors.primary + "11",
  },
  daerahText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  daerahTextSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  notFoundTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: "center",
  },
  notFoundSub: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  cariLainBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  cariLainText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
});