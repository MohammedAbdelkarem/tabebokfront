// patientSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const patientSlice = createApi({
  reducerPath: "patientSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: () => ({
        url: `/patients/get`,
        method: "GET"
      })
    }),
    details: builder.mutation({
      query: ({id}) => ({
        url: `/patient/relations/${id}`,
        method: "GET"
      })
    })
  })
})

export const { useListMutation, useDetailsMutation } = patientSlice