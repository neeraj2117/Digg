import { User } from "@/types/user";
import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get logged in user
    getMe: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    // Get ANY user by their ID
    getUserProfile: builder.query<any, string>({
      query: (id) => `/users/profile/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: `/users/search?q=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Handles the Follow/Request logic (as per our new backend logic)
    followUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/follow/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => ["User", { type: "User", id }, "Post"],
    }),

    acceptRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/accept-request/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    rejectRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/reject-request/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    getUserPosts: builder.query<any, string>({
      query: (id) => `/users/${id}/posts`,
      providesTags: ["Post"],
    }),
  }),
});

// Export ALL hooks so they are available in your screens
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useSearchUsersQuery,
  useUpdateProfileMutation,
  useGetUserProfileQuery,
  useFollowUserMutation,
  useAcceptRequestMutation, // ✅ Added
  useRejectRequestMutation, // ✅ Added
  useGetUserPostsQuery,
} = userApi;
