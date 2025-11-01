// ** React Imports
import { lazy } from 'react'

const ReportsManagement = lazy(() => import('../../views/reports'))

const ReportsRoutes = [
  {
    element: <ReportsManagement />,
    path: '/reports'
  }
]

export default ReportsRoutes
