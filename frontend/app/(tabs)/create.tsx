// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   ScrollView,
//   Pressable,
//   Modal,
//   Platform,
// } from "react-native";
// import { useState, useRef, useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { fonts } from "@/constants/fonts";
// import { useGetMeQuery } from "@/api/userApi";
// import { ActivityIndicator } from "react-native";
// import { useCreatePostMutation } from "@/api/postApi";
// import { router } from "expo-router";
// import * as Location from "expo-location";

// const CATEGORIES = [
//   "Trending",
//   "Tech",
//   "Science",
//   "Gaming",
//   "News",
//   "Funny",
//   "Memes",
//   "Programming",
//   "AI & ML",
//   "Startups",
//   "Design",
//   "Photography",
//   "Movies",
//   "Music",
//   "Health",
//   "Travel",
//   "Food",
//   "Finance",
//   "Career",
//   "Random",
// ];

// export default function CreatePost() {
//   const [title, setTitle] = useState("");
//   const titleRef = useRef<TextInput>(null);
//   const [description, setDescription] = useState("");
//   const [audience, setAudience] = useState("");
//   const [images, setImages] = useState<string[]>([]);
//   const [showAudience, setShowAudience] = useState(false);
//   const [search, setSearch] = useState("");

//   const { data, isLoading, isError } = useGetMeQuery();
//   const [createPost, { isLoading: posting }] = useCreatePostMutation();

//   useEffect(() => {
//     setTimeout(() => {
//       titleRef.current?.focus();
//     }, 300);
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Failed to load profile</Text>
//       </View>
//     );
//   }

//   const user = data;

//   const isPostDisabled = !title || !description || !audience;

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setAudience("");
//     setImages([]);
//     setSearch("");
//   };

//   const pickMedia = async () => {
//     if (images.length >= 5) return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsMultipleSelection: true,
//       selectionLimit: 5 - images.length,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImages([...images, ...result.assets.map((a) => a.uri)]);
//     }
//   };

//   // 2. New: Take Photo with Camera
//   const takePhoto = async () => {
//     if (images.length >= 5) return;

//     // Request camera permissions
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       alert("Sorry, we need camera permissions to make this work!");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImages([...images, result.assets[0].uri]);
//     }
//   };

//   const removeImage = (uri: string) => {
//     setImages(images.filter((img) => img !== uri));
//   };

//   const handlePost = async () => {
//     if (!title || !description || !audience) return;

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", audience);

//     // ✅ Fetch and attach the full location footprint from the user profile
//     if (user) {
//       formData.append("city", user.city || "");
//       formData.append("state", user.state || "");
//       formData.append("country", user.country || "");

//       // Since we are tagging it with their profile location,
//       // we set isLocal to true so the backend knows this is a location-based post.
//       formData.append("isLocal", "true");
//     }

//     images.forEach((uri, index) => {
//       const fileName = uri.split("/").pop() || `file_${index}.jpg`;
//       const ext = fileName.split(".").pop()?.toLowerCase();
//       const isVideo = ["mp4", "mov", "avi"].includes(ext || "");

//       formData.append("images", {
//         uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
//         name: fileName,
//         type: isVideo ? "video/mp4" : "image/jpeg",
//       } as any);
//     });

//     try {
//       await createPost(formData).unwrap();
//       resetForm();
//       alert("Post created successfully!");
//       router.back();
//     } catch (err: any) {
//       console.error("POST ERROR:", err);
//       alert(err?.data?.message || "Failed to create post");
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <View style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={resetForm}>
//             <Text style={styles.cancel}>Cancel</Text>
//           </TouchableOpacity>

//           <View style={styles.headerRight}>
//             <Image
//               source={require("../../assets/images/settings.png")}
//               style={{ height: 19, width: 19 }}
//             />

//             <TouchableOpacity
//               disabled={isPostDisabled || posting}
//               onPress={handlePost}
//               style={[
//                 styles.postBtn,
//                 { opacity: isPostDisabled || posting ? 0.4 : 1 },
//               ]}
//             >
//               {posting ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.postText}>Post</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           {/* PROFILE + AUDIENCE */}
//           <View style={styles.topRow}>
//             <Image
//               source={
//                 user.profilePic
//                   ? { uri: user.profilePic }
//                   : require("../../assets/images/profile.png")
//               }
//               style={styles.profilePic}
//             />

//             <Ionicons
//               name="chevron-forward"
//               size={18}
//               color="#777"
//               style={{ marginRight: 6 }}
//             />

//             <TouchableOpacity
//               style={styles.audienceBox}
//               onPress={() => setShowAudience(!showAudience)}
//             >
//               <Text style={styles.audienceText}>
//                 {audience || "Choose an audience"}
//               </Text>
//               <Ionicons name="chevron-down" size={18} />
//             </TouchableOpacity>

