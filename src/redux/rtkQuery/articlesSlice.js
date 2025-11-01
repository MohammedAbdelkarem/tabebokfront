import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ** Get token from localStorage
const getToken = () => {
  return localStorage.getItem('accessToken')
}

// ** Base query with auth
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_ENDPOINT}/api/admin/`,
  prepareHeaders: (headers) => {
    const token = getToken()
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Accept', 'application/json')
    return headers
  }
})

export const articlesSlice = createApi({
  reducerPath: 'articlesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    // ** List Articles with Pagination
    listArticles: builder.mutation({
      query: (params = {}) => ({
        url: 'article/filter',
        method: 'GET',
        params: {
          page: params.page || 1,
          per_page: params.per_page || 12,
          search: params.search || '',
          ...params
        }
      }),
      providesTags: ['Article']
    }),

    // ** Get Single Article
    getArticle: builder.mutation({
      query: (id) => ({
        url: `article/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Article', id }]
    }),

    // ** Create Article
    createArticle: builder.mutation({
      query: (data) => ({
        url: 'article',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Article']
    }),

    // ** Update Article
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `article/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }, 'Article']
    }),

    // ** Delete Article
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `article/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Article']
    }),

    // ** Like Article
    likeArticle: builder.mutation({
      query: (id) => ({
        url: `article/${id}/like`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }]
    }),

    // ** Unlike Article
    unlikeArticle: builder.mutation({
      query: (id) => ({
        url: `article/${id}/unlike`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }]
    }),

    // ** Get Article Comments
    getArticleComments: builder.mutation({
      query: ({ id, page = 1 }) => ({
        url: `article/${id}/comments`,
        method: 'GET',
        params: { page }
      })
    }),

    // ** Add Comment to Article
    addComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `article/${id}/comment`,
        method: 'POST',
        body: { comment }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }]
    }),

    // ** Delete Comment
    deleteComment: builder.mutation({
      query: ({ articleId, commentId }) => ({
        url: `article/${articleId}/comment/${commentId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { articleId }) => [{ type: 'Article', id: articleId }]
    }),

    // ** Search Articles
    searchArticles: builder.mutation({
      query: (searchParams) => ({
        url: 'article/search',
        method: 'GET',
        params: searchParams
      })
    }),

    // ** Get Featured Articles
    getFeaturedArticles: builder.mutation({
      query: (params = {}) => ({
        url: 'article/featured',
        method: 'GET',
        params
      })
    }),

    // ** Get Articles by Category
    getArticlesByCategory: builder.mutation({
      query: ({ categoryId, ...params }) => ({
        url: `article/category/${categoryId}`,
        method: 'GET',
        params
      })
    }),

    // ** Get Articles by Author
    getArticlesByAuthor: builder.mutation({
      query: ({ authorId, ...params }) => ({
        url: `article/author/${authorId}`,
        method: 'GET',
        params
      })
    }),

    // ** Toggle Article Status
    toggleArticleStatus: builder.mutation({
      query: (id) => ({
        url: `article/${id}/toggle-status`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }, 'Article']
    }),

    // ** Bulk Delete Articles
    bulkDeleteArticles: builder.mutation({
      query: (ids) => ({
        url: 'article/bulk-delete',
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Article']
    }),

    // ** Get Article Analytics
    getArticleAnalytics: builder.mutation({
      query: (id) => ({
        url: `article/${id}/analytics`,
        method: 'GET'
      })
    }),

    // ** Report Article
    reportArticle: builder.mutation({
      query: ({ id, reason }) => ({
        url: `article/${id}/report`,
        method: 'POST',
        body: { reason }
      })
    }),

    // ** Share Article
    shareArticle: builder.mutation({
      query: ({ id, platform }) => ({
        url: `article/${id}/share`,
        method: 'POST',
        body: { platform }
      })
    })
  })
})

export const {
  useListArticlesMutation,
  useGetArticleMutation,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
  useGetArticleCommentsMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useSearchArticlesMutation,
  useGetFeaturedArticlesMutation,
  useGetArticlesByCategoryMutation,
  useGetArticlesByAuthorMutation,
  useToggleArticleStatusMutation,
  useBulkDeleteArticlesMutation,
  useGetArticleAnalyticsMutation,
  useReportArticleMutation,
  useShareArticleMutation
} = articlesSlice

export default articlesSlice.reducer
