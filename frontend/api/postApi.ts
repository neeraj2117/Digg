import { api } from "./api";
import { Post } from "../types/post";

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // getFeed: builder.query<
    //   { posts: Post[] },
    //   { category?: string; location?: string }
    // >({
    //   query: ({ category, location }) => {
    //     let url = `/posts?limit=50`;
    //     if (category && category !== "Trending") url += `&category=${category}`;
    //     if (location) url += `&location=${encodeURIComponent(location)}`;
    //     return url;
    //   },
    //   providesTags: ["Post"],
    // }),
    getFeed: builder.query<
      { posts: Post[] },
      { category?: string; location?: string; userId?: string } // Add userId here
    >({
      query: ({ category, location, userId }) => {
        let url = `/posts?limit=50`;
        if (category && category !== "Trending") url += `&category=${category}`;
        if (location) url += `&location=${encodeURIComponent(location)}`;
        if (userId) url += `&userId=${userId}`; // Add this line
        return url;
      },
      providesTags: ["Post"],
    }),

    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    createPost: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),

    likePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Post"],
    }),

    dislikePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/dislike`,
        method: "PUT",
      }),
      invalidatesTags: ["Post"],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useDeletePostMutation,
} = postApi;
