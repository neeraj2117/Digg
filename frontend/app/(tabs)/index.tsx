// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   TextInput,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useEffect, useState, useRef } from "react";
// import { fonts } from "@/constants/fonts";
// import PostCard from "@/components/PostCard";
// import ExpandedPostCard from "@/components/ExpandedPostCard";
// import NewsPostCard from "@/components/NewsPostCard";
// import { useRouter } from "expo-router";
// import {
//   useDeletePostMutation,
//   useDislikePostMutation,
//   useGetFeedQuery,
//   useLikePostMutation,
// } from "@/api/postApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useGetMeQuery } from "@/api/userApi";
// import LottieView from "lottie-react-native";
// import RBSheet from "react-native-raw-bottom-sheet";
// import { Ionicons } from "@expo/vector-icons";

// export default function HomeScreen() {
//   const router = useRouter();

//   // --- UI State ---
//   const [active, setActive] = useState("Trending");
//   const [isGridView, setIsGridView] = useState(true);
//   const [isLocalMode, setIsLocalMode] = useState(false);
//   const [ready, setReady] = useState(false);
//   const refRBSheet = useRef<any>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [customLocation, setCustomLocation] = useState<{
//     city: string;
//     state: string;
//   } | null>(null);
//   const [activeLocation, setActiveLocation] = useState<string | null>(null);

//   // --- API Hooks ---
//   const [likePost] = useLikePostMutation();
//   const [dislikePost] = useDislikePostMutation();
//   const [deletePost] = useDeletePostMutation();
//   const { data: me } = useGetMeQuery();
//   const myUserId = me?._id;

//   // --- Fetching Logic (Reactive to Category & Location) ---
//   const { data, isLoading, isFetching } = useGetFeedQuery(
//     {
//       category: active,
//       // If local mode is on, use searched location OR user's home city
//       location: isLocalMode ? activeLocation || String(me?.city) : undefined,
//     },
//     { skip: !ready, refetchOnMountOrArgChange: true }
//   );

//   // --- Function to handle the search ---
//   const handleSearchLocation = () => {
//     if (searchQuery.trim()) {
//       setActiveLocation(searchQuery.trim());
//       setIsLocalMode(true);
//       refRBSheet.current.close();
//       setSearchQuery("");
//     }
//   };

//   // --- Authentication Check ---
//   useEffect(() => {
//     const init = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         router.replace("/login");
//         return;
//       }
//       setReady(true);
//     };
//     init();
//   }, []);

//   const posts = data?.posts || [];

