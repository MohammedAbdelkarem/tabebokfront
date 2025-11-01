// transactionSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const transactionSlice = createApi({
  reducerPath: "transactionSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    list: builder.mutation({
      query: () => ({
        url: `/payment/log`,
        method: "GET"
      })
    }),
    pay: builder.mutation({
      query: ({body}) => ({
        url: `/payment`,
        body,
        method: "POST"
      })
    })
  })
})

export const { useListMutation, usePayMutation } = transactionSlice