// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { fonts } from "@/constants/fonts";
// import ImageCarousel from "./ImageCarousel";
// import { useEffect, useMemo } from "react";
// import { useVideoPlayer, VideoSource, VideoView } from "expo-video";

// type Props = {
//   category: string;
//   time: string;
//   title: string;
//   description: string;
//   image: string | string[];
//   source: string;
//   votes: number;
//   likesCount: number;
//   dislikesCount: number;
//   comments: number;
//   authorName: string;
//   authorAvatar: any;
//   onMorePress: () => void;
//   onPress?: () => void;
//   onLike: () => void;
//   onDislike: () => void;
//   isLast?: boolean;
//   isLiked: boolean;
//   isDisliked: boolean;
//   onUserPress?: () => void;
// };

// export default function NewsPostCard({
//   category,
//   time,
//   title,
//   description,
//   image,
//   source,
//   votes,
//   likesCount,
//   dislikesCount,
//   comments,
//   authorName,
//   authorAvatar,
//   onMorePress,
//   onPress,
//   onLike,
//   onDislike,
//   isLast,
//   isLiked,
//   isDisliked,
//   onUserPress,
// }: Props) {
//   const avatarSource =
//     typeof authorAvatar === "string" ? { uri: authorAvatar } : authorAvatar;

//   const videoSource = typeof image === "string" ? image : image?.[0];

//   const isVideo = Boolean(
//     videoSource && videoSource.match(/\.(mp4|mov|m4v)$/i)
//   );

//   const player = useVideoPlayer(
//     isVideo ? ({ uri: videoSource } as VideoSource) : null,
//     (player) => {
//       if (!player) return;
//       player.loop = true;
//       player.muted = true;
//     }
//   );

//   return (
//     <View
//       style={[
//         styles.card,
//         isLast && { borderBottomWidth: 0 }, // ✅ hide last border
//       ]}
//     >
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.authorRow}
//           onPress={onUserPress}
//           activeOpacity={0.7}
//         >
//           <Image source={avatarSource} style={styles.authorAvatar} />

//           <View>
//             <Text style={styles.authorName}>{authorName}</Text>
//             <View style={styles.metaRow}>
//               <Text style={styles.category}>/{category}</Text>
//               <Text style={styles.time}>• {time}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>

//         {/* 3 DOT MENU */}
//         <TouchableOpacity onPress={onMorePress}>
//           <Ionicons name="ellipsis-vertical" size={18} color="#555" />
//         </TouchableOpacity>
//       </View>

//       {/* TITLE */}
//       <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//         <Text style={styles.title}>{title}</Text>
//       </TouchableOpacity>

//       {/* DESCRIPTION */}
//       <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//         <Text style={styles.desc} numberOfLines={2}>
//           {description}
//         </Text>
//       </TouchableOpacity>

//       {/* IMAGE SECTION */}
//       {/* <View style={styles.imageWrapper}>
//         {Array.isArray(image) && image.length > 0 ? (
//           <ImageCarousel images={image} onPress={onPress} />
//         ) : null}

//         <View style={styles.sourceBadge}>
//           <Text style={styles.sourceText}>{source}</Text>
//         </View>
//       </View> */}
//       <View style={styles.imageWrapper}>
//         {isVideo && player ? (
//           <VideoView
//             style={styles.videoPlayer}
//             player={player}
//             nativeControls
//             allowsFullscreen
//             allowsPictureInPicture
//             contentFit="contain"
//           />
//         ) : (
//           Array.isArray(image) &&
//           image.length > 0 && <ImageCarousel images={image} onPress={onPress} />
//         )}

//         <View style={styles.sourceBadge}>
//           <Text style={styles.sourceText}>{source}</Text>
//         </View>
//       </View>

