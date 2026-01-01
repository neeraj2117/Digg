// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams, router } from "expo-router";
// import { useState } from "react";
// import {
//   useGetMeQuery,
//   useGetUserPostsQuery,
//   useGetUserProfileQuery,
// } from "@/api/userApi";
// import { useFollowUserMutation } from "@/api/userApi";
// import { fonts } from "@/constants/fonts";
// import LottieView from "lottie-react-native";

// const { width } = Dimensions.get("window");

// // --- Carousel Component for Multiple Images ---
// function PostCarousel({ images }: { images: string[] }) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   if (!images || images.length === 0) return null;

//   return (
//     <View style={styles.carouselContainer}>
//       <FlatList
//         data={images}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(_, i) => i.toString()}
//         onMomentumScrollEnd={(e) => {
//           const index = Math.round(
//             e.nativeEvent.contentOffset.x / (width - 32)
//           ); // Adjusted for padding
//           setActiveIndex(index);
//         }}
//         renderItem={({ item }) => (
//           <Image source={{ uri: item }} style={styles.postImage} />
//         )}
//       />

//       {/* DOTS */}
//       {images.length > 1 && (
//         <View style={styles.dotsContainer}>
//           {images.map((_, index) => (
//             <View
//               key={index}
//               style={[styles.dot, activeIndex === index && styles.activeDot]}
//             />
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

// export default function AnyUserProfile() {
//   const { userId } = useLocalSearchParams();
//   const idToFetch = Array.isArray(userId) ? userId[0] : (userId as string);

//   const { data: me } = useGetMeQuery(undefined);
//   const { data: user, isLoading: isUserLoading } =
//     useGetUserProfileQuery(idToFetch);
//   const [followUser] = useFollowUserMutation();

//   const isFollowing = user?.followers?.includes(me?._id);
//   const isRequested = user?.followRequests?.includes(me?._id);

//   const { data: posts, isLoading: isLoadingPosts } = useGetUserPostsQuery(
//     idToFetch,
//     { skip: !isFollowing }
//   );

//   if (isUserLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2563EB" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={22} />
//           </TouchableOpacity>
//           <Text style={styles.username}>@{user?.username || "Profile"}</Text>
//           <Ionicons name="ellipsis-horizontal" size={22} />
//         </View>

//         {/* PROFILE INFO */}
//         <View style={styles.profileSection}>
//           <Image
//             source={
//               user?.profilePic
//                 ? { uri: user.profilePic }
//                 : require("../assets/images/profile.png")
//             }
//             style={styles.avatar}
//           />
//           <Text style={styles.name}>{user?.username}</Text>
//           {/* JOINED DATE ROW */}
//           <View style={styles.joinRow}>
//             <Ionicons name="calendar-outline" size={14} color="#777" />
//             <Text style={styles.joinText}>
//               Joined{" "}
//               {user?.createdAt
//                 ? new Date(user.createdAt).toLocaleDateString("en-US", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })
//                 : "Recently"}
//             </Text>
//           </View>
//           <Text style={styles.bio}>{user?.bio || "No bio added yet"}</Text>
//         </View>

//         {/* STATS */}
//         <View style={styles.followRow}>
//           <View style={styles.followBox}>
//             <Text style={styles.followCount}>
//               {user?.followers?.length || 0}
//             </Text>
//             <Text style={styles.followLabel}>Followers</Text>
//           </View>
//           <View style={styles.followBox}>
//             <Text style={styles.followCount}>
//               {user?.following?.length || 0}
//             </Text>
//             <Text style={styles.followLabel}>Following</Text>
//           </View>
//         </View>

//         {/* BUTTON */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={[
//               styles.followBtn,
//               (isFollowing || isRequested) && styles.followingBtn,
//             ]}
//             onPress={() => followUser(idToFetch)}
//           >
//             <Ionicons
//               name={
//                 isFollowing
//                   ? "checkmark-circle"
//                   : isRequested
//                   ? "time"
//                   : "person-add"
//               }
//               size={18}
//               color={isFollowing || isRequested ? "#2563EB" : "#fff"}
//             />
//             <Text
//               style={[
//                 styles.followBtnText,
//                 (isFollowing || isRequested) && styles.followingBtnText,
//               ]}
//             >
//               {isFollowing ? "Following" : isRequested ? "Requested" : "Follow"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.divider} />

