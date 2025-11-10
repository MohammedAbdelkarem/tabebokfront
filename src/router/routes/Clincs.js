// ** React Imports
import { lazy } from 'react'

const Clinics = lazy(() => import('../../views/clinics'))
const ClinicProfile = lazy(() => import('../../views/clinics/profile'))
const ClinicForm = lazy(() => import('../../views/clinics/create/management'))

const ClincsRoutes = [
  {
    path: '/clinics',
    element: <Clinics />
  },
  {
    path: '/clinics/profile/:name',
    element: <ClinicProfile />
  },
  {
    element: <ClinicForm />,
    path: '/clinics/management'
  }
]

export default ClincsRoutes
