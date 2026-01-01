// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { useState, useRef, useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { fonts } from "@/constants/fonts";
// import { router } from "expo-router";
// import { useSearchUsersQuery } from "@/api/userApi";
// import LottieView from "lottie-react-native";

// export default function ExploreScreen() {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const searchRef = useRef<TextInput>(null);

//   // 1. Debounce logic: Only trigger API call after user stops typing for 500ms
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 300);
//     return () => clearTimeout(handler);
//   }, [search]);

//   // 2. Fetch real users based on search (or empty string for initial load)
//   // We limit to 5 if the search is empty as per your requirement
//   const { data, isLoading } = useSearchUsersQuery(debouncedSearch);

//   const users = data?.users || [];
//   const displayUsers = debouncedSearch === "" ? users.slice(0, 5) : users;

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       searchRef.current?.focus();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <View style={styles.container}>
//         {/* SEARCH BAR */}
//         <View style={styles.searchRow}>
//           <View style={styles.searchBox}>
//             <Ionicons
//               name="search"
//               size={19}
//               style={{ marginLeft: 3 }}
//               color="#777"
//             />
//             <TextInput
//               ref={searchRef}
//               value={search}
//               onChangeText={setSearch}
//               placeholder="Search by username"
//               placeholderTextColor="#888"
//               style={styles.searchInput}
//             />
//             {search.length > 0 && (
//               <TouchableOpacity onPress={() => setSearch("")}>
//                 <Ionicons name="close-circle" size={24} color="#999" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <TouchableOpacity onPress={() => setSearch("")}>
//             <Text style={styles.cancel}>Cancel</Text>
//           </TouchableOpacity>
//         </View>

//         {/* PEOPLE TAB */}
//         <View style={styles.tabRow}>
//           <View style={styles.activeTab}>
//             <Text style={styles.activeTabText}>People</Text>
//           </View>
//         </View>