//             {/* BOTTOM SHEET */}
//             <Modal
//               transparent
//               visible={showAudience}
//               animationType="slide"
//               onRequestClose={() => setShowAudience(false)}
//             >
//               <Pressable
//                 style={styles.overlay}
//                 onPress={() => setShowAudience(false)}
//               />

//               <View style={styles.sheet}>
//                 {/* Header */}
//                 <View style={styles.sheetHeader}>
//                   <Text style={styles.sheetTitle}>Choose Audience</Text>
//                   <TouchableOpacity onPress={() => setShowAudience(false)}>
//                     <Ionicons name="close" size={22} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Search */}
//                 <View style={styles.searchBox}>
//                   <Ionicons
//                     name="search"
//                     size={18}
//                     style={{ marginRight: 2, marginLeft: 5 }}
//                     color="#888"
//                   />
//                   <TextInput
//                     placeholder="Search category..."
//                     value={search}
//                     onChangeText={setSearch}
//                     style={styles.searchInput}
//                   />
//                 </View>

//                 {/* Category List */}
//                 <ScrollView>
//                   {CATEGORIES.filter((item) =>
//                     item.toLowerCase().includes(search.toLowerCase())
//                   ).map((item, index, array) => (
//                     <TouchableOpacity
//                       key={item}
//                       style={[
//                         styles.sheetItem,
//                         index === array.length - 1 && { borderBottomWidth: 0 },
//                       ]}
//                       onPress={() => {
//                         setAudience(item);
//                         setShowAudience(false);
//                       }}
//                     >
//                       <Text style={styles.sheetItemText}>{item}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             </Modal>
//           </View>

//           <TextInput
//             ref={titleRef}
//             placeholder="Give this post a title"
//             placeholderTextColor="#9CA3AF"
//             value={title}
//             onChangeText={setTitle}
//             style={styles.titleInput}
//           />

//           {/* DESCRIPTION */}
//           <TextInput
//             placeholder="What do you want to share with Digg?"
//             placeholderTextColor="#9CA3AF"
//             value={description}
//             onChangeText={setDescription}
//             style={styles.descInput}
//             multiline
//           />

//           <View style={{ marginTop: 10, paddingLeft: 4 }}>
//             <Text
//               style={{ fontSize: 15, letterSpacing: .2, color: "#777", fontFamily: fonts.regular }}
//             >
//               <Image
//                 source={require("../../assets/animations/loc.gif")}
//                 style={styles.locationGif}
//               />{"  "}
//               Posting from{" "}
//               <Text style={{ fontFamily: fonts.bold, fontSize: 15, }}>
//                 {user.city || "Global"}
//               </Text>
//             </Text>
//           </View>

//           {/* MEDIA ACTIONS */}
//           <View style={styles.mediaActionsRow}>
//             <TouchableOpacity style={styles.mediaIconBtn} onPress={takePhoto}>
//               <Ionicons name="camera-outline" size={24} color="#2563EB" />
//               <Text style={styles.mediaIconText}>Camera</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.mediaIconBtn} onPress={pickMedia}>
//               <Ionicons name="images-outline" size={24} color="#2563EB" />
//               <Text style={styles.mediaIconText}>Library</Text>
//             </TouchableOpacity>
//           </View>

//           {/* IMAGE GRID */}
//           <View style={styles.imageGrid}>
//             {images.map((uri) => (
//               <View key={uri} style={styles.imageWrapper}>
//                 <Image source={{ uri }} style={styles.image} />
//                 {/* Show video icon if it's a video file */}
//                 {(uri.endsWith(".mp4") || uri.endsWith(".mov")) && (
//                   <View style={styles.videoOverlay}>
//                     <Ionicons name="play-circle" size={40} color="white" />
//                   </View>
//                 )}
//                 <TouchableOpacity
//                   style={styles.removeIcon}
//                   onPress={() => removeImage(uri)}
//                 >
//                   <Ionicons name="close" size={16} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     backgroundColor: "#fff",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//   },

//   headerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 20,
//   },

//   titleInput: {
//     marginTop: 18,
//     fontSize: 30,
//     paddingBottom: 5,
//     fontFamily: fonts.bold,
//   },

//   descInput: {
//     fontSize: 19,
//     fontFamily: fonts.regular,
//     minHeight: 55,
//     color: "#5b5a5a",
//     lineHeight: 25,
//   },

//   cancel: {
//     fontSize: 19,
//     fontFamily: fonts.regular,
//     color: "#666",
//   },

//   postBtn: {
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 24,
//     paddingVertical: 9,
//     borderRadius: 20,
//   },

