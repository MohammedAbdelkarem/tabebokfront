// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { system_url } from "../../../constant/url"

export const faqCategorySlice = createApi({
  reducerPath: "faqCategorySlice",
  baseQuery: fetchBaseQuery({ baseUrl: system_url }),
  endpoints: (builder) => ({
    get: builder.mutation({
      query: ({ headers, type }) => ({
        url: `/faq-category?app=${type}`,
        headers,
        method: "GET"
      })
    }),
    apps: builder.mutation({
      query: ({ headers }) => ({
        url: `/faq-category/apps`,
        headers,
        method: "GET"
      })
    }),
    store: builder.mutation({
      query: ({ headers, body }) => ({
        url: `/faq-category`,
        headers,
        body,
        method: "POST"
      })
    }),
    update: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `/faq-category/${id}`,
        headers,
        body,
        method: "PUT"
      })
    }),
    delete: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/faq-category/${id}`,
        headers,
        method: "DELETE"
      })
    })
  })
})

export const { useGetMutation,
               useDeleteMutation,
               useStoreMutation,
               useUpdateMutation,
               useAppsMutation
              } = faqCategorySlice