//         {/* POSTS */}
//         {!isFollowing ? (
//           <View style={styles.privateWall}>
//             <Ionicons
//               name="lock-closed"
//               size={52}
//               color="#dbdbdb"
//               style={{ marginTop: 40 }}
//             />
//             <Text style={styles.privateTitle}>This Account is Private</Text>
//             <Text style={styles.privateSub}>
//               {isRequested
//                 ? "Waiting for user to accept your request."
//                 : "Follow this user to see their posts."}
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.postsContainer}>
//             <View style={styles.feedBadge}>
//               <Text style={styles.feedText}>All Posts</Text>
//             </View>

//             {isLoadingPosts ? (
//               <ActivityIndicator
//                 size="small"
//                 color="#2563EB"
//                 style={{ marginTop: 20 }}
//               />
//             ) : posts && posts.length > 0 ? (
//               posts.map((post: any) => (
//                 <View key={post._id} style={styles.postCard}>
//                   {/* Multiple Images Carousel or Single Image */}
//                   {post.images && post.images.length > 0 ? (
//                     <PostCarousel images={post.images} />
//                   ) : post.image ? (
//                     <Image
//                       source={{ uri: post.image }}
//                       style={styles.postImage}
//                     />
//                   ) : null}

//                   <View style={styles.postContent}>
//                     {/* Title and Date in one line */}
//                     <View style={styles.postHeaderRow}>
//                       <Text style={styles.postTitle} numberOfLines={1}>
//                         {post.title || "Untitled Post"}
//                       </Text>
//                       <Text style={styles.postDate}>
//                         {new Date(post.createdAt).toLocaleDateString()}
//                       </Text>
//                     </View>

//                     <Text style={styles.postDescription} numberOfLines={3}>
//                       {post.content || post.description}
//                     </Text>
//                   </View>
//                 </View>
//               ))
//             ) : (
//               <View style={{ alignItems: "center", marginTop: 0 }}>
//                 <LottieView
//                   source={require("../assets/animations/empty.json")}
//                   autoPlay
//                   loop
//                   resizeMode="contain"
//                   style={{ width: "50%", height: 300 }}
//                 />
//                 <Text style={[styles.postPlaceholder, { marginTop: -30 }]}>
//                   No posts to show yet.
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//   },
//   username: { fontSize: 18, fontFamily: fonts.bold },
//   profileSection: { paddingHorizontal: 16, marginTop: 12 },
//   avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
//   name: { fontSize: 22, fontFamily: fonts.bold },
//   bio: { marginTop: 4, fontSize: 16, fontFamily: fonts.regular, color: "#444" },
//   followRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 40,
//     paddingHorizontal: 16,
//     marginTop: 5,
//   },
//   followBox: { alignItems: "center" },
//   followCount: { fontSize: 25, fontFamily: fonts.bold },
//   followLabel: { fontSize: 15, color: "#777", fontFamily: fonts.regular },
//   actionRow: { paddingHorizontal: 16, marginTop: 15, marginBottom: 6 },
//   followBtn: {
//     backgroundColor: "#2563EB",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 9,
//     borderRadius: 8,
//   },
//   followingBtn: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   followBtnText: { color: "#fff", fontSize: 17, fontFamily: fonts.bold },
//   followingBtnText: { color: "#333" },
//   divider: { width: "100%", height: 1, backgroundColor: "#eee", marginTop: 10 },
//   joinRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     marginTop: 4,
//     marginBottom: 2,
//   },
//   joinText: {
//     fontSize: 16,
//     color: "#777",
//     fontFamily: fonts.regular,
//   },

//   // Feed Styles
//   postsContainer: { padding: 16 },
//   feedBadge: {
//     backgroundColor: "#2868D6",
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     borderRadius: 30,
//     marginBottom: 20,
//     alignSelf: "flex-start",
//   },
//   feedText: {
//     fontSize: 17,
//     color: "#fff",
//     fontFamily: fonts.bold,
//     letterSpacing: 0.6,
//   },

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 15,
//     borderWidth: 1.2,
//     borderColor: "#eee",
//     overflow: "hidden",
//   },

//   // Carousel Specific
//   carouselContainer: { position: "relative" },
//   postImage: { width: width - 32, height: 230, resizeMode: "cover" },
//   dotsContainer: {
//     position: "absolute",
//     bottom: 8,
//     left: 8,
//     flexDirection: "row",
//     backgroundColor: "rgba(0,0,0,0.4)",
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#999",
//     marginHorizontal: 3,
//   },
//   activeDot: { backgroundColor: "#fff" },