//       {/* FOOTER */}
//       <View style={styles.footer}>
//         <View style={styles.leftActions}>
//           <View style={styles.voteContainer}>
//             {/* LIKE */}
//             <TouchableOpacity
//               onPress={onLike}
//               activeOpacity={0.7}
//               style={[styles.voteHalf, isLiked && styles.likedBg]}
//             >
//               <Image
//                 source={require("../assets/images/arr.png")}
//                 style={[styles.voteIcon, isLiked && { tintColor: "#16a34a" }]}
//               />
//               <Text
//                 style={[
//                   styles.count,
//                   isLiked && { color: "#16a34a", fontWeight: "600" },
//                 ]}
//               >
//                 {likesCount}
//               </Text>
//             </TouchableOpacity>

//             <View style={styles.divider} />

//             {/* DISLIKE */}
//             <TouchableOpacity
//               onPress={onDislike}
//               activeOpacity={0.7}
//               style={[styles.voteHalf, isDisliked && styles.dislikedBg]}
//             >
//               <Image
//                 source={require("../assets/images/down-arrow.png")}
//                 style={[
//                   styles.voteIcon,
//                   isDisliked && { tintColor: "#dc2626" },
//                 ]}
//               />
//               <Text
//                 style={[
//                   styles.count,
//                   isDisliked && { color: "#dc2626", fontWeight: "600" },
//                 ]}
//               >
//                 {dislikesCount}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.commentContainer}>
//             <Ionicons name="chatbubble-outline" size={17} color="#555" />
//             <Text style={styles.count}>{comments}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     paddingVertical: 13,
//     paddingHorizontal: 2,
//     borderBottomWidth: 1,
//     borderColor: "#e9e9e9ff",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 2,
//   },

//   category: {
//     fontSize: 14,
//     fontFamily: fonts.regular,
//     color: "#7d7d7dff",
//   },

//   time: {
//     fontSize: 14,
//     fontFamily: fonts.regular,
//     color: "#7d7d7dff",
//   },

//   title: {
//     fontSize: 22,
//     fontFamily: fonts.bold,
//     marginBottom: 7,
//   },

//   desc: {
//     fontSize: 18,
//     fontFamily: fonts.regular,
//     color: "#787777ff",
//     marginBottom: 10,
//   },

//   imageWrapper: {
//     position: "relative",
//     borderRadius: 14,
//     overflow: "hidden",
//     backgroundColor: "#000", // Better look for video loading
//   },

//   videoPlayer: {
//     width: "100%",
//     height: 250,
//     backgroundColor: "#1a1a1a", // Dark grey so you can distinguish from pure black
//   },

//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 14,
//   },

//   sourceBadge: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },

//   sourceText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between", // 👈 THIS IS THE KEY
//     alignItems: "center",
//     marginTop: 10,
//   },

//   leftActions: {
//     flexDirection: "row",
//     gap: 12,
//   },

//   voteContainer: {
//     flexDirection: "row",
//     alignItems: "stretch",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 22,
//     overflow: "hidden",
//     width: 160, //
//   },

//   voteHalf: {
//     flex: 1, //
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 7.7,
//   },

//   divider: {
//     width: 1,
//     backgroundColor: "#e5e5e5",
//     height: "100%",
//   },

//   likedBg: {
//     backgroundColor: "#dcfce7", // light green
//   },

//   dislikedBg: {
//     backgroundColor: "#fee2e2", // light red
//   },

//   commentContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     gap: 6,
//   },

//   voteIcon: {
//     width: 16,
//     height: 16,
//     marginRight: 7,
//   },

//   count: {
//     fontSize: 18,
//     fontFamily: fonts.regular,
//     color: "#555",
//   },

//   authorRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 6,
//   },

//   authorAvatar: {
//     width: 31,
//     height: 31,
//     borderRadius: 18,
//   },

//   authorName: {
//     fontSize: 18,
//     fontFamily: fonts.bold,
//     color: "#000",
//   },

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
// });


