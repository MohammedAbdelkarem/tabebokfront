// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { system_url } from "../../constant/url"

export const settingsSlice = createApi({
  reducerPath: "settingsSlice",
  baseQuery: fetchBaseQuery({ baseUrl: system_url }),
  endpoints: (builder) => ({
    get: builder.mutation({
      query: ({ headers }) => ({
        url: `/settings`,
        headers,
        method: "GET"
      })
    }),
    update: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `/settings/${id}`,
        headers,
        body,
        method: "PUT"
      })
    })
  })
})

export const { useGetMutation, useUpdateMutation } = settingsSlice