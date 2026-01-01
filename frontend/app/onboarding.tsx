// import { Image, StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import AppButton from "@/components/Button";
// import LottieView from "lottie-react-native";
// import { router, useNavigation } from "expo-router";
// import { fonts } from "@/constants/fonts";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const OnboardingScreen = () => {
//   return (
//     <LinearGradient
//       colors={["#2066D9", "#1A4FC2", "#1B0E84"]}
//       locations={[0, 0.5, 1]}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }}>
//         {/* TOP: Logo */}
//         <View style={styles.top}>
//           <Image
//             source={require("../assets/images/diggg.png")}
//             style={styles.logo}
//           />
//         </View>

//         {/* CENTER: Animation + Text */}
//         <View style={styles.center}>
//           <LottieView
//             source={require("../assets/animations/onboard.json")}
//             autoPlay
//             loop
//             style={styles.animation}
//           />

//           <Text style={styles.title}>Digg what you love.</Text>
//           <Text style={styles.subtitle}>Discover what's next.</Text>
//         </View>

//         {/* BOTTOM: Button */}
//         <View style={styles.bottom}>
//           <AppButton
//             title="Sign Up"
//             onPress={async () => {
//               await AsyncStorage.setItem("hasSeenIntro", "true");
//               router.replace("/login");
//             }}
//           />
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default OnboardingScreen;

// const styles = StyleSheet.create({
//   top: {
//     height: 110,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   logo: {
//     width: 130,
//     height: 70,
//     resizeMode: "contain",
//   },

//   center: {
//     flex: 0.9,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   animation: {
//     width: 470,
//     height: 300,
//     marginBottom: 20,
//   },

//   title: {
//     fontSize: 44,
//     fontFamily: fonts.bold,
//     color: "#fff",
//     textAlign: "center",
//   },

//   subtitle: {
//     fontSize: 45,
//     fontFamily: fonts.regular,
//     color: "#B7D8EA",
//     textAlign: "center",
//     marginTop: 2,
//   },

//   bottom: {
//     paddingHorizontal: 24,
//     paddingBottom: 70,
//   },
// });


import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AppButton from "@/components/Button";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { fonts } from "@/constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get screen dimensions for responsive scaling
const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const handleOnboardComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenIntro", "true");
      router.replace("/login");
    } catch (e) {
      console.log("Error saving intro status", e);
    }
  };

  return (
    <LinearGradient
      colors={["#2066D9", "#1A4FC2", "#1B0E84"]}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* TOP: Logo */}
        <View style={styles.top}>
          <Image
            source={require("../assets/images/diggg.png")}
            style={styles.logo}
          />
        </View>

        {/* CENTER: Animation + Text */}
        <View style={styles.center}>
          <LottieView
            source={require("../assets/animations/onboard.json")}
            autoPlay
            loop
            style={styles.animation}
          />

          <View style={styles.textWrapper}>
            <Text style={styles.title}>Digg what you love.</Text>
            <Text style={styles.subtitle}>Discover what's next.</Text>
          </View>
        </View>

        {/* BOTTOM: Button */}
        <View style={styles.bottom}>
          <AppButton
            title="Sign Up"
            onPress={handleOnboardComplete}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  top: {
    // Uses a fixed height but stays relative to the top
    height: height * 0.12, 
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 130,
    height: 70,
    resizeMode: "contain",
  },

  center: {
    flex: 1, // Takes up remaining space between top and bottom
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  animation: {
    // Width is constrained to screen width to prevent horizontal overflow
    width: width * 1.1, 
    height: height * 0.35,
    marginBottom: 20,
  },

  textWrapper: {
    alignItems: "center",
  },

  title: {
    // Scales slightly based on screen width for responsiveness
    fontSize: width > 400 ? 44 : 38,
    fontFamily: fonts.bold,
    color: "#fff",
    textAlign: "center",
    lineHeight: 50,
  },

  subtitle: {
    fontSize: width > 400 ? 45 : 39,
    fontFamily: fonts.regular,
    color: "#B7D8EA",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 50,
  },

  bottom: {
    paddingHorizontal: 24,
    // Spacing from bottom adjusted for different screen heights
    paddingBottom: height * 0.08, 
  },
});