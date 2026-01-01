// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useGetMeQuery } from "@/api/userApi";
// import { useGetFeedQuery, useDeletePostMutation } from "@/api/postApi";
// import { router } from "expo-router";
// import { useDispatch } from "react-redux";
// import { api } from "@/api/api";
// import { fonts } from "@/constants/fonts";
// import { VideoView, useVideoPlayer, VideoSource } from "expo-video";

// const { width } = Dimensions.get("window");
// const MEDIA_WIDTH = width * 0.92;

// // --- Sub-component to handle Video Rendering inside the list ---
// const VideoItem = ({ uri }: { uri: string }) => {
//   const player = useVideoPlayer(uri, (player) => {
//     player.loop = true;
//     player.muted = true; // Muted by default for feed style
//     player.pause(); // Don't auto-play all videos in the list at once
//   });

//   return (
//     <VideoView
//       player={player}
//       style={styles.mediaContent}
//       nativeControls
//       contentFit="cover"
//     />
//   );
// };

// export default function ProfileScreen() {
//   const dispatch = useDispatch();

//   // 1. Get current logged-in user
//   const {
//     data: user,
//     isLoading: userLoading,
//     isError,
//   } = useGetMeQuery(undefined);

//   // 2. ONLY LOAD THIS USER'S POSTS (Pass userId to the API)
//   const { data: postsData, isLoading: postsLoading } = useGetFeedQuery(
//     { userId: user?._id },
//     { skip: !user?._id }
//   );
//   console.log("user id", user);

//   const [deletePost] = useDeletePostMutation();

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: async () => {
//           await AsyncStorage.multiRemove(["token"]);
//           dispatch(api.util.resetApiState());
//           router.replace("/login");
//         },
//       },
//     ]);
//   };

//   const confirmDelete = (postId: string) => {
//     Alert.alert("Delete Post", "Are you sure? This cannot be undone.", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await deletePost(postId).unwrap();
//           } catch (err) {
//             alert("Failed to delete post");
//           }
//         },
//       },
//     ]);
//   };

//   const renderMedia = ({ item: uri }: { item: string }) => {
//     const isVideo = uri.match(/\.(mp4|mov|m4v|avi)$/i);
//     return (
//       <View style={styles.mediaWrapper}>
//         {isVideo ? (
//           <VideoItem uri={uri} />
//         ) : (
//           <Image
//             source={{ uri }}
//             style={styles.mediaContent}
//             resizeMode="cover"
//           />
//         )}
//       </View>
//     );
//   };

//   if (userLoading)
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2563EB" />
//       </View>
//     );
//   if (isError || !user)
//     return (
//       <View style={styles.center}>
//         <Text>Failed to load profile</Text>
//       </View>
//     );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <Ionicons name="arrow-back" size={22} onPress={() => router.back()} />
//           <Text style={styles.username}>@{user.username}</Text>
//           <Ionicons name="ellipsis-horizontal" size={22} />
//         </View>

//         {/* PROFILE SECTION */}
//         <View style={styles.profileSection}>
//           <Image
//             source={
//               user.profilePic
//                 ? { uri: user.profilePic }
//                 : require("../../assets/images/profile.png")
//             }
//             style={styles.avatar}
//           />
//           <Text style={styles.name}>{user.username}</Text>
//           <View style={styles.joinRow}>
//             <Ionicons name="calendar-outline" size={14} color="#777" />
//             <Text style={styles.joinText}>
//               Joined {new Date(user.createdAt).toDateString()}
//             </Text>
//           </View>
//           <Text style={styles.bio}>{user.bio || "No bio added yet"}</Text>
//         </View>

//         {/* STATS */}
//         <View style={styles.followRow}>
//           <View style={styles.followBox}>
//             <Text style={styles.followCount}>
//               {user.followers?.length || 0}
//             </Text>
//             <Text style={styles.followLabel}>Followers</Text>
//           </View>
//           <View style={styles.followBox}>
//             <Text style={styles.followCount}>
//               {user.following?.length || 0}
//             </Text>
//             <Text style={styles.followLabel}>Following</Text>
//           </View>
//         </View>

//         {/* ACTIONS */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={styles.requestBtn}
//             onPress={() => router.push("/my-requests")}
//           >
//             <Ionicons name="people-outline" size={18} color="#2563EB" />
//             <Text style={styles.requestText}>My Requests</Text>
//             {(user as any).followRequests?.length > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>
//                   {(user as any).followRequests.length}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//             <Ionicons name="log-out-outline" size={18} color="#EF4444" />
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.divider} />

