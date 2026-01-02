import { fonts } from "@/constants/fonts";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { VideoView, useVideoPlayer, VideoSource } from "expo-video";

const { width } = Dimensions.get("window");

type Props = {
  title: string;
  headerTitle: string;
  votes: number;
  avatar?: string | string[];
  authorName: string;
  tag: string;
  authorAvatar: any;
  time?: string;
  commentsCount: number;
  onLike?: () => void;
  onDelete?: () => void;
  isLast?: boolean;
  onMorePress: () => void;
  isOwner?: boolean;
  isLiked?: boolean;
  onPress?: () => void;
  userId: string;
  onUserPress?: () => void;
};

export default function ExpandedPostCard({
  title,
  headerTitle,
  votes,
  avatar,
  authorName,
  authorAvatar,
  tag,
  time = "2h ago",
  onLike,
  onPress,
  onMorePress,
  isLiked,
  isLast,
  commentsCount,
  onUserPress,
}: Props) {
  const images = Array.isArray(avatar) ? avatar : avatar ? [avatar] : [];
  const avatarSource = authorAvatar?.uri || (typeof authorAvatar === 'string' && authorAvatar.length > 0)
    ? { uri: typeof authorAvatar === 'string' ? authorAvatar : authorAvatar.uri }
    : require("../assets/images/profile.png");

  const videoSource = images.length > 0 ? images[0] : null;
  const isVideo = Boolean(videoSource && videoSource.match(/\.(mp4|mov|m4v)$/i));

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
      <View style={styles.row}>
        {/* LEFT CONTENT */}
        <View style={styles.leftBox}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.leftHeader}
              onPress={onUserPress}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image source={authorAvatar ? avatarSource : require("../assets/images/profile.png")} style={styles.authorAvatar} />
              <View>
                <Text style={styles.author} numberOfLines={1}>{authorName}</Text>
                <Text style={styles.metaText}>
                  /{headerTitle} • {time}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onMorePress}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* TITLE & TAG */}
          <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.contentArea}>
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
            <Text style={styles.tag}>#{tag}</Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={onLike}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={require("../assets/images/arr.png")}
                style={[
                  styles.arrow,
                  { tintColor: isLiked ? "#16a34a" : "#6B7280" },
                ]}
              />
              <Text
                style={[
                  styles.count,
                  { color: isLiked ? "#16a34a" : "#6B7280" },
                ]}
              >
                {votes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={onPress}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chatbubble" size={16} color="#6B7280" />
              <Text style={styles.commentsCount}>{commentsCount}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT IMAGE/VIDEO */}
        {images.length > 0 && (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.imageContainer}
          >
            {isVideo ? (
              <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={false}
              />
            ) : (
              <Image source={{ uri: images[0] }} style={styles.image} />
            )}

            {isVideo && (
              <View style={styles.videoBadge}>
                <Ionicons name="play-circle" size={16} color="#fff" />
              </View>
            )}

            {images.length > 1 && (
              <View style={styles.imageBadge}>
                <Ionicons name="images" size={11} color="#fff" />
                <Text style={styles.badgeText}>{images.length - 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 14,
    // paddingHorizontal: 8, 
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  leftBox: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: '70%',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  author: {
    fontSize: 17, // Adjusted for cleaner density
    fontFamily: fonts.bold,
    color: "#000",
  },
  metaText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#888",
  },
  contentArea: {
    marginVertical: 4,
  },
  title: {
    fontSize: 19,
    fontFamily: fonts.bold,
    lineHeight: 22,
    color: '#111',
  },
  tag: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: "#2563EB",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 3,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  arrow: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  count: {
    fontSize: 17,
    fontFamily: fonts.bold,
  },
  commentsCount: {
    fontSize: 17,
    fontFamily: fonts.regular,
    color: "#6B7280",
  },
  imageContainer: {
    width: width * 0.28, // Relative width for responsiveness
    height: width * 0.26,
    maxWidth: 110,
    maxHeight: 105,
  },
  video: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  videoBadge: {
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  image: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  imageBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});