//   postText: {
//     color: "#fff",
//     fontSize: 19,
//     fontFamily: fonts.bold,
//   },

//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 2,
//     marginTop: 7,
//   },

//   profilePic: {
//     width: 43,
//     height: 43,
//     borderRadius: 21,
//   },

//   audienceBox: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 14,
//     borderRadius: 30,
//   },

//   audienceText: {
//     fontFamily: fonts.regular,
//     fontSize: 18,
//   },

//   dropdown: {
//     position: "absolute",
//     top: 115,
//     left: 16,
//     right: 16,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#eee",
//     zIndex: 10,
//     elevation: 1,
//   },

//   dropdownItem: {
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },

//   dropdownText: {
//     fontFamily: fonts.regular,
//     fontSize: 17,
//   },

//   uploadBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 100,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#F9FAFB",
//   },

//   uploadText: {
//     marginLeft: 15,
//     letterSpacing: 0.3,
//     fontFamily: fonts.regular,
//     fontSize: 18,
//     color: "#2563EB",
//   },

//   mediaActionsRow: {
//     flexDirection: "row",
//     gap: 15,
//     marginTop: 90,
//   },

//   mediaIconBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#F9FAFB",
//   },

//   mediaIconText: {
//     fontFamily: fonts.regular,
//     fontSize: 17,
//     color: "#2563EB",
//   },

//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 18,
//     gap: 10,
//     marginBottom: 80,
//   },

//   imageWrapper: {
//     width: "48%",
//     height: 140,
//     borderRadius: 12,
//     overflow: "hidden",
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//   },

//   removeIcon: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     borderRadius: 12,
//     padding: 4,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },

//   sheet: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 18,
//     paddingVertical: 20,
//     maxHeight: "80%",
//   },

//   sheetHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   sheetTitle: {
//     fontSize: 22,
//     marginTop: 5,
//     fontFamily: fonts.bold,
//   },

//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     paddingHorizontal: 8,
//     borderRadius: 10,
//     marginBottom: 12,
//   },

//   searchInput: {
//     flex: 1,
//     paddingVertical: 14,
//     fontFamily: fonts.regular,
//     paddingLeft: 10,
//     fontSize: 20,
//   },

//   sheetItem: {
//     paddingVertical: 17,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },

//   sheetItemText: {
//     fontSize: 19,
//     fontFamily: fonts.regular,
//   },

//   videoOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   locationGif: {
//     width: 15, // Adjust based on your GIF's dimensions
//     height: 15,
//     resizeMode: "contain",
//     marginBottom: 4,
//     marginRight: 5,
//   },
// });
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Modal,
  Platform,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "@/constants/fonts";