//   // --- Utility Functions ---
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const handleLike = async (postId: string) => {
//     try {
//       await likePost(postId).unwrap();
//     } catch (err) {
//       console.log("Like failed", err);
//     }
//   };

//   const handleDislike = async (postId: string) => {
//     try {
//       await dislikePost(postId).unwrap();
//     } catch (err) {
//       console.log("Dislike failed", err);
//     }
//   };

//   const handleDelete = async (postId: string) => {
//     try {
//       await deletePost(postId).unwrap();
//     } catch (err) {
//       console.log("Delete failed", err);
//     }
//   };

//   const openPostActions = (postId: string, isOwner: boolean) => {
//     if (!isOwner) {
//       Alert.alert("Options", "Choose an action", [
//         { text: "Report Post", style: "destructive" },
//         { text: "Cancel", style: "cancel" },
//       ]);
//       return;
//     }
//     Alert.alert("Delete Post", "Are you sure you want to remove this?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => handleDelete(postId),
//       },
//     ]);
//   };

//   // Update the badge text dynamically
//   const badgeText = isLocalMode
//     ? `In ${activeLocation || me?.city || "Your Area"}`
//     : "All Posts";

//   // --- Loading State ---
//   if (isLoading && !isLocalMode) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <LottieView
//           source={require("../../assets/animations/loading_blue.json")}
//           autoPlay
//           loop
//           style={{ width: 40, height: 40 }}
//         />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 14 }}
//         ListHeaderComponent={
//           <>
//             {/* 1. CATEGORY TABS */}
//             <View style={styles.header}>
//               <Image
//                 source={require("../../assets/images/more.png")}
//                 style={styles.menuIcon}
//               />
//               <FlatList
//                 data={[
//                   "Trending",
//                   "Tech",
//                   "Science",
//                   "Gaming",
//                   "News",
//                   "Funny",
//                   "Memes",
//                   "Programming",
//                   "AI & ML",
//                   "Startups",
//                 ]}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 keyExtractor={(item) => item}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     onPress={() => setActive(item)}
//                     style={[
//                       styles.categoryPill,
//                       active === item && styles.categoryPillActive,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.categoryText,
//                         active === item && styles.categoryTextActive,
//                       ]}
//                     >
//                       {item}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>

//             {/* 2. TOP STORY ROW */}
//             <FlatList
//               data={posts.slice(0, 4)}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               keyExtractor={(item) => `horiz-${item._id}`}
//               renderItem={({ item }) => (
//                 <PostCard
//                   title={item.title}
//                   tag={item.category}
//                   votes={item.likes?.length || 0}
//                   avatar={item.user?.profilePic}
//                   likesCount={item.likes?.length || 0}
//                   onPress={() =>
//                     router.push({
//                       pathname: "/post-details",
//                       params: {
//                         id: item._id,
//                         title: item.title,
//                         description: item.description,
//                         images: JSON.stringify(item.images || []),
//                         category: item.category,
//                         authorName: item.user?.username,
//                         authorAvatar: item.user?.profilePic,
//                         createdAt: item.createdAt,
//                         likesCount: item.likes?.length || 0,
//                       },
//                     })
//                   }
//                   onLike={() => handleLike(item._id)}
//                 />
//               )}
//             />

//             {/* 3. FEED CONTROLS (THE MOST IMPORTANT PART) */}
//             <View style={styles.feedHeader}>
//               <View
//                 style={[styles.feedBadge, isLocalMode && styles.feedBadgeLocal]}
//               >
//                 {/* <Text style={styles.feedText}>
//                   {badgeText}
//                 </Text> */}
//                 <Text style={styles.feedText}>
//                   {isLocalMode
//                     ? `In ${activeLocation || me?.city || "Local"}`
//                     : "All Posts"}
//                 </Text>
//               </View>

//               <View style={styles.rightActions}>
//                 {/* Location Chip */}
//                 <View
//                   style={[
//                     styles.locationChip,
//                     isLocalMode && styles.locationChipActive,
//                   ]}
//                 >
//                   {/* Part 1: The Toggle Area (Icon + Text) */}
//                   <TouchableOpacity
//                     style={styles.locationToggleArea}
//                     onPress={() => setIsLocalMode(!isLocalMode)}
//                   >
//                     <Ionicons
//                       name="location"
//                       size={16}
//                       color={isLocalMode ? "#fff" : "#555"}
//                     />
//                     <Text
//                       style={[
//                         styles.locationChipText,
//                         isLocalMode && { color: "#fff" },
//                       ]}
//                     >
//                       {isLocalMode ? "Local" : "Near Me"}
//                     </Text>
//                   </TouchableOpacity>

//                   {/* Part 2: The Separator Line (Subtle Visual) */}
//                   <View
//                     style={[
//                       styles.chipSeparator,
//                       isLocalMode && {
//                         backgroundColor: "rgba(255,255,255,0.3)",
//                       },
//                     ]}
//                   />

//                   {/* Part 3: The Dropdown Icon Area (Open Sheet) */}
//                   <TouchableOpacity
//                     style={styles.dropdownIconArea}
//                     onPress={() => refRBSheet.current.open()}
//                     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Makes it much easier to click
//                   >
//                     <Ionicons
//                       name="chevron-down"
//                       size={16}
//                       color={isLocalMode ? "#fff" : "#555"}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {/* View Toggle */}
//                 <TouchableOpacity
//                   style={styles.iconContainer}
//                   onPress={() => setIsGridView(!isGridView)}
//                 >
//                   <Image
//                     source={
//                       isGridView
//                         ? require("../../assets/images/row.png")
//                         : require("../../assets/images/row1.png")
//                     }
//                     style={styles.filterIcon}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </>
//         }
//         renderItem={({ item, index }) => {
//           const isLiked = item.likes?.some(
//             (l: any) => (typeof l === "string" ? l : l._id) === myUserId
//           );
//           const isDisliked = item.dislikes?.some(
//             (d: any) => (typeof d === "string" ? d : d._id) === myUserId
//           );

//           // Common navigation and action logic
//           const handleProfileNavigation = () => {
//             if (item.user?._id === myUserId) {
//               router.push("/profile");
//             } else {
//               router.push({
//                 pathname: "/any-user-profile",
//                 params: { userId: item.user?._id },
//               });
//             }
//           };

//           const commonProps = {
//             onLike: () => handleLike(item._id),
//             onDislike: () => handleDislike(item._id),
//             onMorePress: () =>
//               openPostActions(item._id, item.user?._id === myUserId),
//             onPress: () =>
//               router.push({
//                 pathname: "/post-details",
//                 params: {
//                   id: item._id,
//                   title: item.title,
//                   description: item.description,
//                   images: JSON.stringify(item.images || []),
//                   category: item.category,
//                   authorName: item.user?.username,
//                   authorAvatar: item.user?.profilePic,
//                   createdAt: item.createdAt,
//                   likesCount: item.likes?.length || 0,
//                 },
//               }),
//             onUserPress: handleProfileNavigation, // ✅ Added to commonProps
//             userId: item.user?._id, // ✅ Added to commonProps
//             isLiked,
//             isDisliked,
//             isLast: index === posts.length - 1,
//           };

//           return isGridView ? (
//             <NewsPostCard
//               {...commonProps}
//               category={item.category}
//               time={formatDate(item.createdAt)}
//               title={item.title}
//               description={item.description || ""}
//               image={item.images || []}
//               source="digg.it"
//               comments={item.comments?.length || 0}
//               votes={item.likes?.length || 0}
//               likesCount={item.likes?.length || 0}
//               dislikesCount={item.dislikes?.length || 0}
//               authorName={item.user?.username}
//               authorAvatar={{ uri: item.user?.profilePic }}
//               // Ensure NewsPostCard also uses handleProfileNavigation if implemented there
//             />
//           ) : (
//             <ExpandedPostCard
//               {...commonProps}
//               title={item.title}
//               headerTitle={item.category}
//               avatar={item.images}
//               votes={item.likes?.length || 0}
//               authorName={item.user?.username}
//               authorAvatar={{ uri: item.user?.profilePic }}
//               tag={item.category}
//               time={formatDate(item.createdAt)}
//               commentsCount={item.comments?.length || 0}
//             />
//           );
//         }}
//         ListFooterComponent={
//           <View style={styles.endSection}>
//             <Text style={styles.endTextBig}>MADE WITH LOVE ❤️</Text>
//             <Text style={styles.endTextBig}>keep digging.</Text>
//             <Text style={styles.copyright}>
//               © 2025 DIGG IT. ALL RIGHTS RESERVED.
//             </Text>
//           </View>
//         }
//       />

//       {/* 4. LOCATION SELECTION SHEET */}
//       <RBSheet
//         ref={refRBSheet}
//         height={450} // Increased height for search bar
//         openDuration={250}
//         customStyles={{
//           container: {
//             borderTopLeftRadius: 24,
//             borderTopRightRadius: 24,
//             padding: 24,
//           },
//         }}
//       >
//         <View style={{ flex: 1 }}>
//           <Text style={styles.sheetTitle}>Change Location</Text>
//           <Text style={styles.sheetSubtitle}>
//             Pick an area to see what's trending there.
//           </Text>

//           {/* NEW SEARCH BOX */}
//           <View style={styles.searchContainer}>
//             <Ionicons name="search" size={20} color="#999" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by city, state and country..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               onSubmitEditing={handleSearchLocation}
//               placeholderTextColor="#999"
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={handleSearchLocation}>
//                 <Text
//                   style={{
//                     color: "#2868D6",
//                     fontFamily: fonts.bold,
//                     fontSize: 17,
//                     textDecorationLine: "underline",
//                   }}
//                 >
//                   Go
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* OPTION: HOME CITY */}
//           <TouchableOpacity
//             style={styles.sheetOption}
//             onPress={() => {
//               setActiveLocation(null); // Reset to home
//               setIsLocalMode(true);
//               refRBSheet.current.close();
//             }}
//           >
//             <View style={styles.sheetIconBox}>
//               <Ionicons name="home" size={22} color="#2868D6" />
//             </View>
//             <View>
//               <Text style={styles.sheetOptionTitle}>My Home City</Text>
//               <Text style={styles.sheetOptionSub}>
//                 {me?.city}, {me?.state}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* SHOW CURRENT CUSTOM LOCATION IF EXISTS */}
//           {customLocation && (
//             <View style={[styles.sheetOption, { borderBottomWidth: 0 }]}>
//               <View
//                 style={[styles.sheetIconBox, { backgroundColor: "#16a34a20" }]}
//               >
//                 <Ionicons name="location" size={22} color="#16a34a" />
//               </View>
//               <View>
//                 <Text style={styles.sheetOptionTitle}>Viewing Custom Area</Text>
//                 <Text style={styles.sheetOptionSub}>{activeLocation}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </RBSheet>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   menuIcon: { width: 18, height: 18, marginRight: 15, resizeMode: "contain" },
//   categoryPill: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: "#F2F2F2",
//     marginRight: 13,
//   },
//   categoryPillActive: { backgroundColor: "#2868D6" },
//   categoryText: { fontSize: 16, fontFamily: fonts.regular, color: "#555" },
//   categoryTextActive: { color: "#fff", fontSize: 16, fontFamily: fonts.bold },

