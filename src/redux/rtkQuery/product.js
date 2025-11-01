// productSlice.js
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithReauth from "./baseQuery"

export const productSlice = createApi({
  reducerPath: "productSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getById: builder.mutation({
      query: ({ id }) => ({
        url: `/product/list-profile?per_page=10&id=${id}`,
        method: "GET"
      })
    }),
    getFilter: builder.mutation({
      query: ({ filterOptions }) => ({
        url: `/product/list?${filterOptions}`,
        method: "POST"
      })
    }),
    reports: builder.mutation({
      query: ({ page, perPage, id }) => ({
        url: `/reports?filter=إعلان&id=${id}&page=${page}&per_page=${perPage}`,
        method: "GET"
      })
    }),
    show: builder.mutation({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: "GET"
      })
    }),
    update: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/${id}`,
        body,
        method: "POST"
      })
    }),
    sugs: builder.mutation({
      query: ({ key }) => ({
        url: `/product/sugs?search=${key}`,
        method: "GET"
      })
    }),
    hide: builder.mutation({
      query: ({ id }) => ({
        url: `/product/hide/${id}`,
        method: "GET"
      })
    }),
    soft: builder.mutation({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: "DELETE"
      })
    }),
    force: builder.mutation({
      query: ({ id }) => ({
        url: `/product/force-delete/${id}`,
        method: "DELETE"
      })
    }),
    restore: builder.mutation({
      query: ({ id }) => ({
        url: `/product/restore/${id}`,
        method: "GET"
      })
    }),
    rates: builder.mutation({
      query: ({ id }) => ({
        url: `/rate/product/${id}?per_page=100`,
        method:'GET'
      })
    })
  })
})

export const { useGetByIdMutation,
               useGetFilterMutation,
               useShowMutation,
               useSugsMutation,
               useHideMutation,
               useSoftMutation,
               useForceMutation,
               useRestoreMutation,
               useReportsMutation,
               useRatesMutation,
               useUpdateMutation
             } = productSlice