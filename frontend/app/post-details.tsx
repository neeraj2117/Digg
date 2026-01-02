import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fonts } from "@/constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageCarousel from "@/components/ImageCarousel";
import {
  useLikePostMutation,
  useDislikePostMutation,
  useGetPostByIdQuery,
} from "@/api/postApi";
import { useGetMeQuery } from "@/api/userApi";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
} from "@/api/commentApi";
import { VideoView, useVideoPlayer, VideoSource } from "expo-video";

export default function PostDetails() {
  const { data: me } = useGetMeQuery();
  const myUserId = me?._id?.toString();
  const params = useLocalSearchParams();
  const router = useRouter();
  const postId = params.id as string;

  // API Queries
  const { data: postData, isLoading } = useGetPostByIdQuery(postId, {
    skip: !postId,
  });
  const { data: comments } = useGetCommentsQuery(postId, { skip: !postId });

  // API Mutations
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // Local States
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // --- SOURCE OF TRUTH LOGIC ---
  // Use data from API if available (important for notification navigation), otherwise fallback to navigation params
  const displayTitle = postData?.title || params.title;
  const displayDescription = postData?.description || params.description;
  const displayCategory = postData?.category || params.category;
  const displayAuthor = postData?.user?.username || params.authorName;
  const displayCreatedAt = postData?.createdAt || params.createdAt;

  // Image Parsing Logic
  let displayImages: string[] = [];
  if (postData?.images) {
    displayImages = postData.images;
  } else if (params.images) {
    try {
      displayImages = JSON.parse(params.images as string);
    } catch (e) {
      displayImages = [];
    }
  }

  const videoSource = displayImages.length > 0 ? displayImages[0] : null;

  const isVideo = Boolean(
    videoSource && videoSource.match(/\.(mp4|mov|m4v)$/i)
  );

  const player = useVideoPlayer(
    isVideo ? ({ uri: videoSource } as VideoSource) : null,
    (player) => {
      if (!player) return;
      player.loop = true;
      player.muted = false;
    }
  );

  // --- HELPERS ---
  const formatTimeAgo = (dateString: any) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const checkUserVoted = (arr: any[] | undefined) => {
    if (!arr || !myUserId) return false;
    return arr.some((item) => {
      const id = typeof item === "string" ? item : item?._id;
      return id?.toString() === myUserId;
    });
  };

  const getThreadedComments = (allComments: any[]) => {
    const map = new Map();
    const roots: any[] = [];
    allComments.forEach((c) => map.set(c._id, { ...c, replies: [] }));
    allComments.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(map.get(c._id));
      } else if (!c.parentId) {
        roots.push(map.get(c._id));
      }
    });
    return roots;
  };

  // --- HANDLERS ---
  // const handleLike = async () => {
  //   try {
  //     await likePost(postId).unwrap();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const handleDislike = async () => {
  //   try {
  //     await dislikePost(postId).unwrap();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // Inside PostDetails.tsx
  const handleLike = () => {
    likePost(postId); // Instant UI update triggered via onQueryStarted
  };

  const handleDislike = () => {
    dislikePost(postId); // Instant UI update triggered via onQueryStarted
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({
        postId,
        text: commentText,
        parentId: replyingTo?.id || null,
      }).unwrap();
      setCommentText("");
      setReplyingTo(null);
    } catch (err) {
      console.log("COMMENT ERROR:", err);
    }
  };

  const handleDeleteComment = (id: string) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteComment(id),
      },
    ]);
  };

  const renderComment = (item: any, isReply = false) => {
    const commentLiked = checkUserVoted(item.likes);
    const isMyComment = item.user?._id === myUserId;

    return (
      <View key={item._id} style={styles.commentContainer}>
        <View style={styles.commentCard}>
          <Image
            source={
              item.user?.profilePic
                ? { uri: item.user.profilePic }
                : require("../assets/images/profile.png")
            }
            style={isReply ? styles.replyAvatar : styles.commentAvatar}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.commentHeaderRow}>
              <Text style={styles.commentUser}>@{item.user?.username}</Text>
              <Text style={styles.commentDate}>
                {formatTimeAgo(item.createdAt)}
              </Text>
              {isMyComment && (
                <TouchableOpacity
                  onPress={() => handleDeleteComment(item._id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash" size={15} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
            <View style={styles.commentActionsRow}>
              <TouchableOpacity
                style={styles.commentActionBtn}
                onPress={() => likeComment(item._id)} // Just call it directly
              >
                <Ionicons
                  name={commentLiked ? "heart" : "heart-outline"}
                  size={14}
                  color={commentLiked ? "#ef4444" : "#666"}
                />
                <Text
                  style={[
                    styles.commentActionText,
                    commentLiked && { color: "#ef4444" },
                  ]}
                >
                  {item.likes?.length || 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setReplyingTo({ id: item._id, name: item.user?.username })
                }
              >
                <Text style={styles.commentActionText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {item.replies && item.replies.length > 0 && (
          <View style={styles.replyIndentWrapper}>
            {item.replies.map((reply: any) => renderComment(reply, true))}
          </View>
        )}
      </View>
    );
  };

  const isLiked = checkUserVoted(postData?.likes);
  const isDisliked = checkUserVoted(postData?.dislikes);
  const likesCount =
    postData?.likes?.length ?? (Number(params.likesCount) || 0);
  const dislikesCount = postData?.dislikes?.length ?? 0;

  if (isLoading && !postData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
            <Text style={styles.category}>/{displayCategory}</Text>
            <Ionicons name="ellipsis-horizontal" size={20} />
          </View>

          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.meta}>
            {displayCreatedAt ? formatTimeAgo(displayCreatedAt) : "Just now"} by{" "}
            {/* <Text style={styles.author}>@{displayAuthor}</Text> */}
            <Text
              style={styles.author}
              onPress={() => {
                const authorId = postData?.user?._id || params.authorId; // Ensure authorId is passed in params
                if (authorId === myUserId) {
                  router.push("/profile");
                } else {
                  router.push({
                    pathname: "/any-user-profile",
                    params: { userId: authorId },
                  });
                }
              }}
            >
              @{displayAuthor}
            </Text>
          </Text>

          {/* {displayImages.length > 0 && (
            <View style={styles.imageWrapper}>
              <ImageCarousel images={displayImages} />
            </View>
          )} */}
          {displayImages.length > 0 && (
            <View style={styles.imageWrapper}>
              {isVideo ? (
                <VideoView
                  player={player}
                  style={styles.video}
                  nativeControls
                  allowsFullscreen
                  allowsPictureInPicture
                  contentFit="contain"
                />
              ) : (
                <ImageCarousel images={displayImages} />
              )}
            </View>
          )}

          <Text style={styles.description}>{displayDescription}</Text>

          {/* POST ACTIONS */}
          <View style={styles.actions}>
            <View style={styles.voteContainer}>
              <View style={styles.actionGroup}>
                <TouchableOpacity onPress={handleLike} style={styles.voteBtn}>
                  <Image
                    source={require("../assets/images/arr.png")}
                    style={[
                      styles.voteIcon,
                      { tintColor: isLiked ? "#16a34a" : "#000" },
                    ]}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.voteCount,
                    { color: isLiked ? "#16a34a" : "#000" },
                  ]}
                >
                  {likesCount}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  onPress={handleDislike}
                  style={styles.voteBtn}
                >
                  <Image
                    source={require("../assets/images/down-arrow.png")}
                    style={[
                      styles.voteIcon,
                      { tintColor: isDisliked ? "#dc2626" : "#000" },
                    ]}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.voteCount,
                    { color: isDisliked ? "#dc2626" : "#000" },
                  ]}
                >
                  {dislikesCount}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.saveBtn}>
              <Ionicons name="bookmark-outline" size={16} />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* COMMENTS LIST */}
          <View style={styles.commentListContainer}>
            <Text style={styles.sectionTitle}>
              Comments ({comments?.length || 0})
            </Text>
            {getThreadedComments(comments || []).map((comment) =>
              renderComment(comment)
            )}
          </View>
        </ScrollView>

        {/* STICKY FOOTER INPUT */}
        <View style={styles.footerInputContainer}>
          {replyingTo && (
            <View style={styles.replyBar}>
              <Text style={styles.replyText}>
                Replying to @{replyingTo.name}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor="#6B7280"
              value={commentText}
              onChangeText={setCommentText}
              style={styles.input}
              multiline
            />
            <TouchableOpacity
              onPress={handleSendComment}
              style={styles.sendIcon}
            >
              <Ionicons name="send" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
  category: { fontSize: 17, fontFamily: fonts.bold },
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    marginHorizontal: 16,
    marginTop: 10,
  },
  meta: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 16,
    marginVertical: 6,
  },
  author: { fontWeight: "600", color: "#000" },
  imageWrapper: { marginTop: 14, marginHorizontal: 16 },
  description: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: "#444",
    marginHorizontal: 16,
    marginTop: 14,
    lineHeight: 25,
  },
  video: {
    width: "100%",
    height: 260,
    backgroundColor: "#000",
    borderRadius: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
    marginHorizontal: 16,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 4,
  },
  actionGroup: { flexDirection: "row", alignItems: "center", gap: 4 },
  voteBtn: { padding: 4 },
  voteCount: { fontSize: 19, fontFamily: fonts.bold, minWidth: 12 },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  voteIcon: { width: 18, height: 18, resizeMode: "contain" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: { fontSize: 16, fontFamily: fonts.regular },
  commentListContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 15,
  },
  sectionTitle: { fontSize: 19, fontFamily: fonts.bold, marginBottom: 15 },
  commentContainer: { marginBottom: 10 },
  commentCard: { flexDirection: "row", gap: 12 },
  replyIndentWrapper: {
    marginLeft: 22,
    borderLeftWidth: 1.5,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 10,
    marginTop: 5,
  },
  commentAvatar: {
    width: 33,
    height: 33,
    borderRadius: 16,
    backgroundColor: "#eee",
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    flex: 1,
  },
  commentUser: { fontFamily: fonts.bold, fontSize: 15 },
  commentDate: { fontSize: 13, color: "#9CA3AF" },
  commentText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#374151",
    lineHeight: 20,
  },
  commentActionsRow: { flexDirection: "row", gap: 15, marginTop: 8 },
  commentActionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  commentActionText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: fonts.regular,
  },
  deleteBtn: { marginLeft: "auto" },
  footerInputContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: Platform.OS === "ios" ? 25 : 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: Platform.OS === "ios" ? 12 : 16,
    color: "#000",
    fontFamily: fonts.regular,
    maxHeight: 100,
  },
  sendIcon: { paddingLeft: 10 },
  replyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyText: { fontSize: 13, color: "#4B5563", fontFamily: fonts.regular },
});