//   feedHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 5,
//   },
//   feedBadge: {
//     backgroundColor: "#2868D6",
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     borderRadius: 30,
//   },
//   feedBadgeLocal: { backgroundColor: "#16a34a" },
//   feedText: { fontSize: 17, color: "#fff", fontFamily: fonts.bold },

//   rightActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   locationChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F2F2F2",
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     overflow: "hidden", // Ensures background colors don't bleed
//   },
//   locationChipActive: {
//     backgroundColor: "#16a34a",
//     borderColor: "#16a34a",
//   },
//   locationToggleArea: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingLeft: 12,
//     // paddingRight: 1,
//     paddingVertical: 8,
//     gap: 4,
//   },
//   chipSeparator: {
//     width: 1,
//     height: "60%",
//     backgroundColor: "#ccc",
//   },
//   dropdownIconArea: {
//     paddingLeft: 8,
//     paddingRight: 12,
//     paddingVertical: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   locationChipText: {
//     fontSize: 16,
//     fontFamily: fonts.bold,
//     color: "#555",
//   },
//   iconContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 18,
//   },
//   filterIcon: { width: 17, height: 17, resizeMode: "contain" },

//   endSection: {
//     alignItems: "flex-start",
//     paddingVertical: 40,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     marginTop: 15,
//   },
//   endTextBig: {
//     fontSize: 48,
//     fontFamily: fonts.bold,
//     color: "#999",
//     letterSpacing: -1,
//     lineHeight: 55,
//   },
//   copyright: {
//     fontSize: 17,
//     fontFamily: fonts.regular,
//     color: "#999",
//     marginTop: 20,
//   },

