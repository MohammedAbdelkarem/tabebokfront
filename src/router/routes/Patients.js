// ** React Imports
import { lazy } from 'react'

const Patients = lazy(() => import('../../views/patients/list'))
const PatientsProfile = lazy(() => import('../../views/patients/profile'))

const PatientsRoutes = [
  {
    path: '/patients',
    element: <Patients />
  },
  {
    path: '/patients/profile/:name',
    element: <PatientsProfile />
  }
]

export default PatientsRoutes
