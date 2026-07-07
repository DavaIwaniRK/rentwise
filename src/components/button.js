import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/color";
import { typography } from "../constants/typography";

export function Button({ title, onPress, variant = "primary", loading = false, disabled = false }) {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textPrimary]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  textPrimary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
});