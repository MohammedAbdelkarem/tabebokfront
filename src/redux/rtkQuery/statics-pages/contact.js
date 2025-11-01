// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { system_url } from "../../../constant/url"

export const contactSlice = createApi({
  reducerPath: "contactSlice",
  baseQuery: fetchBaseQuery({ baseUrl: system_url }),
  endpoints: (builder) => ({
    get: builder.mutation({
      query: ({ headers }) => ({
        url: `/contact-us`,
        headers,
        method: "GET"
      })
    }),
    show: builder.mutation({
      query: ({ headers, lang }) => ({
        url: `/contact-us/${lang}`,
        headers,
        method: "GET"
      })
    }),
    store: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/contact-us`,
        headers,
        body,
        method: "POST"
      })
    }),
    update: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `/contact-us/${id}`,
        headers,
        body,
        method: "PUT"
      })
    }),
    delete: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/contact-us/${id}`,
        headers,
        method: "DELETE"
      })
    }),
    types: builder.query({
      query: ({ headers}) => ({
        url: `/contact-us/types`,
        headers,
        method: "GET"
      })
    })
  })
})

export const { useGetMutation,
               useShowMutation,
               useStoreMutation,
               useUpdateMutation,
               useDeleteMutation,
               useTypesQuery } = contactSlice