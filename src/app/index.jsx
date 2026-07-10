import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, View } from "react-native";
// Impor helper token dari api.js Anda jika diperlukan untuk auto-login
// import { currentToken } from "../services/api"; 

export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0)); // Untuk efek animasi muncul lembut

  useEffect(() => {
    // 1. Animasi logo memudar muncul (Fade In)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2. Simulasi loading ngecek session/token selama 2.5 detik
    const timer = setTimeout(() => {
      // Skenario: Jika ada token langsung ke tabs utama, jika tidak ada ke login
      // Di sini kita arahkan ke halaman auth login sebagai default
      router.replace("/auth/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/logo.png")} // Mengarah ke folder src/assets/images/logo.png Anda
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Loading Indicator minimalis di bagian bawah */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#0f6244" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Menyesuaikan logo transparan Anda yang berlatar putih bersih
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    width: 240, // Sedikit lebih besar dari form login agar terlihat fokus
    height: 100,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 60,
  },
});