// ** React Imports
import { lazy } from 'react'

const Articles = lazy(() => import('../../views/articles'))
const ArticleProfile = lazy(() => import('../../views/articles/ArticleProfile'))

const ArticlesRoutes = [
  {
    path: '/articles',
    element: <Articles />
  },
  {
    path: '/articles/profile/:name',
    element: <ArticleProfile />
  }
]

export default ArticlesRoutes