import { useGetMeQuery } from "@/api/userApi";
import { useCreatePostMutation } from "@/api/postApi";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const CATEGORIES = [
  "Trending", "Tech", "Science", "Gaming", "News", "Funny", "Memes", 
  "Programming", "AI & ML", "Startups", "Design", "Photography", 
  "Movies", "Music", "Health", "Travel", "Food", "Finance", 
  "Career", "Random",
];

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const titleRef = useRef<TextInput>(null);
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showAudience, setShowAudience] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetMeQuery();
  const [createPost, { isLoading: posting }] = useCreatePostMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text style={{ fontFamily: fonts.regular }}>Failed to load profile</Text>
      </View>
    );
  }

  const user = data;
  const isPostDisabled = !title || !description || !audience;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAudience("");
    setImages([]);
    setSearch("");
  };

  const pickMedia = async () => {
    if (images.length >= 5) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (uri: string) => {
    setImages(images.filter((img) => img !== uri));
  };

  const handlePost = async () => {
    if (isPostDisabled) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", audience);

    if (user) {
      formData.append("city", user.city || "");
      formData.append("state", user.state || "");
      formData.append("country", user.country || "");
      formData.append("isLocal", "true");
    }

    images.forEach((uri, index) => {
      const fileName = uri.split("/").pop() || `file_${index}.jpg`;
      const ext = fileName.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "mov", "avi"].includes(ext || "");

      formData.append("images", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: fileName,
        type: isVideo ? "video/mp4" : "image/jpeg",
      } as any);
    });

    try {
      await createPost(formData).unwrap();
      resetForm();
      alert("Post created successfully!");
      router.back();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create post");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <View style={styles.headerRight}>
                <Image
                  source={require("../../assets/images/settings.png")}
                  style={styles.settingsIcon}
                />
                <TouchableOpacity
                  disabled={isPostDisabled || posting}
                  onPress={handlePost}
                  style={[
                    styles.postBtn,
                    { opacity: isPostDisabled || posting ? 0.4 : 1 },
                  ]}
                >
                  {posting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.postText}>Post</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* PROFILE + AUDIENCE */}
              <View style={styles.topRow}>
                <Image
                  source={user.profilePic ? { uri: user.profilePic } : require("../../assets/images/profile.png")}
                  style={styles.profilePic}
                />
                <Ionicons name="chevron-forward" size={18} color="#777" style={{ marginHorizontal: 4 }} />
                <TouchableOpacity
                  style={styles.audienceBox}
                  onPress={() => setShowAudience(true)}
                >
                  <Text style={styles.audienceText} numberOfLines={1}>
                    {audience || "Choose an audience"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} />
                </TouchableOpacity>
              </View>

              <TextInput
                ref={titleRef}
                placeholder="Give this post a title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
              />

              <TextInput
                placeholder="What do you want to share with Digg?"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                style={styles.descInput}
                multiline
              />

              <View style={styles.locationContainer}>
                <Image
                  source={require("../../assets/animations/loc.gif")}
                  style={styles.locationGif}
                />
                <Text style={styles.locationText}>
                  {" "}Posting from{" "}
                  <Text style={{ fontFamily: fonts.bold }}>
                    {user.city || "Global"}
                  </Text>
                </Text>
              </View>

              {/* MEDIA ACTIONS */}
              <View style={styles.mediaActionsRow}>
                <TouchableOpacity style={styles.mediaIconBtn} onPress={takePhoto}>
                  <Ionicons name="camera-outline" size={width * 0.05} color="#2563EB" />
                  <Text style={styles.mediaIconText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaIconBtn} onPress={pickMedia}>
                  <Ionicons name="images-outline" size={width * 0.043} color="#2563EB" />
                  <Text style={styles.mediaIconText}>Library</Text>
                </TouchableOpacity>
              </View>

              {/* IMAGE GRID */}
              <View style={styles.imageGrid}>
                {images.map((uri) => (
                  <View key={uri} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.image} />
                    {(uri.endsWith(".mp4") || uri.endsWith(".mov")) && (
                      <View style={styles.videoOverlay}>
                        <Ionicons name="play-circle" size={40} color="white" />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => removeImage(uri)}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* CATEGORY MODAL */}
      <Modal
        transparent
        visible={showAudience}
        animationType="slide"
        onRequestClose={() => setShowAudience(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowAudience(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Choose Audience</Text>
            <TouchableOpacity onPress={() => setShowAudience(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetSearchBox}>
            <Ionicons name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder="Search category..."
              value={search}
              onChangeText={setSearch}
              style={styles.sheetSearchInput}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {CATEGORIES.filter((item) =>
              item.toLowerCase().includes(search.toLowerCase())
            ).map((item, index, array) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.sheetItem,
                  index === array.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  setAudience(item);
                  setShowAudience(false);
                }}
              >
                <Text style={styles.sheetItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.015,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.05,
  },
  settingsIcon: {
    height: width * 0.05,
    width: width * 0.05,
    resizeMode: "contain",
  },
  cancel: {
    fontSize: width * 0.045,
    fontFamily: fonts.regular,
    color: "#666",
  },
  postBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    borderRadius: 20,
  },
  postText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontFamily: fonts.bold,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  profilePic: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
  },
  audienceBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    borderRadius: 30,
  },
  audienceText: {
    fontFamily: fonts.regular,
    fontSize: width * 0.042,
    maxWidth: '80%',
  },
  titleInput: {
    fontSize: width * 0.075,
    fontFamily: fonts.bold,
    color: "#000",
    marginBottom: 8,
  },
  descInput: {
    fontSize: width * 0.048,
    fontFamily: fonts.regular,
    minHeight: height * 0.05,
    color: "#5b5a5a",
    lineHeight: width * 0.065,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  locationGif: {
    width: 19,
    height: 19,
    resizeMode: "contain",
  },
  locationText: {
    fontSize: width * 0.038,
    color: "#777",
    fontFamily: fonts.regular,
    // marginLeft: 2,
  },
  mediaActionsRow: {
    flexDirection: "row",
    gap: width * 0.03,
    marginTop: height * 0.01,
  },
  mediaIconBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: height * 0.010,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  mediaIconText: {
    fontFamily: fonts.regular,
    fontSize: width * 0.038,
    color: "#2563EB",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: width * 0.03,
  },
  imageWrapper: {
    width: (width * 0.92 - (width * 0.03)) / 2, // Responsive grid calc
    height: height * 0.18,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: width * 0.055,
    fontFamily: fonts.bold,
  },
  sheetSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sheetSearchInput: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontFamily: fonts.regular,
    fontSize: width * 0.045,
    paddingLeft: 10,
  },
  sheetItem: {
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sheetItemText: {
    fontSize: width * 0.045,
    fontFamily: fonts.regular,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});