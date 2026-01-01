// import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
// import React from "react";
// import LottieView from "lottie-react-native";
// import { fonts } from "@/constants/fonts";

// type Props = {
//   title: string;
//   onPress: () => void;
//   loading?: boolean;
//   variant?: "primary" | "outline";
// };

// const SecondaryButton = ({
//   title,
//   onPress,
//   loading = false,
//   variant = "primary",
// }: Props) => {
//   return (
//     <Pressable
//       style={[styles.button, variant === "outline" && styles.outlineButton]}
//       onPress={onPress}
//       disabled={loading}
//     >
//       {loading ? (
//         // <ActivityIndicator color={variant === "outline" ? "#1DA1F2" : "#fff"} />
//         <LottieView
//           source={require("../assets/animations/loading_grayy.json")}
//           autoPlay
//           loop
//           style={styles.animation}
//         />
//       ) : (
//         <Text
//           style={[styles.text, variant === "outline" && styles.outlineText]}
//         >
//           {title}
//         </Text>
//       )}
//     </Pressable>
//   );
// };

// export default SecondaryButton;

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: 15,
//     paddingHorizontal: 28,
//     backgroundColor: "#2265D7",
//     borderColor: "#2265D7",
//     borderWidth: 1.8,
//     borderRadius: 999,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "600",
//     fontFamily: fonts.regular,
//   },
//   outlineButton: {
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: "#1DA1F2",
//   },
//   outlineText: {
//     color: "#1DA1F2",
//   },
//   animation: {
//     width: 27,
//     height: 27,
//   },
// });


import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { fonts } from "@/constants/fonts";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
  style?: ViewStyle; // Added for external layout flexibility
};

const SecondaryButton = ({
  title,
  onPress,
  loading = false,
  variant = "primary",
  style,
}: Props) => {
  return (
    <Pressable
      // Added pressed state logic for a more responsive "feel" 
      // without changing your actual dimensions.
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.outlineButton,
        pressed && !loading && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <LottieView
          source={require("../assets/animations/loading_grayy.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      ) : (
        <Text
          style={[styles.text, variant === "outline" && styles.outlineText]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15, // Kept original
    paddingHorizontal: 28,
    backgroundColor: "#2265D7",
    borderColor: "#2265D7",
    borderWidth: 1.8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 56, // Ensures the button stays the same height when Lottie replaces text
  },
  text: {
    color: "#fff",
    fontSize: 20, // Kept original
    fontWeight: "600",
    fontFamily: fonts.regular,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1DA1F2",
  },
  outlineText: {
    color: "#1DA1F2",
  },
  animation: {
    width: 27, // Kept original
    height: 27,
  },
  // Added responsive feedback: subtle opacity change when pressed
  pressed: {
    opacity: 0.85,
  },
});