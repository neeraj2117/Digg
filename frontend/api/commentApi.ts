import { api } from "./api";
import { Comment } from "../types/comment";
import { postApi } from "./postApi";

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

    // likeComment: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/comments/${id}/like`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: ["Comment"],
    // }),
    // commentApi.ts

likeComment: builder.mutation<void, string>({
  query: (commentId) => ({
    url: `/comments/${commentId}/like`,
    method: "PUT",
  }),
  async onQueryStarted(commentId, { dispatch, queryFulfilled, getState }) {
    const state: any = getState();
    // Fetch your ID from the user query cache
    const myUserId = state.api.queries['getMe(undefined)']?.data?._id;
    
    if (!myUserId) return;

    // We need to find which post this comment belongs to. 
    // In RTK Query, we look through the 'getComments' cache entries.
    const patchResults: any[] = [];

    // Loop through all active comment feeds to find the one containing this comment
    // (This ensures it works even if the user has multiple post threads open)
    for (const { endpointName, originalArgs } of postApi.util.selectInvalidatedBy(state, [{ type: 'Comment' }])) {
      if (endpointName === 'getComments') {
        const patch = dispatch(
          commentApi.util.updateQueryData('getComments', originalArgs, (draft: any[]) => {
            const comment = draft.find((c) => c._id === commentId);
            if (comment) {
              const isLiked = comment.likes.some((id: any) => (id._id || id) === myUserId);
              if (isLiked) {
                comment.likes = comment.likes.filter((id: any) => (id._id || id) !== myUserId);
              } else {
                comment.likes.push(myUserId);
              }
            }
          })
        );
        patchResults.push(patch);
      }
    }

    try {
      await queryFulfilled;
    } catch {
      // Rollback all patches if the server fails
      patchResults.forEach((patch) => patch.undo());
    }
  },
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
