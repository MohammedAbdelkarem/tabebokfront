// addonsSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const addonsSlice = createApi({
  reducerPath: "addonsSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: () => ({
        url: `/addons`,
        method: "GET"
      })
    }),
    log: builder.mutation({
      query: ({ id }) => ({
        url: `/addons/log?addon_id=${id}`,
        method: "GET"
      })
    }),
    assign: builder.mutation({
      query: ({body}) => ({
        url: `/addons/assign`,
        body,
        method: "POST"
      })
    })
  })
})

export const { useListMutation, useLogMutation, useAssignMutation } = addonsSlice