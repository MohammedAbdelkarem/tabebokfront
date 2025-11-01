// ** User List Component
import { useEffect, useState } from 'react'
import { useListMutation } from '../../../redux/rtkQuery/user/users'
import Table from './Table'
// ** Custom Components
import Statistics from './statistics'

// ** Styles
import '@styles/react/apps/app-users.scss'
import UserFilter from './filters'
import LoadSpinner from '../../../@core/components/spinner/loaders'
import { useTranslation } from 'react-i18next'
import useHeaders from '../../../utility/hooks/useHeaders'
const UsersList = () => {
  const {t} = useTranslation()
  const headers = useHeaders()
  const [date, setDate] = useState(new Date())  
  const [role_id, setRole_id] = useState(null)
  const [filtersArr, setFiltersArr] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [perPage, setPerPage] = useState(15)
  const [getUsers, {data, isLoading}] = useListMutation()  
  const fetchUsers = (page = 1, perPageValue = perPage, searchValue = '') => {
    // Create filters for pagination and search
    const pageFilter = `&page=${page}`
    const perPageFilter = `&per_page=${perPageValue}`
    
    // Update or add page and per_page filters
    let updatedFilters = [...filtersArr.filter(f => f.key !== 'page' && f.key !== 'per_page' && f.key !== 'search')]
    
    // Add pagination filters
    updatedFilters.push({ key: 'page', value: pageFilter, label: null })
    updatedFilters.push({ key: 'per_page', value: perPageFilter, label: null })
    
    // Add search filter if provided
    if (searchValue) {
      updatedFilters.push({ key: 'search', value: `&search=${searchValue}`, label: searchValue })
    }
    
    setFiltersArr(updatedFilters)
    setCurrentPage(page)
    setPerPage(perPageValue)
  }
  useEffect(() => {
    if (role_id !== null) {
      // Remove existing role_id, page, and per_page filters
      const filteredArr = filtersArr.filter(filter => !['role_id', 'page', 'per_page'].includes(filter.key))

      // Add new role_id filter and reset page to 1 and per_page to current perPage
      const newFilters = [
        ...filteredArr,
        {
          value: `&role_id=${role_id}`,
          label: `${role_id === 4 ? t('مريض') : role_id === 3 ? t('عيادة') : role_id === 1 ? t('الكل') : ''}`,
          key: 'role_id'
        },
        { key: 'page', value: `&page=1`, label: null },
        { key: 'per_page', value: `&per_page=${perPage}`, label: null }
      ]

      setFiltersArr(newFilters)
      setCurrentPage(1) // Reset current page to 1 here
    }
  }, [role_id])

  useEffect(() => {
    if (filtersArr.length > 0) {
      const responseFilterArr = filtersArr.map(filter => filter.value).join('')
      
      getUsers({
        headers,
        filterOptions: responseFilterArr
      }).then(response => {
        if (response?.data?.pagination_data) {
          setTotalPages(Math.ceil(response.data.pagination_data.total / perPage))
          setCurrentPage(response.data.pagination_data.current_page || 1)
        }
      })
    }
  }, [filtersArr])

  // Initialize with default filters
  useEffect(() => {
    // Add default pagination filters on component mount
    if (!filtersArr.some(f => f.key === 'page') && !filtersArr.some(f => f.key === 'per_page')) {
      fetchUsers(1)
    }
  }, [])

  return (
    <div className='app-user-list'>
      <Statistics/>
      <UserFilter
        theFinction={getUsers}
        trader={role_id}
        date={date}
        setTrader={setRole_id}
        setDate={setDate}
        filtersArr={filtersArr}
        setFiltersArr={setFiltersArr}
        setCurrentPage={setCurrentPage}
      />
      {
        isLoading ? <LoadSpinner/> : 
        <Table
          users={data}
          setRole_id={setRole_id}
          role_id={role_id}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={fetchUsers}
        />
      }
    </div>
  )
}

export default UsersList
