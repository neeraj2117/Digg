import { View, StyleSheet, Image, Dimensions, Platform } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  useEffect(() => {
    const boot = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        const profileDone = await AsyncStorage.getItem("hasCompletedProfileSetup");

        setTimeout(() => {
          if (!seen) {
            router.replace("/onboarding");
            return;
          }
          if (!token) {
            router.replace("/login");
            return;
          }
          if (profileDone !== "true") {
            router.replace("/home-onboard");
            return;
          }
          router.replace("/(tabs)");
        }, 800);
      } catch (e) {
        console.log("Splash error:", e);
        router.replace("/login");
      }
    };
    boot();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Wrapper to control spacing responsively */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/diggg.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          source={require("../assets/animations/Loading-bar.json")}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.lottie}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2066D9",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    // Keeps logo centered but allows for flexible spacing
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // Moves the logo slightly up from center to account for the loading bar below
    marginBottom: -height * 0.05, 
  },
  logo: {
    // Width is 60% of screen width, height scales automatically via aspect ratio
    width: width * 0.6,
    maxWidth: 300, // Caps size on tablets/large screens
    height: undefined,
    aspectRatio: 2, // Matches your 240/120 original ratio
    resizeMode: "contain",
  },
  animationContainer: {
    width: '100%',
    height: height * 0.3, // Height is 30% of screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '80%', 
    height: '100%',
  },
});