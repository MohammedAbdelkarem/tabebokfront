// ** React Imports
import { lazy } from 'react'

const ReservationsList = lazy(() => import('../../views/reservations'))
const ReservationProfile = lazy(() => import('../../views/reservations/profile'))

const ReservationsRoutes = [
  {
    path: '/reservations',
    element: <ReservationsList />
  },
  {
    path: '/reservations/:id',
    element: <ReservationProfile />
  }
]

export default ReservationsRoutes
