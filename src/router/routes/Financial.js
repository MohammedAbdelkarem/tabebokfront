// ** React Imports
import { lazy } from 'react'

const PlansManagement = lazy(() => import('../../views/plans'))
const PlanSubscriptions = lazy(() => import('../../views/Financial/planSubs'))
const PlanForm = lazy(() => import('../../views/plans/management'))

const FinancialRoutes = [
  {
    element: <PlansManagement />,
    path: '/plans'
  },
  {
    element: <PlanSubscriptions />,
    path: '/plan-subscriptions/:name'
  },
  
  {
    element: <PlanForm />,
    path: '/plans/management'
  }
]

export default FinancialRoutes
