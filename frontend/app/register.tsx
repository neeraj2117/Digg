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
import { useRegisterMutation } from "@/api/authApi";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    setSubmitted(true);
    if (!email || !isValidEmail(email)) return;
    if (!password || password.length < 6) return;

    try {
      const res = await register({ email, password }).unwrap();
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      await AsyncStorage.setItem("hasCompletedProfileSetup", "false");
      router.replace("/home-onboard");
    } catch (error: any) {
      Alert.alert("Registration Failed", error?.data?.message || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* TOP */}
        <View style={styles.topSection}>
          <View style={styles.navRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
            </Pressable>
            
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/digg-b.png")}
                style={styles.logo}
              />
            </View>
            {/* Empty view for spacing if needed */}
            <View style={{ width: 40 }} /> 
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Create a new account</Text>
            <Text style={styles.subtitle}>Digg is better with community.</Text>
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
                  : submitted && !isValidEmail(email)
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

        {/* BOTTOM */}
        <View style={styles.bottomSection}>
          <SecondaryButton
            title={isLoading ? "Creating account..." : "Sign Up"}
            loading={isLoading}
            onPress={handleContinue}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already a digger? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05, // 5% of screen width
  },

  topSection: {
    flex: 1,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
    marginBottom: height * 0.03,
  },

  logoContainer: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    width: width * 0.28, // Responsive width
    height: undefined,
    aspectRatio: 1.83, // Maintains original 110/60 ratio
    resizeMode: "contain",
  },

  textContainer: {
    marginBottom: height * 0.03,
  },

  title: {
    fontSize: width * 0.065, // Responsive font size
    fontFamily: fonts.bold,
    color: "#000",
  },

  subtitle: {
    fontSize: width * 0.045,
    color: "#818A98",
    marginTop: 4,
    fontFamily: fonts.regular,
  },

  form: {
    marginTop: height * 0.01,
  },

  bottomSection: {
    paddingBottom: height * 0.05, // Responsive bottom padding
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
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
  
  backButton: {
    padding: 2,
    marginLeft: -6,
    zIndex: 10,
  },
});