// clinicSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const clinicSlice = createApi({
  reducerPath: "clinicSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: ({filterOptions}) => ({
        url: `/doctors/get?${filterOptions}`,
        method: "GET"
      })
    }),
    show: builder.mutation({
      query: ({ id }) => ({
        url: `/doctors/profile/${id}`,
        method: "GET"
      })
    }),
    removeRate: builder.mutation({
      query: ({ id }) => ({
        url: `/doctors/rate/delete/${id}`,
        method: "DELETE"
      })
    })
  })
})

export const { useListMutation, useShowMutation, useRemoveRateMutation } = clinicSlice