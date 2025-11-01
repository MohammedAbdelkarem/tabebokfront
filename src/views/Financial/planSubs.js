import { Fragment, useEffect, useState } from 'react'
import { Card, Input, Row, Col, Badge } from 'reactstrap'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useLocation } from 'react-router-dom'
import { useLogMutation } from '../../redux/rtkQuery/plan'
import LoadSpinner from '../../@core/components/spinner/loaders'
import Avatar from '@components/avatar'


const renderClient = row => {
  if (row.avatar.length) {
    return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        content={row.name}
        color={'light-warning'}
      />
    )
  }
}

// Table columns
const columns = [
  {
    name: 'اسم العيادة',
    selector: row => row.clinic_name,
    sortable: true,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        <Avatar
          initials
          className='me-1'
          content={row.clinic_name}
          color={'light-primary'}
        />
        <div className='d-flex flex-column'>
          <span className='fw-bold'>{row.clinic_name}</span>
        </div>
      </div>
    )
  },
  {
    name: 'الوصف',
    selector: row => row.bio,
    sortable: true,
    cell: row => <span>{row.bio || '—'}</span>
  },
  {
    name: 'العنوان',
    selector: row => row.address_text,
    sortable: true
  },
  {
    name: 'رقم الترخيص',
    selector: row => row.license_number,
    sortable: true
  },
  {
    name: 'نوع المنشأة',
    selector: row => row.is_center,
    sortable: true,
    cell: row => (
      <Badge color={row.is_center ? 'light-success' : 'light-warning'}>
        {row.is_center ? 'مركز طبي' : 'عيادة'}
      </Badge>
    )
  },
  {
    name: 'التقييم',
    selector: row => row.rate,
    sortable: true,
    cell: row => <span>{row.rate ?? 0}/5 ⭐</span>
  }
]


const CustomHeader = ({ handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Entries</label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pe-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              type='text'
              value={searchTerm}
              id='search-invoice'
              className='ms-50 w-100'
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}


const PlanSubscriptions = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const state = useLocation()?.state
  const [show, {data, isLoading}] = useLogMutation()
  const subscriptionData = data?.data?.subscriped_doctors || []
  useEffect(() => {
    if (state) {
      show({ id: state?.id })
    }
  }, [state])

  const handlePageChange = selected => {
    setCurrentPage(selected.selected)
  }

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    setCurrentPage(0)
  }

  const handleFilter = val => {
    setSearchTerm(val)
    setCurrentPage(0)
  }

const filteredData = subscriptionData.filter(item =>
  item.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.address_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
)

  const paginatedData = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

  const CustomPagination = () => {
    return (
      <ReactPaginate
        pageCount={Math.ceil(filteredData.length / rowsPerPage)}
        onPageChange={handlePageChange}
        nextLabel=''
        previousLabel=''
        breakLabel='...'
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        activeClassName='active'
        pageClassName='page-item'
        pageLinkClassName='page-link'
        containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        nextClassName='page-item next'
        nextLinkClassName='page-link'
        previousClassName='page-item prev'
        previousLinkClassName='page-link'
      />
    )
  }

  return (
    <Fragment>
      <h3>Plan Subscriptions</h3>
      <p className='mb-2'>
        some text some text some text some text some text some text some text some text some text 
      </p>
      {
        isLoading ? <LoadSpinner/> : <Card>
            <DataTable
            noHeader
            pagination
            paginationComponent={CustomPagination}
            columns={columns}
            data={paginatedData}
            subHeader
            subHeaderComponent={
                <CustomHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                searchTerm={searchTerm}
                />
            }
            className='react-dataTable'
            />
        </Card>
      }
    </Fragment>
  )
}

export default PlanSubscriptions
