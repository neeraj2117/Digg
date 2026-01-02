import { api } from "./api";
import { Post } from "../types/post";

const handleLikeLogic = (post: any, userId: string) => {
  const isLiked = post.likes.some((id: any) => (id._id || id) === userId);
  if (isLiked) {
    post.likes = post.likes.filter((id: any) => (id._id || id) !== userId);
  } else {
    post.likes.push(userId);
    post.dislikes = post.dislikes.filter(
      (id: any) => (id._id || id) !== userId
    );
  }
};

const handleDislikeLogic = (post: any, userId: string) => {
  const isDisliked = post.dislikes.some((id: any) => (id._id || id) === userId);
  if (isDisliked) {
    post.dislikes = post.dislikes.filter(
      (id: any) => (id._id || id) !== userId
    );
  } else {
    post.dislikes.push(userId);
    post.likes = post.likes.filter((id: any) => (id._id || id) !== userId);
  }
};
export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

    // likePost: builder.mutation<void, string>({
    //   query: (postId) => ({
    //     url: `/posts/${postId}/like`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: ["Post"],
    // }),

    // dislikePost: builder.mutation<void, string>({
    //   query: (postId) => ({
    //     url: `/posts/${postId}/dislike`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: ["Post"],
    // }),

    // postApi.ts

    // postApi.ts

    likePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "PUT",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        // Adjust this path based on your actual state structure for userApi
        const myUserId = state.api.queries["getMe(undefined)"]?.data?._id;
        if (!myUserId) return;

        // 1. Update the Feed Cache
        const feedPatch = dispatch(
          postApi.util.updateQueryData(
            "getFeed" as any,
            { category: "Trending" } as any,
            (draft: any) => {
              const post = draft.posts.find((p: any) => p._id === postId);
              if (post) handleLikeLogic(post, myUserId);
            }
          )
        );

        // 2. Update the Post Details Cache
        const detailsPatch = dispatch(
          postApi.util.updateQueryData(
            "getPostById" as any,
            postId,
            (draft: any) => {
              if (draft) handleLikeLogic(draft, myUserId);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          feedPatch.undo();
          detailsPatch.undo();
        }
      },
    }),

    dislikePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/dislike`,
        method: "PUT",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const myUserId = state.api.queries["getMe(undefined)"]?.data?._id;
        if (!myUserId) return;

        const feedPatch = dispatch(
          postApi.util.updateQueryData(
            "getFeed" as any,
            { category: "Trending" } as any,
            (draft: any) => {
              const post = draft.posts.find((p: any) => p._id === postId);
              if (post) handleDislikeLogic(post, myUserId);
            }
          )
        );

        const detailsPatch = dispatch(
          postApi.util.updateQueryData(
            "getPostById" as any,
            postId,
            (draft: any) => {
              if (draft) handleDislikeLogic(draft, myUserId);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          feedPatch.undo();
          detailsPatch.undo();
        }
      },
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
