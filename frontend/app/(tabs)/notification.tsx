// import React, { useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { fonts } from "@/constants/fonts";
// import { useRouter } from "expo-router";
// import { 
//   useGetNotificationsQuery, 
//   useMarkAsReadMutation 
// } from "@/api/notificationApi";
// import { formatDistanceToNow } from "date-fns"; // Optional: npm install date-fns

// const NotificationScreen = () => {
//   const router = useRouter();
  
//   // --- Real API Hooks ---
//   const { data: notifications, isLoading, refetch, isFetching } = useGetNotificationsQuery();
//   const [markAsRead] = useMarkAsReadMutation();

//   // Mark notifications as read when the screen is focused or data loads
//   useEffect(() => {
//     if (notifications?.some(n => !n.isRead)) {
//       markAsRead();
//     }
//   }, [notifications]);

//   // --- Helper to handle icons based on Backend Types ---
//   const renderNotificationIcon = (type: string) => {
//     switch (type) {
//       case "like_post":
//       case "like_comment":
//         return <Ionicons name="heart" size={12} color="#fff" />;
//       case "comment_post":
//         return <Ionicons name="chatbubble" size={10} color="#fff" />;
//       case "follow":
//         return <Ionicons name="person-add" size={10} color="#fff" />;
//       default:
//         return <Ionicons name="notifications" size={10} color="#fff" />;
//     }
//   };

//   const getBadgeColor = (type: string) => {
//     if (type.includes("like")) return "#EF4444";
//     if (type.includes("comment")) return "#2868D6";
//     return "#16A34A";
//   };

//   const NotificationTile = ({ item }: { item: any }) => {
//     const dateLabel = item.createdAt 
//       ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) 
//       : "";

//     return (
//       <TouchableOpacity
//         style={[styles.tile, !item.isRead && styles.unreadTile]}
//         onPress={() => {
//           if (item.post) {
//             router.push({
//               pathname: "/post-details",
//               params: { id: item.post._id },
//             });
//           }
//         }}
//       >
//         <View style={styles.avatarContainer}>
//           <Image
//             source={{ uri: item.sender?.profilePic || "https://via.placeholder.com/150" }}
//             style={styles.avatar}
//           />
//           <View style={[styles.typeIconBadge, { backgroundColor: getBadgeColor(item.type) }]}>
//             {renderNotificationIcon(item.type)}
//           </View>
//         </View>

//         <View style={styles.textContainer}>
//           <Text style={styles.notificationText}>
//             <Text style={styles.username}>{item.sender?.username || "Someone"} </Text>
//             {item.type === "like_post" && "liked your post."}
//             {item.type === "comment_post" && "commented on your post."}
//             {item.type === "like_comment" && "liked your comment."}
//             {item.type === "follow" && "started following you."}
//           </Text>

//           {item.content && (
//             <Text style={styles.commentPreview} numberOfLines={1}>
//               "{item.content}"
//             </Text>
//           )}

//           <Text style={styles.timeText}>{dateLabel}</Text>
//         </View>

//         {item.post?.images?.[0] && (
//           <Image source={{ uri: item.post.images[0] }} style={styles.postThumbnail} />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2868D6" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>All Notifications</Text>
//         <TouchableOpacity onPress={() => refetch()}>
//           <Ionicons name="refresh" size={20} color="#2868D6" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => <NotificationTile item={item} />}
//         onRefresh={refetch}
//         refreshing={isFetching}
//         contentContainerStyle={notifications?.length === 0 && { flex: 1 }}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Ionicons name="notifications-off-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No activity yet</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// export default NotificationScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   headerTitle: { fontSize: 24, fontFamily: fonts.bold, color: "#111827" },

//   tile: {
//     flexDirection: "row",
//     padding: 16,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F9FAFB",
//   },
//   unreadTile: { backgroundColor: "#F0F7FF" },

//   avatarContainer: { position: "relative" },
//   avatar: { width: 45, height: 45, borderRadius: 25, backgroundColor: "#f0f0f0" },
//   typeIconBadge: {
//     position: "absolute",
//     bottom: -2,
//     right: -2,
//     borderRadius: 11,
//     padding: 2.5,
//     borderWidth: 2,
//     borderColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   textContainer: { flex: 1, marginLeft: 10, marginRight: 10 },
//   notificationText: {
//     fontSize: 15,
//     color: "#374151",
//     fontFamily: fonts.regular,
//     lineHeight: 20,
//   },
//   username: { fontFamily: fonts.bold, fontSize: 17, color: "#111827" },
//   commentPreview: {
//     fontSize: 14,
//     color: "#6B7280",
//     fontFamily: fonts.regular,
//     marginTop: 4,
//     fontStyle: "italic",
//   },
//   timeText: {
//     fontSize: 14,
//     color: "#90959eff",
//     marginTop: 3,
//     fontFamily: fonts.regular,
//   },

