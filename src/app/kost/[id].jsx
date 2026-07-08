import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatHargaBulanan, formatJarak, formatTanggal } from "../../../utils/format";
import { Button } from "../../components/button";
import { colors } from "../../constants/color";
import { typography } from "../../constants/typography";
import { getKostById } from "../../services/api";

export default function KostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [kost, setKost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKostById(id)
      .then(setKost)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!kost) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Kost tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Image source={{ uri: kost.gambar }} style={styles.image} />

        <View style={styles.body}>
          <Text style={styles.nama}>
            {(kost.tipe ? kost.tipe.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Kost")} {kost.nama}
          </Text>
          <Text style={styles.update}>Update {formatTanggal(kost.tanggalUpdate)}</Text>

          <View style={styles.priceBlock}>
            <Text style={styles.harga}>{formatHargaBulanan(kost.hargaSekarang)}</Text>
            <Text style={styles.estimasi}>Estimasi {formatHargaBulanan(kost.hargaEstimasi)}</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Detail {(kost.tipe ? kost.tipe.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Kost")}
          </Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="bed-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{kost.jumlahKamar || 1} kamar</Text>
            </View>
            {kost.luas ? (
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>Luas {kost.luas} m²</Text>
              </View>
            ) : null}
            <View style={styles.infoItem}>
              <Ionicons name="walk-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{formatJarak(kost.jarakjalanutama)} ke jalan utama</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{kost.area} › {kost.daerah}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.deskripsi}>{kost.deskripsi}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Rent the Property" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 6,
  },
  image: {
    width: "100%",
    height: 240,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nama: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  update: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  priceBlock: {
    marginBottom: 16,
  },
  harga: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  estimasi: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginTop: 16,
    marginBottom: 10,
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  deskripsi: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  notFound: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textMuted,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});