import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://diggg-it.vercel.app/api",
  baseUrl: "https://diggg-it.vercel.app",
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Intercept 401 errors
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("🚨 Token expired. Redirecting to login...");

    await AsyncStorage.removeItem("token");

    // redirect to login
    router.replace("/login");
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Post", "Comment", "User", "Notification"],
  endpoints: () => ({}),
});
