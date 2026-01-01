import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SansationRegular: require("../assets/fonts/Sansation/Sansation-Regular.ttf"),
    SansationBold: require("../assets/fonts/Sansation/Sansation-Bold.ttf"),
    SansationLight: require("../assets/fonts/Sansation/Sansation-Light.ttf"),
    SansationItalic: require("../assets/fonts/Sansation/Sansation-Italic.ttf"),
    SansationBoldItalic: require("../assets/fonts/Sansation/Sansation-BoldItalic.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home-onboard" />
        <Stack.Screen name="(tabs)" /> */}
      </Stack>
    </Provider>
  );
}
