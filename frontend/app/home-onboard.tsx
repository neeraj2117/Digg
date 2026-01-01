// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   Alert,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import AppInput from "@/components/Input";
// import SecondaryButton from "@/components/SecondaryButton";
// import { fonts } from "@/constants/fonts";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location"; // 👈 Import Location
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useUpdateProfileMutation } from "@/api/userApi";

// const HomeOnboardScreen = () => {
//   const [username, setUsername] = useState("");
//   const [image, setImage] = useState<string | undefined>(undefined);
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [bio, setBio] = useState("");

//   // Location States
//   const [city, setCity] = useState<string | null>(null);
//   const [state, setState] = useState<string | null>(null);
//   const [country, setCountry] = useState<string | null>(null);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [updateProfile] = useUpdateProfileMutation();

//   const MAX_LENGTH = 30;

//   // 1. Fetch Location on Mount
//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   const getUsernameError = () => {
//     if (!submitted) return "";
//     if (!username) return "Username is required";
//     return "";
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       base64: true,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
//     }
//   };

//   const getUserLocation = async () => {
//     try {
//       setLocationLoading(true);
//       // Request permission
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "We need location access to show you local news in your area."
//         );
//         return;
//       }

//       // Get Coordinates
//       let location = await Location.getCurrentPositionAsync({});

//       // Reverse Geocode (Coords -> Address)
//       let address = await Location.reverseGeocodeAsync({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       if (address.length > 0) {
//         const item = address[0];
//         setCity(item.city || item.district || null);
//         setState(item.region || null);
//         setCountry(item.country || null);
//       }
//     } catch (error) {
//       console.log("Error fetching location", error);
//     } finally {
//       setLocationLoading(false);
//     }
//   };

//   const handleContinue = async () => {
//     setSubmitted(true);
//     if (!username) return;

//     try {
//       setLoading(true);

//       // 2. Pass Location data to your API
//       await updateProfile({
//         username,
//         bio,
//         image,
//         city, // 👈 Added to payload
//         state, // 👈 Added to payload
//         country, // 👈 Added to payload
//       }).unwrap();

//       await AsyncStorage.setItem("hasCompletedProfileSetup", "true");
//       router.replace("/(tabs)");
//     } catch (error) {
//       console.log("Profile update failed", error);
//       Alert.alert("Error", "Something went wrong while updating your profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <SafeAreaView style={styles.container}>
//         <View style={styles.logoContainer}>
//           <Image
//             source={require("../assets/images/digg-b.png")}
//             style={styles.logo}
//           />
//         </View>

//         <View style={styles.textContainer}>
//           <Text style={styles.title}>Complete your profile</Text>
//           <Text style={styles.subtitle}>
//             Now's your chance to be who you want to be. Fresh start and all.
//           </Text>
//         </View>

//         {/* Profile Picker */}
//         <Pressable style={styles.avatarWrapper} onPress={pickImage}>
//           {image ? (
//             <Image source={{ uri: image }} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarText}>+</Text>
//             </View>
//           )}
//           <Text style={styles.changeText}>Add photo</Text>
//         </Pressable>

//         <View style={styles.form}>
//           <AppInput
//             label="Username"
//             value={username}
//             onChangeText={setUsername}
//             maxLength={MAX_LENGTH}
//           />

//           <AppInput label="Bio" value={bio} onChangeText={setBio} multiline />

//           {/* Location Feedback UI */}
//           <View style={styles.locationContainer}>
//             <Text style={styles.locationLabel}>Your Local Area:</Text>
//             {locationLoading ? (
//               <Text style={styles.locationValue}>Detecting location...</Text>
//             ) : city ? (
//               <View style={styles.locationRow}>
//                 <View style={styles.locationInfo}>
//                   {/* Displaying your GIF here */}
//                   <Image
//                     source={require("../assets/animations/loc.gif")}
//                     style={styles.locationGif}
//                   />
//                   <Text style={styles.locationValue}>
//                     {city}, {state}
//                   </Text>
//                 </View>
//                 <Pressable onPress={getUserLocation}>
//                   <Text style={styles.retryText}>Refresh</Text>
//                 </Pressable>
//               </View>
//             ) : (
//               <Text style={styles.locationError}>Location not detected</Text>
//             )}
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <SecondaryButton
//             title={loading ? "Please wait..." : "Setup Complete"}
//             loading={loading}
//             onPress={handleContinue}
//           />
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// export default HomeOnboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },

//   logoContainer: {
//     alignItems: "center",
//     marginTop: -5,
//     marginBottom: 40,
//   },

//   logo: {
//     width: 110,
//     height: 60,
//     resizeMode: "contain",
//   },

//   textContainer: {
//     marginBottom: 30,
//   },

//   title: {
//     fontSize: 27,
//     fontWeight: "600",
//     color: "#000",
//     fontFamily: fonts.bold,
//   },

//   subtitle: {
//     fontSize: 20,
//     width: "90%",
//     color: "#818A98",
//     letterSpacing: 0.3,
//     marginTop: 12,
//     fontFamily: fonts.regular,
//   },

//   form: {
//     marginTop: 10,
//   },

//   error: {
//     color: "#DC2626",
//     marginTop: 8,
//     fontSize: 14,
//   },

//   counterRow: {
//     alignItems: "flex-end",
//     marginBottom: -16,
//   },

//   counterText: {
//     fontFamily: fonts.regular,
//     fontSize: 15,
//     marginRight: 4,
//     color: "#6B7280",
//   },

//   buttonContainer: {
//     marginTop: "auto",
//     marginBottom: 70,
//   },

//   keyboardButton: {
//     marginBottom: 10,
//   },

