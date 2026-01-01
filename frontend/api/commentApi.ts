import { api } from "./api";
import { Comment } from "../types/comment";

export const commentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (postId) => `/comments/${postId}`,
      providesTags: ["Comment"],
    }),

    addComment: builder.mutation<
      Comment, // or 'any' if you haven't defined the return type
      { postId: string; text: string; parentId?: string | null } // Add this line
    >({
      query: ({ postId, text, parentId }) => ({
        url: `/comments/${postId}`,
        method: "POST",
        body: { text, parentId }, // Now sending parentId to the backend
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    likeComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
