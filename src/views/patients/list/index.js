// ** User List Component
import { useEffect } from 'react'
import { useListMutation } from '../../../redux/rtkQuery/patient'
import Table from './Table'

// ** Styles
import '@styles/react/apps/app-users.scss'
import LoadSpinner from '../../../@core/components/spinner/loaders'
import { useTranslation } from 'react-i18next'
import { useOverviewMutation } from '../../../redux/rtkQuery/admin'
import useHeaders from '@hooks/useHeaders'
const UsersList = () => {
  const headers = useHeaders()
  const {t} = useTranslation()
  const [getUsers, {data, isLoading}] = useListMutation() 
  const [overview] = useOverviewMutation()

  useEffect(() => {
    overview({headers})
  }, []) 
  useEffect(() => { getUsers() }, [])
    return (
      <div className='app-user-list'>
      <div className="d-flex justify-content-between align-items-end m-1 pt-25">
        <div className="d-flex flex-column">
          <h3>{t("Patients management")}</h3>
          <p className="mb-0">
            {t(
              "Here is a list of patients within Hospital Foundation, which you can manage simply through this page."
            )}
          </p>
        </div>
      </div>
        {
          isLoading ? <LoadSpinner/> : <Table users={data}/> 
        }
      </div>
    )
}

export default UsersList
