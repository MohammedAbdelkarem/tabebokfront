// ** React Imports
import { lazy } from 'react'

const Transactions = lazy(() => import('../../views/transactions'))

const TransactionsRoutes = [
  {
    path: '/transactions',
    element: <Transactions />
  }
]

export default TransactionsRoutes
