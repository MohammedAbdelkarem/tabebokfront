
import { Fragment, useMemo, useState } from 'react'
import Avatar from '@components/avatar'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

import {
  Row,
  Col,
  Card,
  Input,
  Badge,
  Alert,
  Label,
  Button
} from 'reactstrap'


import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SystemModal from '../../components/systemModal'
import { useSendAllMutation } from '../../../redux/rtkQuery/notification'
import { Bell } from 'react-feather'
import { t } from 'i18next'
import SuccessAlert from '../../components/handleStatusCode/success'

const CustomHeader = ({ handlePerPage, rowsPerPage, handleFilter, searchTerm, setModal }) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
        <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
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
          </div>
        </Col>
        <Col xl='6' className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'>
          <Button.Ripple color='flat-primary' onClick={() => setModal(true)}>
            {`${t('Send Notification')} `}
            <Bell size={15}/>
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const UsersList = ({users}) => {
  const {t} = useTranslation()
  const [sendAll, {isLoading, status, error}] = useSendAllMutation()
  const [currentPage, setCurrentPage] = useState(0) 
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState(false) 
  const [form, setForm] = useState({
    title:'',
    body:''
  })
  const handleSend = () => {
    const body = new FormData()
    body.append('title', form.title)
    body.append('body', form.body)
    sendAll({body})
  }
  const handleClose = () => {
    setModal(false)
     setForm({
      title:'',
      body:''
    })
  }

  const handlePageChange = (selected) => {
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

  const filteredData = users?.data?.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedData = filteredData?.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
  const CustomPagination = () => {
    return (
      <ReactPaginate
        pageCount={Math.ceil(filteredData.length / rowsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        activeClassName='active'
        breakClassName='page-item'
        pageClassName={'page-item'}
        breakLinkClassName='page-link'
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    )
  }
  useMemo(() => {
    if (status === 'fulfilled') {
      handleClose()
      SuccessAlert({
        title: t('Success'),
        body: t('Notification sent successfully'),
        position: 'top-end'
      })
    }
  }, [status])

  const columns = [
    {
      name: t('Full name'),
      minWidth: '250px',
      cell: row => (
        <div className='d-flex align-items-center'>
          {
            row?.avatar === null ? (
              <Avatar content={row.name} initials />
            ) : (
              <Avatar img={row.avatar} content={row.name} />
            )
          }
          <div className='user-info text-truncate ms-1'>
            <Link to={`/patients/profile/${row.name}`} state={ row.id } className='d-block fw-bold text-truncate'>{row.name === null ? "Anonymous" : row.name}</Link>
          </div>
        </div>
      )
    },
    {
      name: t('Phone number'),
      center: true,
      minWidth: '150px',
      selector: row => <span dir='ltr'>{row.phone_number}</span>
    },
    {
      name: t('Join Date'),
      center: true,
      minWidth: '100px',
      selector: row => row.created_at?.slice(0, 10)
    },
    {
      name: t('Gender'),
      center: true,
      minWidth: '150px',
      cell: row => (
        <div className="d-flex flex-wrap gap-1">
          {row.is_male && <Badge color="light-secondary">{t('Male')}</Badge>}
          {!row.is_male && <Badge color="light-warning">{t('Female')}</Badge>}
        </div>
      )
    },
    {
      name: t('Status'),
      center: true,
      minWidth: '150px',
      cell: row => (
        <div className="d-flex flex-wrap gap-1">
          {row.is_active && <Badge color="light-success">{t('Active')}</Badge>}
          {row.is_banned && <Badge color="light-danger">{t('Banned')}</Badge>}
          {row.in_trash && <Badge color="light-warning">{t('In Trash')}</Badge>}
        </div>
      )
    }
  ]
  

  return (
    <Fragment>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            pagination
            responsive
            paginationServer
            columns={columns}
            data={paginatedData}
            paginationComponent={CustomPagination}
            subHeaderComponent={
              <CustomHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                searchTerm={searchTerm}
                setModal={setModal}
              />
            }
          />
        </div>
      </Card>
      {
        modal && (
        <SystemModal show={modal}
                      setShow={handleClose} 
                      title={`${t('Notify all users')}!`} 
                      onReomve={() => handleSend()}
                      isRemoving={isLoading}
                      status={status}
                      message={error?.data?.message}
                      disabled={form.title === '' || form.body === ''}>
                <Alert color='warning'>
                  <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                  <div className='alert-body' style={{fontSize:'11px'}}>
                  {t(`You're going to send a notification to all (${users?.pagination_data?.total}) users of the system.`)}
                  </div>
                </Alert>
                  <Label className='form-label' for='card-name'>
                    {t('Notification Title')}
                  </Label>
                  <Input id='card-name' placeholder='Notification Title' onChange={(e) => setForm({...form, title:e.target.value})}/>
                  <Label className='form-label mt-2' for='card-name'>
                    {t('Body')}
                  </Label>
                  <Input id='card-name' type='textarea' rows={3} placeholder='Notification Body' onChange={(e) => setForm({...form, body:e.target.value})}/>
        </SystemModal>
        )
      }
    </Fragment>
  )
}

export default UsersList
