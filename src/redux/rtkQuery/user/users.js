// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { user_url } from "../../../constant/url"

export const userSlice = createApi({
  reducerPath: "userSlice",
  baseQuery: fetchBaseQuery({ baseUrl: user_url }),
  endpoints: (builder) => ({
    list: builder.mutation({
      query: ({ headers, filterOptions}) => ({
        url: `/list?${filterOptions}`,
        headers,
        method: "GET"
      })
    }),
    profile: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/profile/${id}`,
        headers,
        method: "GET"
      })
    }),
    sugs: builder.mutation({
      query: ({ headers, search }) => ({
        url: `/sugs?search=${search}`,
        headers,
        method: "GET"
      })
    }),
    restore: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/restore`,
        headers,
        body,
        method: "POST"
      })
    }),
    unban: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/ban/remove`,
        headers,
        body,
        method: "POST"
      })
    }),
    ban: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/ban`,
        headers,
        body,
        method: "POST"
      })
    })
  })
})

export const { useBanMutation,
               useListMutation,
               useProfileMutation,
               useUnbanMutation,
               useSugsMutation,
               useRestoreMutation } = userSlice