//   avatarWrapper: {
//     alignItems: "center",
//     marginBottom: 24,
//   },

//   avatar: {
//     width: 140,
//     height: 140,
//     borderRadius: 75,
//   },

//   avatarPlaceholder: {
//     width: 140,
//     height: 140,
//     borderRadius: 75,
//     backgroundColor: "#E5E7EB",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   avatarText: {
//     fontSize: 50,
//     color: "#6B7280",
//     fontFamily: fonts.light,
//   },

//   changeText: {
//     marginTop: 8,
//     fontSize: 17,
//     color: "#1DA1F2",
//     fontFamily: fonts.regular,
//   },

//   locationContainer: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   locationLabel: {
//     fontSize: 14,
//     fontFamily: fonts.bold,
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   locationRow: {
//     flexDirection: "row",
//     justifyContent: "space-between", // Pushes text to left and Refresh to right
//     alignItems: "center",
//     marginTop: 8,
//   },
//   locationInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6, // Space between GIF and City text
//   },
//   locationGif: {
//     width: 24,  // Adjust based on your GIF's dimensions
//     height: 24,
//     resizeMode: "contain",
//     marginBottom: 4,
//   },
//   locationValue: {
//     fontSize: 16,
//     fontFamily: fonts.regular,
//     color: "#111827",
//   },
//   locationError: {
//     fontSize: 16,
//     color: "#EF4444",
//     fontFamily: fonts.regular,
//   },
//   retryText: {
//     color: "#1DA1F2",
//     fontFamily: fonts.regular,
//     fontSize: 15,
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
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AppInput from "@/components/Input";
import SecondaryButton from "@/components/SecondaryButton";
import { fonts } from "@/constants/fonts";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUpdateProfileMutation } from "@/api/userApi";

const HomeOnboardScreen = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");

  // Location States
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [updateProfile] = useUpdateProfileMutation();

  const MAX_LENGTH = 30;

  // Fetch Location on Mount
  useEffect(() => {
    let isMounted = true;
    getUserLocation(isMounted);
    return () => { isMounted = false; };
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "We need access to your photos to upload a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const getUserLocation = async (isMounted = true) => {
    try {
      if (isMounted) setLocationLoading(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return; // Silently fail or handled by the "Location not detected" UI state
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (isMounted && address.length > 0) {
        const item = address[0];
        setCity(item.city || item.district || null);
        setState(item.region || null);
        setCountry(item.country || null);
      }
    } catch (error) {
      console.log("Error fetching location", error);
    } finally {
      if (isMounted) setLocationLoading(false);
    }
  };

  const handleContinue = async () => {
    setSubmitted(true);
    if (!username.trim()) {
        Alert.alert("Validation", "Please enter a username to continue.");
        return;
    }

    try {
      setLoading(true);

      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        image,
        city,
        state,
        country,
      }).unwrap();

      await AsyncStorage.setItem("hasCompletedProfileSetup", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Profile update failed", error);
      Alert.alert("Error", "Something went wrong while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.logoContainer}>
            <Image
                source={require("../assets/images/digg-b.png")}
                style={styles.logo}
            />
            </View>

            <View style={styles.textContainer}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
                Now's your chance to be who you want to be. Fresh start and all.
            </Text>
            </View>

            <Pressable style={styles.avatarWrapper} onPress={pickImage}>
            {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>+</Text>
                </View>
            )}
            <Text style={styles.changeText}>Add photo</Text>
            </Pressable>

            <View style={styles.form}>
            <AppInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                maxLength={MAX_LENGTH}
            />

            <AppInput label="Bio" value={bio} onChangeText={setBio} multiline />

            <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>Your Local Area:</Text>
                {locationLoading ? (
                <Text style={styles.locationValue}>Detecting location...</Text>
                ) : city ? (
                <View style={styles.locationRow}>
                    <View style={styles.locationInfo}>
                    <Image
                        source={require("../assets/animations/loc.gif")}
                        style={styles.locationGif}
                    />
                    <Text style={styles.locationValue}>
                        {city}, {state}
                    </Text>
                    </View>
                    <Pressable onPress={() => getUserLocation()}>
                    <Text style={styles.retryText}>Refresh</Text>
                    </Pressable>
                </View>
                ) : (
                <View style={styles.locationRow}>
                     <Text style={styles.locationError}>Location not detected</Text>
                     <Pressable onPress={() => getUserLocation()}>
                        <Text style={styles.retryText}>Try Again</Text>
                    </Pressable>
                </View>
                )}
            </View>
            </View>

            <View style={styles.buttonContainer}>
            <SecondaryButton
                title={loading ? "Please wait..." : "Setup Complete"}
                loading={loading}
                onPress={handleContinue}
            />
            </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default HomeOnboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -5,
    marginBottom: 40,
  },
  logo: {
    width: 110,
    height: 60,
    resizeMode: "contain",
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 27,
    fontWeight: "600",
    color: "#000",
    fontFamily: fonts.bold,
  },
  subtitle: {
    fontSize: 20,
    width: "90%",
    color: "#818A98",
    letterSpacing: 0.3,
    marginTop: 12,
    fontFamily: fonts.regular,
  },
  form: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingTop: 20,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 75,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 50,
    color: "#6B7280",
    fontFamily: fonts.light,
  },
  changeText: {
    marginTop: 8,
    fontSize: 17,
    color: "#1DA1F2",
    fontFamily: fonts.regular,
  },
  locationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: "#6B7280",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationGif: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: "#111827",
  },
  locationError: {
    fontSize: 16,
    color: "#EF4444",
    fontFamily: fonts.regular,
  },
  retryText: {
    color: "#1DA1F2",
    fontFamily: fonts.regular,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});