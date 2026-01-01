// import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
// import { useState } from "react";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// export default function ImageCarousel({ 
//   images = [], 
//   onPress 
// }: { 
//   images: string[], 
//   onPress?: () => void 
// }) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Use a slightly smaller width if the card has padding
//   const ITEM_WIDTH = SCREEN_WIDTH - 32; 

//   if (!images || images.length === 0) return null;

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={images}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         snapToAlignment="center"
//         decelerationRate="fast"
//         snapToInterval={ITEM_WIDTH}
//         keyExtractor={(_, i) => i.toString()}
//         onMomentumScrollEnd={(e) => {
//           const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
//           setActiveIndex(index);
//         }}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             onPress={onPress} 
//             activeOpacity={1} 
//             style={{ width: ITEM_WIDTH }}
//           >
//             <Image source={{ uri: item }} style={styles.image} />
//           </TouchableOpacity>
//         )}
//       />

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

// const styles = StyleSheet.create({
//   container: { position: "relative", borderRadius: 14, overflow: "hidden" },
//   image: { width: "100%", height: 230, resizeMode: "cover" },
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
//   dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#999", marginHorizontal: 3 },
//   activeDot: { backgroundColor: "#fff" },
// });


import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useState, useCallback } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageCarousel({ 
  images = [], 
  onPress 
}: { 
  images: string[], 
  onPress?: () => void 
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Exact same width calculation you had
  const ITEM_WIDTH = SCREEN_WIDTH - 32; 

  // Memoized scroll handler for better performance
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = e.nativeEvent.contentOffset.x;
    const index = Math.round(xPos / ITEM_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex, ITEM_WIDTH]);

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // These 3 props ensure the swipe "sticks" perfectly to the center
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        // scrollEventThrottle makes the index update feel snappy
        scrollEventThrottle={16}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={1} 
            // Ensures the touch area matches your image dimensions exactly
            style={{ width: ITEM_WIDTH }}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot, 
                activeIndex === index && styles.activeDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    position: "relative", 
    borderRadius: 14, 
    overflow: "hidden" 
  },
  image: { 
    width: "100%", 
    height: 230, // Kept your original height
    resizeMode: "cover" 
  },
  dotsContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)", // Kept your original color
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dot: { 
    width: 6, // Kept your original size
    height: 6, 
    borderRadius: 3, 
    backgroundColor: "#999", 
    marginHorizontal: 3 
  },
  activeDot: { 
    backgroundColor: "#fff" 
  },
});