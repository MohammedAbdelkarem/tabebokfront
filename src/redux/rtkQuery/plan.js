// planSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const planSlice = createApi({
  reducerPath: "planSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: () => ({
        url: `/plan`,
        method: "GET"
      })
    }),
    log: builder.mutation({
      query: ({ id }) => ({
        url: `/plan/${id}`,
        method: "GET"
      })
    }),
    create: builder.mutation({
      query: ({ body }) => ({
        url: `/plan`,
        body,
        method: "POST"
      })
    }),
    update: builder.mutation({
      query: ({ id, body }) => ({
        url: `/plan/${id}`,
        body,
        method: "PUT"
      })
    }),
    remove: builder.mutation({
      query: ({ id }) => ({
        url: `/plan/${id}`,
        method: "DELETE"
      })
    }),
    hide: builder.mutation({
      query: ({ id }) => ({
        url: `/plan/changePublishStatus/${id}`,
        method: "GET"
      })
    })
  })
})

export const { useListMutation, useLogMutation, useCreateMutation, useHideMutation, useRemoveMutation, useUpdateMutation } = planSlice