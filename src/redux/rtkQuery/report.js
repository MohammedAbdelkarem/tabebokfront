// reportSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const reportSlice = createApi({
  reducerPath: "reportSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    reports: builder.mutation({
      query: ({ filterOptions }) => ({
        url: `/reports?${filterOptions}`,
        method: "GET"
      })
    }),
    types: builder.mutation({
      query: ({ type }) => ({
        url: `/reports/types?type=${type}`,
        method: "GET"
      })
    }),
    filters: builder.mutation({
      query: () => ({
        url: `/reports/filters`,
        method: "GET"
      })
    }),
    action: builder.mutation({
      query: ({ id }) => ({
        url: `/reports/processed/${id}`,
        method: "POST"
      })
    })
  })
})

export const { useReportsMutation, useActionMutation, useFiltersMutation, useTypesMutation } = reportSlice