import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/constants/fonts";
import ImageCarousel from "./ImageCarousel";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  category: string;
  time: string;
  title: string;
  description: string;
  image: string | string[];
  source: string;
  votes: number;
  likesCount: number;
  dislikesCount: number;
  comments: number;
  authorName: string;
  authorAvatar: any;
  onMorePress: () => void;
  onPress?: () => void;
  onLike: () => void;
  onDislike: () => void;
  isLast?: boolean;
  isLiked: boolean;
  isDisliked: boolean;
  onUserPress?: () => void;
};

export default function NewsPostCard({
  category,
  time,
  title,
  description,
  image,
  source,
  likesCount,
  dislikesCount,
  comments,
  authorName,
  authorAvatar,
  onMorePress,
  onPress,
  onLike,
  onDislike,
  isLast,
  isLiked,
  isDisliked,
  onUserPress,
}: Props) {
  const avatarSource =
    typeof authorAvatar === "string" ? { uri: authorAvatar } : authorAvatar;

  const videoSource = typeof image === "string" ? image : image?.[0];
  const isVideo = Boolean(videoSource && videoSource.match(/\.(mp4|mov|m4v|avi)$/i));

  const player = useVideoPlayer(
    isVideo ? ({ uri: videoSource } as VideoSource) : null,
    (player) => {
      if (!player) return;
      player.loop = true;
      player.muted = true;
    }
  );

  return (
    <View style={[styles.card, isLast && { borderBottomWidth: 0 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={onUserPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image 
            source={authorAvatar ? avatarSource : require("../assets/images/profile.png")} 
            style={styles.authorAvatar} 
          />
          <View>
            <Text style={styles.authorName}>{authorName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.category}>/{category}</Text>
              <Text style={styles.time}>• {time}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onMorePress}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#555" />
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {/* DESCRIPTION */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>
      </TouchableOpacity>

      {/* IMAGE / VIDEO SECTION */}
      <View style={styles.imageWrapper}>
        {isVideo && player ? (
          <VideoView
            style={styles.videoPlayer}
            player={player}
            nativeControls
            contentFit="cover"
          />
        ) : (
          Array.isArray(image) &&
          image.length > 0 && <ImageCarousel images={image} onPress={onPress} />
        )}

        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{source}</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.leftActions}>
          <View style={styles.voteContainer}>
            <TouchableOpacity
              onPress={onLike}
              activeOpacity={0.7}
              style={[styles.voteHalf, isLiked && styles.likedBg]}
            >
              <Image
                source={require("../assets/images/arr.png")}
                style={[styles.voteIcon, isLiked && { tintColor: "#16a34a" }]}
              />
              <Text style={[styles.count, isLiked && { color: "#16a34a", fontWeight: "600" }]}>
                {likesCount}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={onDislike}
              activeOpacity={0.7}
              style={[styles.voteHalf, isDisliked && styles.dislikedBg]}
            >
              <Image
                source={require("../assets/images/down-arrow.png")}
                style={[styles.voteIcon, isDisliked && { tintColor: "#dc2626" }]}
              />
              <Text style={[styles.count, isDisliked && { color: "#dc2626", fontWeight: "600" }]}>
                {dislikesCount}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.commentContainer} 
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={17} color="#555" />
            <Text style={styles.count}>{comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingVertical: 13,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#e9e9e9ff",
    width: '100%', // Ensures card takes full screen width
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  authorAvatar: {
    width: 31,
    height: 31,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  authorName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  category: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#7d7d7dff",
  },
  time: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#7d7d7dff",
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    marginBottom: 7,
  },
  desc: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: "#787777ff",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  videoPlayer: {
    width: "100%",
    height: 250, // Kept your original height
  },
  sourceBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 22,
    overflow: "hidden",
    width: 160, // Kept your exact width
  },
  voteHalf: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7.7,
  },
  divider: {
    width: 1,
    backgroundColor: "#e5e5e5",
    height: "100%",
  },
  likedBg: {
    backgroundColor: "#dcfce7",
  },
  dislikedBg: {
    backgroundColor: "#fee2e2",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  voteIcon: {
    width: 16,
    height: 16,
    marginRight: 7,
  },
  count: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: "#555",
  },
});