//   postContent: { padding: 12 },
//   postHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   postTitle: {
//     fontSize: 19,
//     fontFamily: fonts.bold,
//     color: "#111",
//     flex: 1,
//     marginRight: 10,
//   },
//   postDate: { fontSize: 13, color: "#8f8e8eff", fontFamily: fonts.regular },
//   postDescription: {
//     fontSize: 15,
//     fontFamily: fonts.regular,
//     color: "#737272ff",
//     lineHeight: 18,
//   },

//   privateWall: { alignItems: "center", paddingHorizontal: 40 },
//   privateTitle: { fontSize: 20, fontFamily: fonts.bold, marginTop: 15 },
//   privateSub: {
//     fontSize: 15.5,
//     fontFamily: fonts.regular,
//     color: "#777",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   postPlaceholder: {
//     textAlign: "center",
//     fontSize: 19,
//     fontFamily: fonts.regular,
//     marginTop: 60,
//     color: "#999",
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  useGetMeQuery,
  useGetUserPostsQuery,
  useGetUserProfileQuery,
  useFollowUserMutation,
} from "@/api/userApi";
import { fonts } from "@/constants/fonts";
import LottieView from "lottie-react-native";
import { format } from "date-fns";
import { VideoView, useVideoPlayer } from "expo-video";

const { width } = Dimensions.get("window");

// --- Video Item Component ---
const VideoItem = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });
  return (
    <VideoView
      player={player}
      style={styles.postImage}
      nativeControls
      contentFit="cover"
    />
  );
};