//   // Sheet Styles
//   sheetTitle: {
//     fontSize: 24,
//     fontFamily: fonts.bold,
//     letterSpacing: 0.2,
//     color: "#111827",
//   },
//   sheetSubtitle: {
//     fontSize: 16,
//     color: "#6B7280",
//     marginBottom: 24,
//     fontFamily: fonts.regular,
//     marginTop: 4,
//     letterSpacing: 0.3,
//   },
//   sheetOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//     gap: 16,
//   },
//   sheetIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#EBF2FF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sheetOptionTitle: { fontSize: 18, fontFamily: fonts.bold, color: "#111827" },
//   sheetOptionSub: { fontSize: 15, color: "#6B7280", fontFamily: fonts.regular },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 15,
//     height: 47,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 7,
//     fontSize: 18,
//     fontFamily: fonts.regular,
//     letterSpacing: 0.2,
//     color: "#111827",
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { fonts } from "@/constants/fonts";
import PostCard from "@/components/PostCard";
import ExpandedPostCard from "@/components/ExpandedPostCard";
import NewsPostCard from "@/components/NewsPostCard";
import { useRouter } from "expo-router";
import {
  useDeletePostMutation,
  useDislikePostMutation,
  useGetFeedQuery,
  useLikePostMutation,
} from "@/api/postApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetMeQuery } from "@/api/userApi";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  // --- UI State ---
  const [active, setActive] = useState("Trending");
  const [isGridView, setIsGridView] = useState(true);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [ready, setReady] = useState(false);
  const refRBSheet = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customLocation, setCustomLocation] = useState<{
    city: string;
    state: string;
  } | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  // --- API Hooks ---
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: me } = useGetMeQuery();
  const myUserId = me?._id;

  // --- Fetching Logic (Reactive to Category & Location) ---
  const { data, isLoading, isFetching } = useGetFeedQuery(
    {
      category: active,
      location: isLocalMode ? activeLocation || String(me?.city) : undefined,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );

  // --- Function to handle the search ---
  const handleSearchLocation = () => {
    if (searchQuery.trim()) {
      setActiveLocation(searchQuery.trim());
      setIsLocalMode(true);
      refRBSheet.current.close();
      setSearchQuery("");
    }
  };

  // --- Authentication Check ---
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      setReady(true);
    };
    init();
  }, []);

  const posts = data?.posts || [];

  // --- Utility Functions ---
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId).unwrap();
    } catch (err) {
      console.log("Like failed", err);
    }
  };

  const handleDislike = async (postId: string) => {
    try {
      await dislikePost(postId).unwrap();
    } catch (err) {
      console.log("Dislike failed", err);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  const openPostActions = (postId: string, isOwner: boolean) => {
    if (!isOwner) {
      Alert.alert("Options", "Choose an action", [
        { text: "Report Post", style: "destructive" },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    Alert.alert("Delete Post", "Are you sure you want to remove this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(postId),
      },
    ]);
  };

  // --- Loading State ---
  if (isLoading && !isLocalMode) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LottieView
          source={require("../../assets/animations/loading_blue.json")}
          autoPlay
          loop
          style={{ width: width * 0.1, height: width * 0.1 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: height * 0.1,
          paddingHorizontal: width * 0.035,
        }}
        ListHeaderComponent={
          <>
            {/* 1. CATEGORY TABS */}
            <View style={styles.header}>
              <Image
                source={require("../../assets/images/more.png")}
                style={styles.menuIcon}
              />
              <FlatList
                data={[
                  "Trending",
                  "Tech",
                  "Science",
                  "Gaming",
                  "News",
                  "Funny",
                  "Memes",
                  "Programming",
                  "AI & ML",
                  "Startups",
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setActive(item)}
                    style={[
                      styles.categoryPill,
                      active === item && styles.categoryPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active === item && styles.categoryTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* 2. TOP STORY ROW */}
            <FlatList
              data={posts.slice(0, 4)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `horiz-${item._id}`}
              renderItem={({ item }) => (
                <PostCard
                  title={item.title}
                  tag={item.category}
                  votes={item.likes?.length || 0}
                  avatar={item.user?.profilePic}
                  likesCount={item.likes?.length || 0}
                  onPress={() =>
                    router.push({
                      pathname: "/post-details",
                      params: {
                        id: item._id,
                        title: item.title,
                        description: item.description,
                        images: JSON.stringify(item.images || []),
                        category: item.category,
                        authorName: item.user?.username,
                        authorAvatar: item.user?.profilePic,
                        createdAt: item.createdAt,
                        likesCount: item.likes?.length || 0,
                      },
                    })
                  }
                  onLike={() => handleLike(item._id)}
                />
              )}
            />

            {/* 3. FEED CONTROLS */}
            <View style={styles.feedHeader}>
              <View
                style={[styles.feedBadge, isLocalMode && styles.feedBadgeLocal]}
              >
                <Text style={styles.feedText}>
                  {isLocalMode
                    ? `In ${activeLocation || me?.city || "Local"}`
                    : "All Posts"}
                </Text>
              </View>

              <View style={styles.rightActions}>
                <View
                  style={[
                    styles.locationChip,
                    isLocalMode && styles.locationChipActive,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.locationToggleArea}
                    onPress={() => setIsLocalMode(!isLocalMode)}
                  >
                    <Ionicons
                      name="location"
                      size={width * 0.04}
                      color={isLocalMode ? "#fff" : "#555"}
                    />
                    <Text
                      style={[
                        styles.locationChipText,
                        isLocalMode && { color: "#fff" },
                      ]}
                    >
                      {isLocalMode ? "Local" : "Near Me"}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.chipSeparator,
                      isLocalMode && {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.dropdownIconArea}
                    onPress={() => refRBSheet.current.open()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={width * 0.04}
                      color={isLocalMode ? "#fff" : "#555"}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setIsGridView(!isGridView)}
                >
                  <Image
                    source={
                      isGridView
                        ? require("../../assets/images/row.png")
                        : require("../../assets/images/row1.png")
                    }
                    style={styles.filterIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          if (!item || !item.user) {
            return <View style={{ height: 10 }} />;
          }
          const isLiked = item.likes?.some(
            (l: any) => (typeof l === "string" ? l : l._id) === myUserId
          );
          const isDisliked = item.dislikes?.some(
            (d: any) => (typeof d === "string" ? d : d._id) === myUserId
          );

          const handleProfileNavigation = () => {
            if (item.user?._id === myUserId) {
              router.push("/profile");
            } else {
              router.push({
                pathname: "/any-user-profile",
                params: { userId: item.user?._id },
              });
            }
          };

          const commonProps = {
            onLike: () => handleLike(item._id),
            onDislike: () => handleDislike(item._id),
            onMorePress: () =>
              openPostActions(item._id, item.user?._id === myUserId),
            onPress: () =>
              router.push({
                pathname: "/post-details",
                params: {
                  id: item._id,
                  title: item.title,
                  description: item.description,
                  images: JSON.stringify(item.images || []),
                  category: item.category,
                  authorName: item.user?.username,
                  authorAvatar: item.user?.profilePic,
                  createdAt: item.createdAt,
                  likesCount: item.likes?.length || 0,
                },
              }),
            onUserPress: handleProfileNavigation,
            userId: item.user?._id,
            isLiked,
            isDisliked,
            isLast: index === posts.length - 1,
          };

          return isGridView ? (
            <NewsPostCard
              {...commonProps}
              category={item.category}
              time={formatDate(item.createdAt)}
              title={item.title}
              description={item.description || ""}
              image={item.images || []}
              source="digg.it"
              comments={item.comments?.length || 0}
              votes={item.likes?.length || 0}
              likesCount={item.likes?.length || 0}
              dislikesCount={item.dislikes?.length || 0}
              authorName={item.user?.username}
              authorAvatar={{ uri: item.user?.profilePic }}
            />
          ) : (
            <ExpandedPostCard
              {...commonProps}
              title={item.title}
              headerTitle={item.category}
              avatar={item.images}
              votes={item.likes?.length || 0}
              authorName={item.user?.username}
              authorAvatar={{ uri: item.user?.profilePic }}
              tag={item.category}
              time={formatDate(item.createdAt)}
              commentsCount={item.comments?.length || 0}
            />
          );
        }}
        ListFooterComponent={
          <View style={styles.endSection}>
            <Text style={styles.endTextBig}>MADE WITH LOVE <Ionicons name="heart" size={52} color="red" /></Text>
            <Text style={styles.endTextBig}>keep digging.</Text>
            <Text style={styles.copyright}>
              © 2025 DIGG IT. ALL RIGHTS RESERVED.
            </Text>
          </View>
        }
      />

      <RBSheet
        ref={refRBSheet}
        height={height * 0.55}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: width * 0.06,
          },
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.sheetTitle}>Change Location</Text>
          <Text style={styles.sheetSubtitle}>
            Pick an area to see what's trending there.
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={width * 0.05} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city, state and country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchLocation}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleSearchLocation}>
                <Text style={styles.goBtnText}>Go</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => {
              setActiveLocation(null);
              setIsLocalMode(true);
              refRBSheet.current.close();
            }}
          >
            <View style={styles.sheetIconBox}>
              <Ionicons name="home" size={width * 0.055} color="#2868D6" />
            </View>
            <View>
              <Text style={styles.sheetOptionTitle}>My Home City</Text>
              <Text style={styles.sheetOptionSub}>
                {me?.city}, {me?.state}
              </Text>
            </View>
          </TouchableOpacity>

          {customLocation && (
            <View style={[styles.sheetOption, { borderBottomWidth: 0 }]}>
              <View
                style={[styles.sheetIconBox, { backgroundColor: "#16a34a20" }]}
              >
                <Ionicons
                  name="location"
                  size={width * 0.055}
                  color="#16a34a"
                />
              </View>
              <View>
                <Text style={styles.sheetOptionTitle}>Viewing Custom Area</Text>
                <Text style={styles.sheetOptionSub}>{activeLocation}</Text>
              </View>
            </View>
          )}
        </View>
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.012,
    marginBottom: height * 0.012,
  },
  menuIcon: {
    width: width * 0.045,
    height: width * 0.045,
    marginRight: 15,
    resizeMode: "contain",
  },
  categoryPill: {
    paddingHorizontal: width * 0.04,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    marginRight: 13,
  },
  categoryPillActive: { backgroundColor: "#2868D6" },
  categoryText: {
    fontSize: width * 0.04,
    fontFamily: fonts.regular,
    color: "#555",
  },
  categoryTextActive: {
    color: "#fff",
    fontSize: width * 0.04,
    fontFamily: fonts.bold,
  },

  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.025,
    marginBottom: height * 0.006,
  },
  feedBadge: {
    backgroundColor: "#2868D6",
    paddingHorizontal: width * 0.045,
    paddingVertical: height * 0.011,
    borderRadius: 30,
  },
  feedBadgeLocal: { backgroundColor: "#16a34a" },
  feedText: { fontSize: width * 0.042, color: "#fff", fontFamily: fonts.bold },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  locationChipActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  locationToggleArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: width * 0.03,
    paddingVertical: 8,
    gap: 4,
  },
  chipSeparator: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
  dropdownIconArea: {
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  locationChipText: {
    fontSize: width * 0.038,
    fontFamily: fonts.bold,
    color: "#555",
  },
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
  },
  filterIcon: {
    width: width * 0.04,
    height: width * 0.04,
    resizeMode: "contain",
  },

  endSection: {
    alignItems: "flex-start",
    paddingVertical: height * 0.05,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 15,
  },
  endTextBig: {
    fontSize: width * 0.11,
    fontFamily: fonts.bold,
    color: "#999",
    letterSpacing: -1,
    lineHeight: width * 0.12,
  },
  copyright: {
    fontSize: width * 0.042,
    fontFamily: fonts.regular,
    color: "#999",
    marginTop: 20,
  },

  sheetTitle: {
    fontSize: width * 0.06,
    fontFamily: fonts.bold,
    color: "#111827",
  },
  sheetSubtitle: {
    fontSize: width * 0.04,
    color: "#6B7280",
    marginBottom: height * 0.03,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 16,
  },
  sheetIconBox: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: 12,
    backgroundColor: "#EBF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetOptionTitle: {
    fontSize: width * 0.045,
    fontFamily: fonts.bold,
    color: "#111827",
  },
  sheetOptionSub: {
    fontSize: width * 0.038,
    color: "#6B7280",
    fontFamily: fonts.regular,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: height * 0.06,
  },
  searchInput: {
    flex: 1,
    marginLeft: 7,
    fontSize: width * 0.045,
    fontFamily: fonts.regular,
    color: "#111827",
  },
  goBtnText: {
    color: "#2868D6",
    fontFamily: fonts.bold,
    fontSize: width * 0.042,
    textDecorationLine: "underline",
  },
});
