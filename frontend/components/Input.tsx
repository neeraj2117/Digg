// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TextInputProps,
// } from "react-native";
// import React, { useState } from "react";
// import { fonts } from "@/constants/fonts";

// type Props = TextInputProps & {
//   label?: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   error?: string;
// };

// const AppInput = ({ label, value, onChangeText, error, ...props }: Props) => {
//   const [focused, setFocused] = useState(false);

//   return (
//     <View style={styles.wrapper}>
//       {/* Label */}
//       {label && <Text style={styles.label}>{label}</Text>}

//       {/* Input */}
//       <View
//         style={[
//           styles.container,
//           focused && styles.focusedBorder,
//           error && styles.errorBorder,
//         ]}
//       >
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           style={styles.input}
//           placeholderTextColor="#6B7280"
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           {...props}
//         />
//       </View>

//       {/* Error Message */}
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//     </View>
//   );
// };

// export default AppInput;

// const styles = StyleSheet.create({
//   wrapper: {
//     marginBottom: 18,
//   },

//   label: {
//     fontSize: 16,
//     color: "#374151",
//     marginBottom: 4,
//     marginLeft: 6,
//     fontFamily: fonts.regular,
//   },

//   container: {
//     width: "100%",
//     borderWidth: 1.5,
//     borderColor: "#E5E7EB",
//     borderRadius: 9999,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     backgroundColor: "#fff",
//   },

//   focusedBorder: {
//     borderColor: "#1DA1F2",
//   },

//   errorBorder: {
//     borderColor: "#EF4444",
//   },

//   input: {
//     fontSize: 19,
//     fontWeight: "300",
//     color: "#000",
//     fontFamily: fonts.regular,
//   },

//   errorText: {
//     marginTop: 4,
//     fontFamily: fonts.regular,
//     marginLeft: 8,
//     fontSize: 16,
//     color: "#EF4444",
//   },
// });


import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from "react-native";
import React, { useState } from "react";
import { fonts } from "@/constants/fonts";

type Props = TextInputProps & {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

const AppInput = ({ label, value, onChangeText, error, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input */}
      <View
        style={[
          styles.container,
          focused && styles.focusedBorder,
          error && styles.errorBorder,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholderTextColor="#6B7280"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // These props prevent annoying auto-fixes for things like usernames
          autoCapitalize="none"
          autoCorrect={false}
          // Ensures the cursor color matches your brand blue
          selectionColor="#1DA1F2"
          {...props}
        />
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 16, // Kept original
    color: "#374151",
    marginBottom: 4,
    marginLeft: 6,
    fontFamily: fonts.regular,
  },

  container: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6, // Kept original
    backgroundColor: "#fff",
  },

  focusedBorder: {
    borderColor: "#1DA1F2",
  },

  errorBorder: {
    borderColor: "#EF4444",
  },

  input: {
    fontSize: 19, // Kept original
    fontWeight: "300",
    color: "#000",
    fontFamily: fonts.regular,
    // Added for multiline stability without changing look
    textAlignVertical: "center", 
  },

  errorText: {
    marginTop: 4,
    fontFamily: fonts.regular,
    marginLeft: 8,
    fontSize: 16,
    color: "#EF4444",
  },
});