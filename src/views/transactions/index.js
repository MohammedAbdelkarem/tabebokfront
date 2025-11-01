import { Fragment, useEffect, useState } from "react"

import Breadcrumbs from '@components/breadcrumbs'
import LoadSpinner from "../../@core/components/spinner/loaders"
import { Badge, Button, Card, Col, Input, Row } from "reactstrap"
import { useListMutation } from "../../redux/rtkQuery/transaction"

import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'

const renderClient = user => {
  if (user?.avatar?.length) {
    return <Avatar className='me-1' img={user.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        content={user?.name}
        color={'light-warning'}
      />
    )
  }
}
const columns = [
  {
    name: 'اسم المستخدم',
    selector: row => row?.user?.name,
    sortable: true,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        {renderClient(row?.user)}
        <div className='d-flex flex-column'>
          <span className='fw-bold'>{row?.user?.name}</span>
          <small className='text-muted'>{row?.user?.phone_number}</small>
        </div>
      </div>
    )
  },
  {
    name: 'نوع العملية',
    selector: row => row?.type,
    sortable: true
  },
  {
    name: 'الوصف',
    selector: row => row?.description,
    sortable: true
  },
  {
    name: 'المبلغ',
    selector: row => row?.total_price,
    sortable: true,
    cell: row => <span>{row?.total_price?.toLocaleString()} ل.س</span>
  },
  {
    name: 'مزود الدفع',
    selector: row => row?.payment_provider,
    sortable: true
  },
  {
    name: 'تاريخ الإنشاء',
    selector: row => row?.created_at,
    sortable: true
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

const Transactions = () => {
    const [currentPage, setCurrentPage] = useState(0)
      const [rowsPerPage, setRowsPerPage] = useState(10)
      const [searchTerm, setSearchTerm] = useState('')
      const [show, {data, isLoading}] = useListMutation()
      const subscriptionData = data?.data || []
      useEffect(() => {
          show()
      }, [])
    
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
        item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Breadcrumbs title='Transactions management' data={[{ title: 'Transactions' }]} />
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

export default Transactions