//         {/* MY POSTS BADGE */}
//         <View style={styles.postsBadgeContainer}>
//           <View style={styles.blueBadge}>
//             <Text style={styles.badgeTitle}>My Posts</Text>
//           </View>
//         </View>

//         {/* FEED LIST */}
//         <View style={styles.feedList}>
//           {postsLoading ? (
//             <ActivityIndicator style={{ marginTop: 20 }} color="#2563EB" />
//           ) : postsData?.posts?.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>
//                 You haven't posted anything yet.
//               </Text>
//             </View>
//           ) : (
//             (postsData?.posts || [])
//       .filter((post: any) => post.user?._id === user._id || post.user === user._id)
//       .map((post: any) => (
//         <View key={post._id} style={styles.postCard}>
//           <View style={styles.cardHeader}>
//             <View>
//               <Text style={styles.cardTitle}>{post.title}</Text>
//               <Text style={styles.cardDate}>
//                 {new Date(post.createdAt).toLocaleDateString()}
//               </Text>
//             </View>
//             <TouchableOpacity onPress={() => confirmDelete(post._id)}>
//               <Ionicons name="ellipsis-vertical" size={20} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* HORIZONTAL MEDIA CAROUSEL */}
//           <FlatList
//             data={post.images}
//             renderItem={renderMedia}
//             keyExtractor={(item, index) => `${post._id}-${index}`}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             snapToInterval={MEDIA_WIDTH + 12}
//             decelerationRate="fast"
//             contentContainerStyle={styles.carouselContent}
//           />

//           <View style={styles.cardFooter}>
//             <Text style={styles.cardDesc} numberOfLines={3}>
//               {post.description}
//             </Text>
//             <View style={styles.statsRow}>
//               <View style={styles.statGroup}>
//                 <Ionicons name="heart-outline" size={18} color="#444" />
//                 <Text style={styles.statNum}>{post.likes?.length || 0}</Text>
//               </View>
//               <View style={styles.statGroup}>
//                 <Ionicons name="chatbubble-outline" size={17} color="#444" />
//                 <Text style={styles.statNum}>{post.comments?.length || 0}</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       ))
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   username: { fontSize: 18, fontFamily: fonts.bold },
//   profileSection: { paddingHorizontal: 16, marginTop: 12 },
//   avatar: { width: 110, height: 105, borderRadius: 60, marginBottom: 10 },
//   name: { fontSize: 20, fontFamily: fonts.bold },
//   joinRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
//   joinText: { fontSize: 15, fontFamily: fonts.regular, color: "#777" },
//   bio: {
//     marginTop: 2,
//     fontSize: 17,
//     fontFamily: fonts.regular,
//     lineHeight: 22,
//   },
//   followRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 50,
//     marginTop: 15,
//   },
//   followBox: { alignItems: "center" },
//   followCount: { fontSize: 25, fontFamily: fonts.bold },
//   followLabel: { fontSize: 16, color: "#777" },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     paddingHorizontal: 16,
//   },
//   badge: {
//     backgroundColor: "#EF4444",
//     minWidth: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     right: -5,
//     top: -5,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   badgeText: { color: "#fff", fontSize: 11, fontFamily: fonts.bold },
//   requestBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#2563EB",
//     position: "relative",
//   },
//   requestText: { color: "#2563EB", fontSize: 17, fontFamily: fonts.bold },
//   logoutBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#EF4444",
//   },
//   logoutText: { color: "#EF4444", fontSize: 17, fontFamily: fonts.bold },

//   divider: { height: 1, backgroundColor: "#eee", width: "100%", marginTop: 25 },
//   postsBadgeContainer: {
//     paddingHorizontal: 16,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   blueBadge: {
//     backgroundColor: "#2563EB",
//     alignSelf: "flex-start",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   badgeTitle: { color: "#fff", fontFamily: fonts.bold, fontSize: 14 },

//   feedList: { paddingBottom: 100 },
//   postCard: {
//     marginBottom: 30,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     paddingBottom: 20,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   cardTitle: { fontSize: 18, fontFamily: fonts.bold },
//   cardDate: { fontSize: 12, color: "#999" },