//   postThumbnail: { width: 45, height: 45, borderRadius: 8, backgroundColor: "#f0f0f0" },

//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     marginTop: 10,
//     color: "#9CA3AF",
//     fontFamily: fonts.regular,
//     fontSize: 16,
//   },
// });

import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation 
} from "@/api/notificationApi";
import { formatDistanceToNow } from "date-fns";

const { width, height } = Dimensions.get("window");

const NotificationScreen = () => {
  const router = useRouter();
  
  const { data: notifications, isLoading, refetch, isFetching } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (notifications?.some(n => !n.isRead)) {
      markAsRead();
    }
  }, [notifications]);

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "like_post":
      case "like_comment":
        return <Ionicons name="heart" size={width * 0.03} color="#fff" />;
      case "comment_post":
        return <Ionicons name="chatbubble" size={width * 0.025} color="#fff" />;
      case "follow":
        return <Ionicons name="person-add" size={width * 0.025} color="#fff" />;
      default:
        return <Ionicons name="notifications" size={width * 0.025} color="#fff" />;
    }
  };

  const getBadgeColor = (type: string) => {
    if (type.includes("like")) return "#EF4444";
    if (type.includes("comment")) return "#2868D6";
    return "#16A34A";
  };

  const NotificationTile = ({ item }: { item: any }) => {
    const dateLabel = item.createdAt 
      ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) 
      : "";

    return (
      <TouchableOpacity
        style={[styles.tile, !item.isRead && styles.unreadTile]}
        onPress={() => {
          if (item.post) {
            router.push({
              pathname: "/post-details",
              params: { id: item.post._id },
            });
          }
        }}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.sender?.profilePic || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
          <View style={[styles.typeIconBadge, { backgroundColor: getBadgeColor(item.type) }]}>
            {renderNotificationIcon(item.type)}
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.sender?.username || "Someone"} </Text>
            {item.type === "like_post" && "liked your post."}
            {item.type === "comment_post" && "commented on your post."}
            {item.type === "like_comment" && "liked your comment."}
            {item.type === "follow" && "started following you."}
          </Text>

          {item.content && (
            <Text style={styles.commentPreview} numberOfLines={1}>
              "{item.content}"
            </Text>
          )}

          <Text style={styles.timeText}>{dateLabel}</Text>
        </View>

        {item.post?.images?.[0] && (
          <Image source={{ uri: item.post.images[0] }} style={styles.postThumbnail} />
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2868D6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Notifications</Text>
          <TouchableOpacity onPress={() => refetch()} hitSlop={10}>
            <Ionicons name="refresh" size={width * 0.05} color="#2868D6" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationTile item={item} />}
          onRefresh={refetch}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={notifications?.length === 0 && { flex: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={width * 0.15} color="#D1D5DB" />
              <Text style={styles.emptyText}>No activity yet</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: width * 0.06, fontFamily: fonts.bold, color: "#111827" },

  tile: {
    flexDirection: "row",
    padding: width * 0.04,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  unreadTile: { backgroundColor: "#F0F7FF" },

  avatarContainer: { position: "relative" },
  avatar: { 
    width: width * 0.11, 
    height: width * 0.11, 
    borderRadius: (width * 0.11) / 2, 
    backgroundColor: "#f0f0f0" 
  },
  typeIconBadge: {
    position: "absolute",
    bottom: -width * 0.005,
    right: -width * 0.005,
    borderRadius: 100,
    padding: width * 0.006,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: { flex: 1, marginLeft: width * 0.03, marginRight: width * 0.02 },
  notificationText: {
    fontSize: width * 0.038,
    color: "#374151",
    fontFamily: fonts.regular,
    lineHeight: width * 0.05,
  },
  username: { fontFamily: fonts.bold, fontSize: width * 0.042, color: "#111827" },
  commentPreview: {
    fontSize: width * 0.035,
    color: "#6B7280",
    fontFamily: fonts.regular,
    marginTop: 4,
    fontStyle: "italic",
  },
  timeText: {
    fontSize: width * 0.034,
    color: "#90959eff",
    marginTop: 3,
    fontFamily: fonts.regular,
  },

  postThumbnail: { 
    width: width * 0.11, 
    height: width * 0.11, 
    borderRadius: 8, 
    backgroundColor: "#f0f0f0" 
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#9CA3AF",
    fontFamily: fonts.regular,
    fontSize: width * 0.04,
  },
});