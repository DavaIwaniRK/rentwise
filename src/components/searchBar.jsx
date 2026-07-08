import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../constants/color";
import { typography } from "../constants/typography";

// Search bar dengan ikon kaca pembesar di kiri.
// Dipakai di Home ("Cari tempat tinggalmu disini") dan Search.

export function SearchBar({ value, onChangeText, placeholder = "Cari tempat tinggalmu disini" }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text,
  },
});