import { api } from "./api";
import { Notification } from "../types/notification";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Use the interface here instead of any[]
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationApi;