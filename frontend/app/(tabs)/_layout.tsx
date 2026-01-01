// import { Tabs } from "expo-router";
// import { Image, StyleSheet, View } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useEffect } from "react";
// import { useLazyGetMeQuery } from "@/api/userApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setAuthToken } from "@/utils/authToken";

// export default function TabLayout() {
//   const [getMe, { data: user }] = useLazyGetMeQuery();

//   useEffect(() => {
//     const init = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         setAuthToken(token);
//         getMe(); 
//       }
//     };

//     init();
//   }, []);

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={
//                 focused
//                   ? require("../../assets/images/home-filled.png")
//                   : require("../../assets/images/home.png")
//               }
//               style={styles.icon}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="explore"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={
//                 focused
//                   ? require("../../assets/images/search-filled.png")
//                   : require("../../assets/images/search.png")
//               }
//               style={styles.icon}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="create"
//         options={{
//           tabBarIcon: () => (
//             <View style={styles.plusButton}>
//               <Ionicons name="add-outline" size={28} color="#fff" />
//             </View>
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="notification"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={
//                 focused
//                   ? require("../../assets/images/ringing-filled.png")
//                   : require("../../assets/images/ringing.png")
//               }
//               style={styles.notiIcon}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarIcon: () => (
//             <Image
//               source={
//                 user?.profilePic
//                   ? { uri: user.profilePic }
//                   : require("../../assets/images/profile.png")
//               }
//               style={styles.avatar}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     height: 80,
//     backgroundColor: "#fff",
//     paddingBottom: 6,
//   },

//   icon: {
//     width: 31,
//     height: 31,
//     resizeMode: "contain",
//     marginBottom: -15,
//   },

//   notiIcon: {
//     width: 27,
//     height: 27,
//     resizeMode: "contain",
//     marginBottom: -15,
//   },

//   plusButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 11,
//     backgroundColor: "#205BC1",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: -20,
//   },

//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 20,
//     marginTop: 15,
//   },
// });

import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGetMeQuery } from "@/api/userApi";

export default function TabLayout() {
  // ✅ Just call the query. API handles the token.
  // We use the data to populate the profile image icon.
  const { data: user } = useGetMeQuery(undefined);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/home-filled.png")
                  : require("../../assets/images/home.png")
              }
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/search-filled.png")
                  : require("../../assets/images/search.png")
              }
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => (
            <View style={styles.plusButton}>
              <Ionicons name="add-outline" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/ringing-filled.png")
                  : require("../../assets/images/ringing.png")
              }
              style={styles.notiIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <Image
              source={
                user?.profilePic
                  ? { uri: user.profilePic }
                  : require("../../assets/images/profile.png")
              }
              style={styles.avatar}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 80,
    backgroundColor: "#fff",
    paddingBottom: 6,
  },
  icon: { width: 31, height: 31, resizeMode: "contain", marginBottom: -15 },
  notiIcon: { width: 27, height: 27, resizeMode: "contain", marginBottom: -15 },
  plusButton: { width: 42, height: 42, borderRadius: 11, backgroundColor: "#205BC1", alignItems: "center", justifyContent: "center", marginBottom: -20 },
  avatar: { width: 36, height: 36, borderRadius: 20, marginTop: 15 },
});