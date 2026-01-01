// import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
// import React from "react";
// import { fonts } from "@/constants/fonts";

// type Props = {
//   title: string;
//   onPress: () => void;
//   loading?: boolean;
//   variant?: "primary" | "outline";
// };

// const AppButton = ({
//   title,
//   onPress,
//   loading = false,
//   variant = "primary",
// }: Props) => {
//   return (
//     <Pressable
//       style={[
//         styles.button,
//         variant === "outline" && styles.outlineButton,
//       ]}
//       onPress={onPress}
//       disabled={loading}
//     >
//       {loading ? (
//         <ActivityIndicator color={variant === "outline" ? "#1DA1F2" : "#fff"} />
//       ) : (
//         <Text
//           style={[
//             styles.text,
//             variant === "outline" && styles.outlineText,
//           ]}
//         >
//           {title}
//         </Text>
//       )}
//     </Pressable>
//   );
// };

// export default AppButton;

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: 16,
//     paddingHorizontal: 28,
//     borderColor: "#fff",
//     borderWidth: 1.8,
//     borderRadius: 999, 
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 21,
//     fontFamily: fonts.regular,    
//     fontWeight: "600",
//   },
//   outlineButton: {
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: "#1DA1F2",
//   },
//   outlineText: {
//     color: "#1DA1F2",
//   },
// });


import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import React from "react";
import { fonts } from "@/constants/fonts";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
  style?: ViewStyle; // Added to allow layout flexibility if needed
};

const AppButton = ({
  title,
  onPress,
  loading = false,
  variant = "primary",
  style,
}: Props) => {
  return (
    <Pressable
      // Added a pressed state for better touch feedback
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.outlineButton,
        pressed && styles.pressed, 
        style,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#1DA1F2" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "outline" && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderColor: "#fff",
    borderWidth: 1.8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // Ensuring the button height is consistent across devices
    minHeight: 58, 
  },
  text: {
    color: "#fff",
    // Slightly adjusted font size for better fit on narrow screens
    fontSize: 20, 
    fontFamily: fonts.bold, // Switched to bold for better legibility on high-res screens
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1DA1F2",
  },
  outlineText: {
    color: "#1DA1F2",
  },
  // This provides the "responsive" feel when the user actually taps the button
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }], // Subtle "press in" effect
  },
});