//         {/* LIST SECTION */}
//         {isLoading ? (
//           <ActivityIndicator
//             size="large"
//             color="#205BC1"
//             style={{ marginTop: 20 }}
//           />
//         ) : (
//           <FlatList
//             data={displayUsers}
//             keyExtractor={(item) => item._id}
//             ListEmptyComponent={
//               <View style={{ alignItems: "center", marginTop: 20 }}>
//                 <LottieView
//                   source={require("../../assets/animations/empty-ghost.json")}
//                   autoPlay
//                   loop
//                   resizeMode="contain"
//                   style={{ width: "50%", height: 300 }}
//                 />
//                 <Text style={[styles.emptyText, { marginTop: -60 }]}>
//                   No users found
//                 </Text>
//               </View>
//             }
//             renderItem={({ item, index }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.userRow,
//                   index === displayUsers.length - 1 && { borderBottomWidth: 0 },
//                 ]}
//                 onPress={() =>
//                   router.push({
//                     pathname: "/any-user-profile",
//                     params: { userId: item._id },
//                   })
//                 } // Navigate to user profile
//               >
//                 <Image
//                   source={
//                     item.profilePic
//                       ? { uri: item.profilePic }
//                       : require("../../assets/images/profile.png")
//                   }
//                   style={styles.avatar}
//                 />
//                 <View>
//                   <Text style={styles.username}>@{item.username}</Text>
//                   <Text style={styles.bio}>
//                     {item.bio || "No bio available"}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingHorizontal: 16 },
//   searchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//     gap: 10,
//   },
//   searchBox: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f8f6f6ff",
//     paddingHorizontal: 12,
//     paddingVertical: 3,
//     borderWidth: 0.05,
//     borderRadius: 12,
//     gap: 9,
//   },
//   searchInput: { flex: 1, fontSize: 20, fontFamily: fonts.regular },
//   cancel: { fontSize: 18, fontFamily: fonts.regular, color: "#333" },
//   tabRow: { marginTop: 16, marginBottom: 5 },
//   activeTab: {
//     backgroundColor: "#205BC1",
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     borderRadius: 20,
//     alignSelf: "flex-start",
//   },
//   activeTabText: { color: "#fff", fontSize: 18, fontFamily: fonts.regular },
//   userRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   avatar: { width: 42, height: 42, borderRadius: 22, marginRight: 10 },
//   username: { fontSize: 19, fontFamily: fonts.bold },
//   bio: { fontSize: 16, color: "#666", fontFamily: fonts.regular, marginTop: 4 },
//   emptyText: {
//     textAlign: "center",
//     fontSize: 20,
//     color: "#888",
//     fontFamily: fonts.regular,
//   },
// });
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "@/constants/fonts";
import { router } from "expo-router";
import { useSearchUsersQuery } from "@/api/userApi";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useSearchUsersQuery(debouncedSearch);

  const users = data?.users || [];
  const displayUsers = debouncedSearch === "" ? users.slice(0, 5) : users;

  useEffect(() => {
    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {/* SEARCH BAR */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons
                  name="search"
                  size={width * 0.05}
                  style={{ marginLeft: 3 }}
                  color="#777"
                />
                <TextInput
                  ref={searchRef}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by username"
                  placeholderTextColor="#888"
                  style={styles.searchInput}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch("")}>
                    <Ionicons name="close-circle" size={width * 0.06} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* PEOPLE TAB */}
            <View style={styles.tabRow}>
              <View style={styles.activeTab}>
                <Text style={styles.activeTabText}>People</Text>
              </View>
            </View>

            {/* LIST SECTION */}
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#205BC1"
                style={{ marginTop: 20 }}
              />
            ) : (
              <FlatList
                data={displayUsers}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <LottieView
                      source={require("../../assets/animations/empty-ghost.json")}
                      autoPlay
                      loop
                      resizeMode="contain"
                      style={styles.lottie}
                    />
                    <Text style={styles.emptyText}>
                      No users found
                    </Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.userRow,
                      index === displayUsers.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/any-user-profile",
                        params: { userId: item._id },
                      })
                    }
                  >
                    <Image
                      source={
                        item.profilePic
                          ? { uri: item.profilePic }
                          : require("../../assets/images/profile.png")
                      }
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.username}>@{item.username}</Text>
                      <Text style={styles.bio} numberOfLines={1}>
                        {item.bio || "No bio available"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: width * 0.04 
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
    gap: width * 0.03,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f6f6ff",
    paddingHorizontal: width * 0.03,
    height: height * 0.055, // Responsive height
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 12,
    gap: 9,
  },
  searchInput: { 
    flex: 1, 
    fontSize: width * 0.045, 
    fontFamily: fonts.regular,
    height: '100%' 
  },
  cancel: { 
    fontSize: width * 0.042, 
    fontFamily: fonts.regular, 
    color: "#333" 
  },
  tabRow: { 
    marginTop: height * 0.02, 
    marginBottom: height * 0.01 
  },
  activeTab: {
    backgroundColor: "#205BC1",
    paddingHorizontal: width * 0.045,
    paddingVertical: height * 0.01,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  activeTabText: { 
    color: "#fff", 
    fontSize: width * 0.042, 
    fontFamily: fonts.regular 
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.018,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { 
    width: width * 0.12, 
    height: width * 0.12, 
    borderRadius: (width * 0.12) / 2, 
    marginRight: 12 
  },
  username: { 
    fontSize: width * 0.045, 
    fontFamily: fonts.bold 
  },
  bio: { 
    fontSize: width * 0.038, 
    color: "#666", 
    fontFamily: fonts.regular, 
    marginTop: 2 
  },
  emptyContainer: { 
    alignItems: "center", 
    marginTop: height * 0.05 
  },
  lottie: { 
    width: width * 0.6, 
    height: width * 0.6 
  },
  emptyText: {
    textAlign: "center",
    fontSize: width * 0.045,
    color: "#888",
    fontFamily: fonts.regular,
    marginTop: -height * 0.04,
  },
});