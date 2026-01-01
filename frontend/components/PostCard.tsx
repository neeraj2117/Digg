// import { fonts } from "@/constants/fonts";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// type Props = {
//   title: string;
//   tag: string;
//   votes: number;
//   avatar?: any; 
//   onLike?: () => void;
//   onMore?: () => void;
//   likesCount?: number;
//   onPress?: () => void; // ✅ Add onPress prop
// };

// export default function PostCard({
//   title,
//   tag,
//   votes,
//   avatar,
//   onLike,
//   onMore,
//   likesCount,
//   onPress, // ✅ Destructure
// }: Props) {
//   // Fix avatar logic: ensure it handles uri or local require
//   const imageSource =
//     avatar && typeof avatar === "string"
//       ? { uri: avatar }
//       : avatar || require("../assets/images/profile.png");

//   return (
//     <LinearGradient
//       colors={["#b1b2f4ff", "#f1acceff", "#80eca8ff"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradientBorder}
//     >
//       <View style={styles.card}>
//         {/* TOP */}
//         <View style={styles.topRow}>
//           {/* TITLE (CLICKABLE) */}
//           <TouchableOpacity 
//             onPress={onPress} 
//             activeOpacity={0.7} 
//             style={{ flex: 1 }}
//           >
//             <Text style={styles.title} numberOfLines={2}>
//               {title}
//             </Text>
//           </TouchableOpacity>

//           {/* AVATAR (Independent - usually goes to user profile) */}
//           <TouchableOpacity onPress={onMore || (() => {})}>
//             <Image source={imageSource} style={styles.avatar} />
//           </TouchableOpacity>
//         </View>

//         {/* BOTTOM */}
//         <View style={styles.bottomRow}>
//           {/* TAG (CLICKABLE) */}
//           <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
//             <Text style={styles.tag}>#{tag}</Text>
//           </TouchableOpacity>

//           {/* LIKE BUTTON (Independent) */}
//           <TouchableOpacity onPress={onLike} style={styles.voteRow}>
//             <Image
//               source={require("../assets/images/arr.png")}
//               style={styles.arrow}
//             />
//             <Text style={styles.count}>{likesCount}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradientBorder: {
//     padding: 1.3,
//     borderRadius: 16,
//     marginRight: 10,
//   },

//   card: {
//     width: 280,
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingVertical: 8,
//     paddingHorizontal: 11,
//   },

//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   title: {
//     flex: 1,
//     fontSize: 20,
//     fontFamily: fonts.bold,
//     color: "#000",
//     marginRight: 10,
//   },

//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 22,
//   },

//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 7,
//   },

//   tag: {
//     fontSize: 16,
//     // color: "#5f5e5eff",
//     color: "#3B82F6",
//     fontFamily: fonts.bold,
//   },

//   voteRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 2,
//   },

//   arrow: {
//     width: 17,
//     height: 17,
//     resizeMode: "contain",
//     tintColor: "#16a34a",
//   },

//   count: {
//     fontSize: 16,
//     marginRight: 3,
//     fontFamily: fonts.bold,
//     color: "#16a34a", 
//     fontWeight: "600"
//   },
// });


import { fonts } from "@/constants/fonts";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  title: string;
  tag: string;
  votes: number;
  avatar?: any; 
  onLike?: () => void;
  onMore?: () => void;
  likesCount?: number;
  onPress?: () => void;
};

export default function PostCard({
  title,
  tag,
  avatar,
  onLike,
  onMore,
  likesCount,
  onPress,
}: Props) {
  const imageSource =
    avatar && typeof avatar === "string"
      ? { uri: avatar }
      : avatar || require("../assets/images/profile.png");

  // Calculates a responsive width: never wider than 280, but shrinks on tiny screens
  const CARD_WIDTH = Math.min(280, SCREEN_WIDTH * 0.75);

  return (
    <LinearGradient
      colors={["#b1b2f4ff", "#f1acceff", "#80eca8ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        {/* TOP */}
        <View style={styles.topRow}>
          <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.7} 
            style={styles.titleContainer}
          >
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onMore || (() => {})}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={imageSource} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* BOTTOM */}
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.tag}>#{tag}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onLike} 
            style={styles.voteRow}
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
          >
            <Image
              source={require("../assets/images/arr.png")}
              style={styles.arrow}
            />
            <Text style={styles.count}>{likesCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    padding: 1.3,
    borderRadius: 16,
    marginRight: 10,
    alignSelf: 'flex-start', // Ensures the border wraps the width tightly
  },

  card: {
    // Width is now handled dynamically in the component body
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 11,
    minHeight: 100, // Ensures consistency if titles are short
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed to top-aligned for better 2-line title look
    justifyContent: "space-between",
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#000",
    marginRight: 10,
    lineHeight: 24, // Added for better readability on 2 lines
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  tag: {
    fontSize: 16,
    color: "#3B82F6",
    fontFamily: fonts.bold,
  },

  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  arrow: {
    width: 17,
    height: 17,
    resizeMode: "contain",
    tintColor: "#16a34a",
  },

  count: {
    fontSize: 16,
    marginRight: 3,
    fontFamily: fonts.bold,
    color: "#16a34a", 
    fontWeight: "600"
  },
});