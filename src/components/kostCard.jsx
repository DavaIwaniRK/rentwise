import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatHargaBulanan, formatJarak, formatTanggal } from "../../utils/format";
import { colors } from "../constants/color";
import { typography } from "../constants/typography";

// Card kost yang dipakai berulang di Home dan hasil Search.
// Menampilkan gambar, nama area, harga sekarang vs estimasi, dan jarak.
//
// Props: kost (object dari services/api.js)

export function KostCard({ kost }) {
  return (
    <Pressable
      onPress={() => router.push(`/kost/${kost.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.area}>{kost.area}</Text>
        <Text style={styles.tanggal}>Update {formatTanggal(kost.tanggalUpdate)}</Text>
      </View>

      <Image source={{ uri: kost.gambar }} style={styles.image} />

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.hargaSekarang}>{formatHargaBulanan(kost.hargaSekarang)}</Text>
          <Text style={styles.hargaEstimasi}>Estimasi {formatHargaBulanan(kost.hargaEstimasi)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="bed-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{kost.jumlahKamar || 1}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="walk-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formatJarak(kost.jarakjalanutama)} ke jalan utama</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  area: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  tanggal: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  image: {
    width: "100%",
    height: 140,
    marginTop: 8,
  },
  priceRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  hargaSekarang: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  hargaEstimasi: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
});