// ** React Imports
import { Fragment, useMemo, useState } from 'react'

// ** Reactstrap Imports
import { Card, CardImg, CardTitle, CardBody, CardText, Row, Col, CardHeader, Button, Alert, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
// import { useDeleteMutation, useGetMutation } from '../../../../redux/rtkQuery/content/story'
import useHeaders from '../../../../utility/hooks/useHeaders'
import { useTranslation } from 'react-i18next'
import { Edit, MoreVertical, Trash2 } from 'react-feather'
import SystemModal from '../../../components/systemModal'
import SuccessAlert from '../../../components/handleStatusCode/success'
import ErrorAlert from '../../../components/handleStatusCode/error'
import DescriptionCell from '../../../components/DescriptionCell'
import EmptyComponent from '../../../components/empty'
import { useDeleteMutation, useGetQuery } from '../../../../redux/rtkQuery/content/category'
import Base from '../../../../assets/images/base/logo.png'
import SidebarCategory from './sidebar'
import LoadSpinner from '../../../../@core/components/spinner/loaders'
import { useNavigate } from 'react-router-dom'
const CategoryManagement = ({}) => {
  const headers = useHeaders()
  const {t} = useTranslation()
  const navigate = useNavigate()
  // ** State
  const [modal, setModal] = useState(false)
  const [managementModal, setManagementModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  // ** Method
  const [remove, {data:removeData, isLoading:removing, status:removeStatus, error:removeError}] = useDeleteMutation()
  const {data, isFetching} = useGetQuery({headers})

  const toggleSidebar = () => {
    setManagementModal(false)
    setSelected(null)
  }
  const handleRemove = (item) => {
    setSelected(item)
    setModal(true)
  }
  const handleUpdate = (item) => {
    setSelected(item)
    setManagementModal(true)
  }
  const handleClose = () => {
    setSelected(null)
    setModal(false)
  }
  useMemo(() => {
    if (removeStatus === 'fulfilled') {
      SuccessAlert({
        title: t('Success'),
        body: removeData?.message,
        position: 'top-left'
      })
      handleClose()
    } else if (removeStatus === 'rejected') {
      ErrorAlert({
        title: t('Failed'),
        body: removeError?.data?.message,
        button: t('Done')
      })
      handleClose()
    }
  }, [removeStatus])
  const handleOpen = () => {
    setManagementModal(true)
    setSelected(null)
  }
  return (
    <Fragment>
      <Row>
        <CardHeader style={{display:'flex', justifyContent:'space-between', padding:'10px'}}>
          <CardTitle tag='h4'>{t('Cateogries list')}</CardTitle>
          <Button color='primary' outline onClick={() => handleOpen()}>
            {t('Add new')}
          </Button>
        </CardHeader>
        <div style={{height:'60vh', overflowY:'auto'}}>
          <Row>
        {
            isFetching ? <LoadSpinner/> : data?.data?.length === 0 ? <EmptyComponent title={t('No Data')} body={t('No Cateogries added')}/> : data?.data?.map((item) => (
                <Col md='3' sm='4' xs="12">
                  <Card className="mb-2 px-2 py-2" style={{
                    borderRight: '5px solid #06deda',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    borderRadius: '0.5rem'
                  }}>
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Left section: icon + name */}
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item?.media?.length === 0 ? Base : item.media[0]?.url}
                          alt={item.name}
                          height="40"
                          width="40"
                          style={{ objectFit: 'contain', borderRadius: '0.25rem', backgroundColor: '#f1f3f5' }}
                        />
                        <div>
                          <CardTitle
                            tag="h5"
                            className="mb-0 fw-bold"
                            title={item.name}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/subcategories/${item.name}`, { state: item.id })}
                          >
                            {item.name}
                          </CardTitle>
                        </div>
                      </div>

                      {/* Right section: Dropdown Menu */}
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="div"
                          className="d-flex align-items-center justify-content-center"
                          style={{ cursor: 'pointer', padding: '6px' }}
                        >
                          <MoreVertical size={20} className="text-secondary" />
                        </DropdownToggle>
                        <DropdownMenu end style={{ minWidth: '160px' }}>
                          <div
                            onClick={() => handleUpdate(item)}
                            style={{
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              width: '100%',
                              userSelect: 'none'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit size={14} className="me-2 text-primary" />
                            <span>{t('Edit')}</span>
                          </div>

                          <div
                            onClick={() => handleRemove(item)}
                            style={{
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              width: '100%',
                              userSelect: 'none'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} className="me-2 text-danger" />
                            <span>{t('Delete')}</span>
                          </div>
                        </DropdownMenu>

                      </UncontrolledDropdown>

                    </div>
                  </Card>
                </Col>
            ))
        } 
        </Row>
        </div>
      </Row>
      <SidebarCategory open={managementModal} toggleSidebar={toggleSidebar} selectedItem={selected}/>
        <SystemModal show={modal}
                     setShow={setModal} 
                     title={`${t('Remove this category')} (${selected?.name}) !`} 
                     onReomve={() => remove({headers, id:selected?.id})}
                     isRemoving={removing}
                     status={removeStatus}
                     message={removeError?.data?.message}>
                <Alert color='warning'>
                  <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                  <div className='alert-body' style={{fontSize:'11px'}}>
                  {t('Are you sure you want to remove this category? it will not shown to users!!')}
                  </div>
                </Alert>
        </SystemModal>
    </Fragment>
  )
}

export default CategoryManagement