//   carouselContent: { paddingLeft: 16, paddingRight: 4 },
//   mediaWrapper: {
//     width: MEDIA_WIDTH,
//     height: 280,
//     marginRight: 12,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "#000",
//   },
//   mediaContent: { width: "100%", height: "100%" },

//   cardFooter: { paddingHorizontal: 16, marginTop: 12 },
//   cardDesc: { fontSize: 15, color: "#444", lineHeight: 22 },
//   statsRow: { flexDirection: "row", gap: 20, marginTop: 12 },
//   statGroup: { flexDirection: "row", alignItems: "center", gap: 5 },
//   statNum: { fontSize: 14, color: "#666" },
//   emptyContainer: { alignItems: "center", marginTop: 40 },
//   emptyText: { color: "#999", fontFamily: fonts.regular },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetMeQuery } from "@/api/userApi";
import { useGetFeedQuery, useDeletePostMutation } from "@/api/postApi";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { api } from "@/api/api";
import { fonts } from "@/constants/fonts";
import { VideoView, useVideoPlayer } from "expo-video";
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");
const MEDIA_WIDTH = width * 0.92;

// --- Sub-component to handle Video Rendering inside the list ---
const VideoItem = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });

  return (
    <VideoView
      player={player}
      style={styles.mediaContent}
      nativeControls
      contentFit="cover"
    />
  );
};

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = useGetMeQuery(undefined);

  const { data: postsData, isLoading: postsLoading } = useGetFeedQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );

  const [deletePost] = useDeletePostMutation();

  // Helper to format date: 12 Jan 2026
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token"]);
          dispatch(api.util.resetApiState());
          router.replace("/login");
        },
      },
    ]);
  };

  const confirmDelete = (postId: string) => {
    Alert.alert("Delete Post", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId).unwrap();
          } catch (err) {
            alert("Failed to delete post");
          }
        },
      },
    ]);
  };

  const renderMedia = ({ item: uri }: { item: string }) => {
    const isVideo = uri.match(/\.(mp4|mov|m4v|avi)$/i);
    return (
      <View style={styles.mediaWrapper}>
        {isVideo ? (
          <VideoItem uri={uri} />
        ) : (
          <Image
            source={{ uri }}
            style={styles.mediaContent}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  if (userLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  if (isError || !user)
    return (
      <View style={styles.center}>
        <Text style={{ fontFamily: fonts.regular }}>
          Failed to load profile
        </Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
            <Text style={styles.username}>@{user.username}</Text>
            <Ionicons name="ellipsis-horizontal" size={22} />
          </View>

          {/* PROFILE SECTION */}
          <View style={styles.profileSection}>
            <Image
              source={
                user.profilePic
                  ? { uri: user.profilePic }
                  : require("../../assets/images/profile.png")
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.username}</Text>
            <View style={styles.joinRow}>
              <Ionicons name="calendar-outline" size={14} color="#777" />
              <Text style={styles.joinText}>Joined {formatDate(user?.createdAt)}</Text>
            </View>
            <Text style={styles.bio}>{user.bio || "No bio added yet"}</Text>
          </View>

          {/* STATS */}
          <View style={styles.followRow}>
            <View style={styles.followBox}>
              <Text style={styles.followCount}>
                {user.followers?.length || 0}
              </Text>
              <Text style={styles.followLabel}>Followers</Text>
            </View>
            <View style={styles.followBox}>
              <Text style={styles.followCount}>
                {user.following?.length || 0}
              </Text>
              <Text style={styles.followLabel}>Following</Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.requestBtn}
              onPress={() => router.push("/my-requests")}
            >
              <Ionicons name="people-outline" size={18} color="#2563EB" />
              <Text style={styles.requestText}>My Requests</Text>
              {user.followRequests?.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {user.followRequests.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* MY POSTS HEADER */}
          <View style={styles.postsBadgeContainer}>
            <View style={styles.blueBadge}>
              <Text style={styles.badgeTitle}>My Posts</Text>
            </View>
          </View>

          {/* FEED LIST */}
          <View style={styles.feedList}>
            {postsLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} color="#2563EB" />
            ) : postsData?.posts?.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You haven't posted anything yet.
                </Text>
              </View>
            ) : (
              (postsData?.posts || [])
                .filter(
                  (p: any) => p.user?._id === user._id || p.user === user._id
                )
                .map((post: any) => (
                  <View key={post._id} style={styles.postCard}>
                    {/* 1. Header is clickable */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push({
                          pathname: "/post-details",
                          params: { id: post._id },
                        })
                      }
                      style={styles.cardHeader}
                    >
                      <View>
                        <Text style={styles.cardTitle}>{post.title}</Text>
                        <Text style={styles.cardDate}>{formatDate(post.createdAt)}</Text>
                      </View>
                      <TouchableOpacity
                        hitSlop={15}
                        onPress={() => confirmDelete(post._id)}
                      >
                        <Ionicons
                          name="ellipsis-vertical"
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {/* 2. Media Carousel - NOT wrapped in the main TouchableOpacity 
                 so it can receive swipe gestures. Clicking an image will 
                 now trigger navigation via the renderMedia sub-component. */}
                    <FlatList
                      data={post.images}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() =>
                            router.push({
                              pathname: "/post-details",
                              params: { id: post._id },
                            })
                          }
                        >
                          {renderMedia({ item })}
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => `${post._id}-${index}`}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={MEDIA_WIDTH + 12}
                      decelerationRate="fast"
                      contentContainerStyle={styles.carouselContent}
                    />

                    {/* 3. Footer is clickable */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push({
                          pathname: "/post-details",
                          params: { id: post._id },
                        })
                      }
                      style={styles.cardFooter}
                    >
                      <Text style={styles.cardDesc} numberOfLines={3}>
                        {post.description}
                      </Text>
                      <View style={styles.statsRow}>
                        <View style={styles.statGroup}>
                          <Ionicons name="heart" size={18} color="red" />
                          <Text style={styles.statNum}>
                            {post.likes?.length || 0}
                          </Text>
                        </View>
                        <View style={styles.statGroup}>
                          <Ionicons
                            name="chatbubble-outline"
                            size={17}
                            color="#444"
                          />
                          <Text style={styles.statNum}>
                            {post.comments?.length || 0}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    paddingVertical: 16,
  },
  username: { fontSize: 18, fontFamily: fonts.bold },
  profileSection: { paddingHorizontal: width * 0.04, marginTop: 12 },
  avatar: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    marginBottom: 10,
  },
  name: { fontSize: 20, fontFamily: fonts.bold },
  joinRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  joinText: { fontSize: 15, fontFamily: fonts.regular, color: "#777" },
  bio: {
    marginTop: 2,
    fontSize: 17,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  followRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.12,
    marginTop: 15,
  },
  followBox: { alignItems: "center" },
  followCount: { fontSize: 25, fontFamily: fonts.bold },
  followLabel: { fontSize: 16, color: "#777" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: width * 0.04,
    gap: 10,
  },
  badge: {
    backgroundColor: "#EF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -2,
    top: -5,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: { color: "#fff", fontSize: 10, fontFamily: fonts.bold },
  requestBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  requestText: { color: "#2563EB", fontSize: 16, fontFamily: fonts.bold },
  logoutBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  logoutText: { color: "#EF4444", fontSize: 16, fontFamily: fonts.bold },
  divider: { height: 1, backgroundColor: "#eee", width: "100%", marginTop: 25 },
  postsBadgeContainer: {
    paddingHorizontal: width * 0.04,
    marginTop: 20,
    marginBottom: 10,
  },
  blueBadge: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  badgeTitle: { color: "#fff", fontFamily: fonts.bold, fontSize: 18 },
  feedList: { paddingBottom: 100, paddingTop: 15 },
  postCard: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 20, fontFamily: fonts.bold },
  cardDate: { fontSize: 15, paddingTop: 2, fontFamily: fonts.regular, color: "#999" },
  carouselContent: { paddingLeft: width * 0.04, paddingRight: 4 },
  mediaWrapper: {
    width: MEDIA_WIDTH,
    height: height * 0.29,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  mediaContent: { width: "100%", height: "100%" },
  cardFooter: { paddingHorizontal: width * 0.04, marginTop: 12 },
  cardDesc: {
    fontSize: 17,
    fontFamily: fonts.regular,
    color: "#444",
    lineHeight: 22,
  },
  statsRow: { flexDirection: "row", gap: 15, marginTop: 8 },
  statGroup: { flexDirection: "row", alignItems: "center", gap: 4 },
  statNum: { fontSize: 18, fontFamily: fonts.regular, color: "#666" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#999", fontFamily: fonts.regular },
});
