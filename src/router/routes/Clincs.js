// ** React Imports
import { lazy } from 'react'

const Clinics = lazy(() => import('../../views/clinics'))
const ClinicProfile = lazy(() => import('../../views/clinics/profile'))

const ClincsRoutes = [
  {
    path: '/clinics',
    element: <Clinics />
  },
  {
    path: '/clinics/profile/:name',
    element: <ClinicProfile />
  }
]

export default ClincsRoutes
