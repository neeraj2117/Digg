import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  useGetMeQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from "@/api/userApi";
import { fonts } from "@/constants/fonts";
import { Alert } from "react-native";

const MyRequests = () => {
  const { data: user, isLoading } = useGetMeQuery(undefined);
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();

  // Handle Accept Confirmation
  const handleAccept = (requestId: string, username: string) => {
    Alert.alert(
      "Accept Request",
      `Are you sure you want to allow @${username} to follow you?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => acceptRequest(requestId),
        },
      ]
    );
  };

  // Handle Reject Confirmation
  const handleReject = (requestId: string, username: string) => {
    Alert.alert(
      "Delete Request",
      `Are you sure you want to delete the request from @${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive", // Red text on iOS
          onPress: () => rejectRequest(requestId),
        },
      ]
    );
  };

  const requests = user?.followRequests || [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={20} onPress={() => router.back()} />
        <Text style={styles.title}>Follow Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.userInfo}>
              <Image
                source={
                  item.profilePic
                    ? { uri: item.profilePic }
                    : require("../assets/images/profile.png")
                }
                style={styles.avatar}
              />
              {/* 1. Added a View with flex: 1 here */}
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>@{item.username}</Text>
                <Text style={styles.bio} numberOfLines={1} ellipsizeMode="tail">
                  {item.bio || "Wants to follow you"}
                </Text>
              </View>
            </View>

            {/* 2. Button group remains outside the flexed userInfo */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAccept(item._id, item.username)} // 2. Use handleAccept
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(item._id, item.username)} // 3. Use handleReject
              >
                <Text style={styles.rejectText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default MyRequests;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 20, fontFamily: fonts.bold },
  requestCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, // Added spacing between rows
    gap: 10, // Ensures a gap between text and buttons
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1, // This allows the user info section to take all available space
  },
  bio: {
    fontSize: 15,
    color: "#777",
    fontFamily: fonts.regular,
    // The width is now constrained by the parent's flex: 1
  },
  avatar: { width: 45, height: 45, borderRadius: 25 },
  username: { fontSize: 18, fontFamily: fonts.bold, marginBottom: 1 },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    flexShrink: 0, // Prevents buttons from squishing
  },
  acceptBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptText: { color: "#fff", fontFamily: fonts.bold, fontSize: 14 },
  rejectBtn: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectText: { color: "#000", fontFamily: fonts.bold, fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
    fontFamily: fonts.regular,
  },
});