// --- Carousel for Media ---
function PostMedia({ images, postId }: { images: string[]; postId: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(
            Math.round(e.nativeEvent.contentOffset.x / (width - 32))
          );
        }}
        renderItem={({ item }) => {
          const isVideo = item.match(/\.(mp4|mov|m4v|avi)$/i);
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/post-details",
                  params: { id: postId },
                })
              }
            >
              {isVideo ? (
                <VideoItem uri={item} />
              ) : (
                <Image source={{ uri: item }} style={styles.postImage} />
              )}
            </TouchableOpacity>
          );
        }}
      />
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function AnyUserProfile() {
  const { userId } = useLocalSearchParams();
  const idToFetch = Array.isArray(userId) ? userId[0] : (userId as string);

  const { data: me } = useGetMeQuery(undefined);
  const { data: user, isLoading: isUserLoading } =
    useGetUserProfileQuery(idToFetch);
  const [followUser] = useFollowUserMutation();

  const isFollowing = user?.followers?.includes(me?._id);
  const isRequested = user?.followRequests?.includes(me?._id);

  const { data: posts, isLoading: isLoadingPosts } = useGetUserPostsQuery(
    idToFetch,
    { skip: !isFollowing }
  );

  const formatDate = (date: string) => {
    if (!date) return "";
    return format(new Date(date), "dd MMM yyyy");
  };

  // --- HANDLES UNFOLLOW/FOLLOW LOGIC ---
  const handleFollowPress = async () => {
    if (isFollowing) {
      Alert.alert(
        "Unfollow",
        `Are you sure you want to unfollow @${user?.username}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Unfollow",
            style: "destructive",
            onPress: async () => {
              try {
                await followUser(idToFetch).unwrap();
              } catch (err) {
                console.error("Unfollow failed", err);
              }
            },
          },
        ]
      );
    } else {
      try {
        await followUser(idToFetch).unwrap();
      } catch (err) {
        console.error("Follow/Request failed", err);
      }
    }
  };

  if (isUserLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.username}>@{user?.username || "Profile"}</Text>
          <Ionicons name="ellipsis-horizontal" size={22} />
        </View>

        <View style={styles.profileSection}>
          <Image
            source={
              user?.profilePic
                ? { uri: user.profilePic }
                : require("../assets/images/profile.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.username}</Text>
          <View style={styles.joinRow}>
            <Ionicons name="calendar-outline" size={14} color="#777" />
            <Text style={styles.joinText}>
              Joined {formatDate(user?.createdAt)}
            </Text>
          </View>
          <Text style={styles.bio}>{user?.bio || "No bio added yet"}</Text>
        </View>

        <View style={styles.followRow}>
          <View style={styles.followBox}>
            <Text style={styles.followCount}>
              {user?.followers?.length || 0}
            </Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
          <View style={styles.followBox}>
            <Text style={styles.followCount}>
              {user?.following?.length || 0}
            </Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.followBtn,
              (isFollowing || isRequested) && styles.followingBtn,
            ]}
            onPress={handleFollowPress}
          >
            <Ionicons
              name={
                isFollowing
                  ? "checkmark-circle"
                  : isRequested
                  ? "time"
                  : "person-add"
              }
              size={18}
              color={isFollowing || isRequested ? "#2563EB" : "#fff"}
            />
            <Text
              style={[
                styles.followBtnText,
                (isFollowing || isRequested) && styles.followingBtnText,
              ]}
            >
              {isFollowing ? "Following" : isRequested ? "Requested" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {!isFollowing ? (
          <View style={styles.privateWall}>
            <Ionicons
              name="lock-closed"
              size={52}
              color="#dbdbdb"
              style={{ marginTop: 40 }}
            />
            <Text style={styles.privateTitle}>This Account is Private</Text>
            <Text style={styles.privateSub}>
              {isRequested
                ? "Waiting for user to accept your request."
                : "Follow this user to see their posts."}
            </Text>
          </View>
        ) : (
          <View style={styles.postsContainer}>
            <View style={styles.feedBadge}>
              <Text style={styles.feedText}>All Posts</Text>
            </View>
            {isLoadingPosts ? (
              <ActivityIndicator
                size="small"
                color="#2563EB"
                style={{ marginTop: 20 }}
              />
            ) : (
              posts?.map((post: any) => (
                <View key={post._id} style={styles.postCard}>
                  {post.images?.length > 0 ? (
                    <PostMedia images={post.images} postId={post._id} />
                  ) : post.image ? (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/post-details",
                          params: { id: post._id },
                        })
                      }
                    >
                      <Image
                        source={{ uri: post.image }}
                        style={styles.postImage}
                      />
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={styles.postContent}
                    onPress={() =>
                      router.push({
                        pathname: "/post-details",
                        params: { id: post._id },
                      })
                    }
                  >
                    <View style={styles.postHeaderRow}>
                      <Text style={styles.postTitle} numberOfLines={1}>
                        {post.title || "Untitled Post"}
                      </Text>
                      <Text style={styles.postDate}>
                        {formatDate(post.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.postDescription} numberOfLines={3}>
                      {post.content || post.description}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  username: { fontSize: 18, fontFamily: fonts.bold },
  profileSection: { paddingHorizontal: 16, marginTop: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontFamily: fonts.bold },
  bio: { marginTop: 4, fontSize: 16, fontFamily: fonts.regular, color: "#444" },
  followRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    paddingHorizontal: 16,
    marginTop: 5,
  },
  followBox: { alignItems: "center" },
  followCount: { fontSize: 25, fontFamily: fonts.bold },
  followLabel: { fontSize: 15, color: "#777", fontFamily: fonts.regular },
  actionRow: { paddingHorizontal: 16, marginTop: 15, marginBottom: 6 },
  followBtn: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    borderRadius: 8,
  },
  followingBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  followBtnText: { color: "#fff", fontSize: 17, fontFamily: fonts.bold },
  followingBtnText: { color: "#333", fontFamily: fonts.bold },
  divider: { width: "100%", height: 1, backgroundColor: "#eee", marginTop: 10 },
  joinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
    marginBottom: 2,
  },
  joinText: { fontSize: 16, color: "#777", fontFamily: fonts.regular },
  postsContainer: { padding: 16 },
  feedBadge: {
    backgroundColor: "#2868D6",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 30,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  feedText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: fonts.bold,
    letterSpacing: 0.6,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1.2,
    borderColor: "#eee",
    overflow: "hidden",
  },
  carouselContainer: { position: "relative" },
  postImage: { width: width - 32, height: 230, resizeMode: "cover" },
  dotsContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    marginHorizontal: 3,
  },
  activeDot: { backgroundColor: "#fff" },
  postContent: { padding: 12 },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  postDate: { fontSize: 14, color: "#8f8e8eff", fontFamily: fonts.regular },
  postDescription: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: "#737272ff",
    lineHeight: 18,
    paddingTop: 5,
  },
  privateWall: { alignItems: "center", paddingHorizontal: 40 },
  privateTitle: { fontSize: 20, fontFamily: fonts.bold, marginTop: 15 },
  privateSub: {
    fontSize: 15.5,
    fontFamily: fonts.regular,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
});
