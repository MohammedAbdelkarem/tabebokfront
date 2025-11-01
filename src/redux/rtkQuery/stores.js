// storeSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const storeSlice = createApi({
  reducerPath: "storeSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    get: builder.mutation({
      query: ({ filterOptions }) => ({
        url: `/store?${filterOptions}`,
        method: "GET"
      })
    }),
    reports: builder.mutation({
      query: ({ page, perPage, id }) => ({
        url: `/reports?filter=ملف المستخدم&id=${id}&page=${page}&per_page=${perPage}`,
        method: "GET"
      })
    }),
    show: builder.mutation({
      query: ({ id }) => ({
        url: `/store/${id}`,
        method:'GET'
      })
    }),
    hide: builder.mutation({
      query: ({ id }) => ({
        url: `/store/hide/${id}`,
        method:'GET'
      })
    }),
    summary: builder.mutation({
      query: ({ id }) => ({
        url: `/rate/store/summary/${id}`,
        method:'GET'
      })
    }),
    rates: builder.mutation({
      query: ({ id }) => ({
        url: `/rate/store/${id}?per_page=100`,
        method:'GET'
      })
    })
  })
})

export const { useGetMutation, useShowMutation, useHideMutation, useReportsMutation, useSummaryMutation, useRatesMutation } = storeSlice