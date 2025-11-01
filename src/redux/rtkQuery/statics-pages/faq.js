// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { system_url } from "../../../constant/url"

export const faqSlice = createApi({
  reducerPath: "faqSlice",
  baseQuery: fetchBaseQuery({ baseUrl: system_url }),
  endpoints: (builder) => ({
    get: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/faq-category/${id}`,
        headers,
        method: "GET"
      })
    }),
    store: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/faq`,
        headers,
        body,
        method: "POST"
      })
    }),
    update: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `/faq/${id}`,
        headers,
        body,
        method: "PUT"
      })
    }),
    delete: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/faq/${id}`,
        headers,
        method: "DELETE"
      })
    })
  })
})

export const { useGetMutation,
               useUpdateMutation,
               useStoreMutation,
               useDeleteMutation } = faqSlice