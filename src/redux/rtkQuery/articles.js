// articleSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const articleSlice = createApi({
  reducerPath: "articleSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: ({ filterOptions }) => ({
        url: `/article/filter?${filterOptions}`,
        method: "GET"
      })
    }),
    details: builder.mutation({
      query: ({ id }) => ({
        url: `/article/show/${id}`,
        method: "GET"
      })
    }),
    delete: builder.mutation({
      query: ({id}) => ({
        url: `/article/delete/${id}`,
        method: "DELETE"
      })
    }),
    removeComment: builder.mutation({
      query: ({ id }) => ({
        url: `/article/reactions/deleteComment/${id}`,
        method: "DELETE"
      })
    }),
    removeReplay: builder.mutation({
      query: ({ id }) => ({
        url: `/article/reactions/deleteReplay/${id}`,
        method: "DELETE"
      })
    }),
    addComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/article/reactions/addComment/${id}`,
        method: "POST",
        body: { comment }
      })
    }),
    addReply: builder.mutation({
      query: ({ commentId, reply }) => ({
        url: `/article/reactions/addReplay/${commentId}`,
        method: "POST",
        body: { reply }
      })
    }),
    likeArticle: builder.mutation({
      query: ({ id }) => ({
        url: `/article/reactions/like/${id}`,
        method: "POST"
      })
    })
  })
})

export const {
  useListMutation,
  useDetailsMutation,
  useDeleteMutation,
  useRemoveCommentMutation,
  useRemoveReplayMutation,
  useAddCommentMutation,
  useAddReplyMutation,
  useLikeArticleMutation
} = articleSlice