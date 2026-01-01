// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   Alert,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import AppInput from "@/components/Input";
// import SecondaryButton from "@/components/SecondaryButton";
// import { fonts } from "@/constants/fonts";
// import { useLoginMutation } from "@/api/authApi";
// import { setAuthToken } from "@/utils/authToken";

// const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const [login, { isLoading }] = useLoginMutation();

//   const handleContinue = async () => {
//     setSubmitted(true);

//     if (!email || !password || password.length < 6) return;

//     try {
//       const res = await login({ email, password }).unwrap();

//       // ✅ Save token
//       await AsyncStorage.setItem("token", res.token);
//       setAuthToken(res.token);
//       await AsyncStorage.setItem("hasSeenOnboarding", "true");
//       await AsyncStorage.setItem("hasCompletedProfileSetup", "true");

//       // ✅ Navigate to app
//       router.replace("/(tabs)");
//     } catch (error: any) {
//       Alert.alert(
//         "Login Failed",
//         error?.data?.message || "Invalid credentials"
//       );
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <SafeAreaView style={styles.container}>
//         {/* TOP */}
//         <View style={styles.topSection}>
//           <View style={styles.logoContainer}>
//             <Image
//               source={require("../assets/images/digg-b.png")}
//               style={styles.logo}
//             />
//           </View>

//           <View style={styles.textContainer}>
//             <Text style={styles.title}>Login to your Digg account</Text>
//             <Text style={styles.subtitle}>
//               Welcome back digger! Digg is better with community.
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <AppInput
//               label="Email"
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               error={
//                 submitted && !email
//                   ? "Email is required"
//                   : submitted && !email.includes("@")
//                   ? "Enter a valid email"
//                   : ""
//               }
//             />

//             <AppInput
//               label="Password"
//               placeholder="Enter password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               error={
//                 submitted && password.length < 6
//                   ? "Password must be at least 6 characters"
//                   : ""
//               }
//             />
//           </View>
//         </View>

//         {/* BOTTOM */}
//         <View style={styles.bottomSection}>
//           <SecondaryButton
//             title={isLoading ? "Logging in..." : "Login"}
//             loading={isLoading}
//             onPress={handleContinue}
//           />

//           <View style={styles.loginRow}>
//             <Text style={styles.loginText}>Don't have an account? </Text>
//             <Pressable onPress={() => router.push("/register")}>
//               <Text style={styles.loginLink}>Signup</Text>
//             </Pressable>
//           </View>
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//   },

//   /* TOP */
//   topSection: {
//     flex: 1,
//   },

//   logoContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 30,
//   },

//   logo: {
//     width: 110,
//     height: 60,
//     resizeMode: "contain",
//   },

//   textContainer: {
//     marginBottom: 25,
//   },

//   title: {
//     fontSize: 27,
//     fontFamily: fonts.bold,
//     color: "#000",
//   },

//   subtitle: {
//     fontSize: 19,
//     color: "#818A98",
//     marginTop: 7,
//     fontFamily: fonts.regular,
//   },

//   form: {
//     marginTop: 10,
//   },

//   /* BOTTOM */
//   bottomSection: {
//     paddingBottom: 57,
//   },

//   loginRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 14,
//   },

//   loginText: {
//     fontSize: 19,
//     color: "#6B7280",
//     fontFamily: fonts.regular,
//   },

//   loginLink: {
//     fontSize: 19,
//     color: "#2563EB",
//     fontFamily: fonts.bold,
//     marginLeft: 2,
//     textDecorationLine: "underline",
//   },
// });

import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppInput from "@/components/Input";
import SecondaryButton from "@/components/SecondaryButton";
import { fonts } from "@/constants/fonts";
import { useLoginMutation } from "@/api/authApi";
import { setAuthToken } from "@/utils/authToken";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleContinue = async () => {
    setSubmitted(true);
    if (!email || !password || password.length < 6) return;

    try {
      const res = await login({ email, password }).unwrap();

      await AsyncStorage.setItem("token", res.token);
      setAuthToken(res.token);
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      await AsyncStorage.setItem("hasCompletedProfileSetup", "true");

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    // Outer wrapper set to white prevents the grey gap when keyboard opens
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={undefined} on Android avoids the "grey void" resize bug
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/digg-b.png")}
                style={styles.logo}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Login to your Digg account</Text>
              <Text style={styles.subtitle}>
                Welcome back digger! Digg is better with community.
              </Text>
            </View>

            <View style={styles.form}>
              <AppInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                error={
                  submitted && !email
                    ? "Email is required"
                    : submitted && !email.includes("@")
                    ? "Enter a valid email"
                    : ""
                }
              />

              <AppInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={
                  submitted && password.length < 6
                    ? "Password must be at least 6 characters"
                    : ""
                }
              />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <SecondaryButton
              title={isLoading ? "Logging in..." : "Login"}
              loading={isLoading}
              onPress={handleContinue}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.loginLink}>Signup</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.06,
  },
  topSection: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.04,
  },
  logo: {
    width: width * 0.28,
    height: undefined,
    aspectRatio: 1.83,
    resizeMode: "contain",
  },
  textContainer: {
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.068,
    fontFamily: fonts.bold,
    color: "#000",
    lineHeight: width * 0.085,
  },
  subtitle: {
    fontSize: width * 0.046,
    color: "#818A98",
    marginTop: 8,
    fontFamily: fonts.regular,
    lineHeight: width * 0.06,
  },
  form: {
    marginTop: height * 0.01,
  },
  bottomSection: {
    paddingBottom: height * 0.04,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: width * 0.045,
    color: "#6B7280",
    fontFamily: fonts.regular,
  },
  loginLink: {
    fontSize: width * 0.045,
    color: "#2563EB",
    fontFamily: fonts.bold,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
});