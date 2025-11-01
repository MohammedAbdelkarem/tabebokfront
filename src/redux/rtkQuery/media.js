// ** Redux Imports
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// ** Import URL
import { admin_url } from "../../constant/url"

export const mediaSlice = createApi({
  reducerPath: "mediaSlice",
  baseQuery: fetchBaseQuery({ baseUrl: admin_url }),
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: ({ headers, body}) => ({
        url: `/media`,
        headers,
        body,
        method: "POST"
      })
    }),
    update: builder.mutation({
      query: ({ headers, body, id}) => ({
        url: `/media/${id}`,
        headers,
        body,
        method: "POST"
      })
    }),
    delete: builder.mutation({
      query: ({ headers, id }) => ({
        url: `/media/delete?ids[]=${id}`,
        headers,
        method: "DELETE"
      })
    })
  })
})

export const { useDeleteMutation, useUploadMutation, useUpdateMutation } = mediaSlice