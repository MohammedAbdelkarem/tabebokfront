// reservationSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const reservationSlice = createApi({
  reducerPath: "reservationSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    filter: builder.mutation({
      query: ({filterOptions}) => ({
        url: `/reservation/filter?${filterOptions}`,
        method: "GET"
      })
    }),
    list: builder.mutation({
      query: ({id}) => ({
        url: `/reservation/get/${id}`,
        method: "GET"
      })
    }),
    listPatients: builder.mutation({
      query: ({id}) => ({
        url: `/reservation/getPatient/${id}`,
        method: "GET"
      })
    }),
    show: builder.mutation({
      query: ({ id }) => ({
        url: `/reservation/details/${id}`,
        method: "GET"
      })
    }),
    analysis: builder.mutation({
      query: ({ id }) => ({
        url: `/reservation/analysis/${id}`,
        method: "GET"
      })
    }),
    
    reject: builder.mutation({
      query: ({ id }) => ({
        url: `/reservation/reject_by_admin/${id}`,
        method: "GET"
      })
    })
  })
})

export const { useListMutation, useShowMutation, useAnalysisMutation, useListPatientsMutation, useFilterMutation, useRejectMutation } = reservationSlice