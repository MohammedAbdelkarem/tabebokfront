import {
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col
} from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import EmptyComponent from "../components/empty"
import './plan.css'
import { useTranslation } from 'react-i18next'
import { useHideMutation, useListMutation, useRemoveMutation } from '../../redux/rtkQuery/plan'
import { Fragment, useEffect, useMemo, useState } from 'react'
import LoadSpinner from '../../@core/components/spinner/loaders'
import { Edit, Trash2, MoreVertical, Eye } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import SystemModal from '../components/systemModal'
import SuccessAlert from '../components/handleStatusCode/success'
import ErrorAlert from '../components/handleStatusCode/error'
import useHeaders from '@hooks/useHeaders'
import { useOverviewMutation } from '../../redux/rtkQuery/admin'
const PlanActionsModal = ({ isOpen, toggle, onEdit, onDelete, onHide, selectedPlan }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {selectedPlan?.name || 'الخطة'}
      </ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem tag="button" onClick={onEdit} className="d-flex align-items-center gap-3">
            <Edit size={16} className="text-primary" /> تعديل الخطة
          </ListGroupItem>
          <ListGroupItem tag="button" onClick={onDelete} className="d-flex align-items-center gap-3">
            <Trash2 size={16} className="text-danger" /> حذف الخطة
          </ListGroupItem>
          <ListGroupItem tag="button" onClick={onHide} className="d-flex align-items-center gap-3">
            <Eye size={16} className="text-secondary" /> تفعيل/إلغاء تفعيل الخطة
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  )
}
const PlansManagement = () => {
  const {t} = useTranslation()
  const headers = useHeaders()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [modal, setModal] = useState(false)
  const [hideModal, setHideModal] = useState(false)
  // ** Method
  const [fetchPlan, {data:plansData, isLoading:fetchingPlans}] = useListMutation()  
  const plans = plansData ? plansData.data : []  
    
  const [overview] = useOverviewMutation()

  useEffect(() => {
    overview({headers})
  }, [])

    useEffect(() => {
        fetchPlan()
    }, [])
  const [remove, {data:removeData, isLoading:removing, status:removeStatus, error:removeError}] = useRemoveMutation()
  const [hide, {data:hideData, isLoading:hiding, status:hideStatus, error:hideError}] = useHideMutation()
  const toggleModal = () => setModalOpen(!modalOpen)

  const handleOpenActions = (plan) => {
    setSelectedPlan(plan)
    setModalOpen(true)
  }

  const handleEdit = () => {
    toggleModal()
    navigate('/plans/management', {state: selectedPlan})
  }

  const handleDelete = () => {
    toggleModal()
    setModal(true)
  }
  const handleHide = () => {
    toggleModal()
    setHideModal(true)
  }
  useMemo(() => {
    if (removeStatus === 'fulfilled') {
      SuccessAlert({
        title: t('Success'),
        body: removeData?.message,
        position: 'top-left'
      })
      setSelectedPlan(null)
      setModal(false)
      fetchPlan()
    } else if (removeStatus === 'rejected') {
      ErrorAlert({
        title: t('Failed'),
        body: removeError?.data?.message,
        button: t('Done')
      })
      setSelectedPlan(null)
      setModal(false)
    }
  }, [removeStatus])  
    
    
  useMemo(() => {
    if (hideStatus === 'fulfilled') {
      SuccessAlert({
        title: t('Success'),
        body: hideData?.message,
        position: 'top-left'
      })
      setSelectedPlan(null)
      setHideModal(false)
      fetchPlan()
    } else if (hideStatus === 'rejected') {
      ErrorAlert({
        title: t('Failed'),
        body: hideError?.data?.message,
        button: t('Done')
      })
      setSelectedPlan(null)
      setHideModal(false)
    }
  }, [hideStatus])  

  return (
    <Fragment>
      <Breadcrumbs title='Plans' data={[{ title: t('Plans Management') }]} />
      <div className="d-flex justify-content-end align-items-end mb-2">
        <Button color="primary" outline onClick={() => navigate('/plans/management') }>
          {t('Create New Plan')}
        </Button>
      </div>
        <Row className='match-height'>
          { fetchingPlans ? <LoadSpinner/> : plans?.length > 0 ? plans?.map((item, index) => (
              <Col md={3}>
                <Card
                style = {{ width: "100%", 
                            boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)", 
                            borderRadius: "5px", 
                            borderTop: "7px solid #06deda",
                            borderBottom: "7px solid #06deda",
                            textAlign:'center'}}>
                    <div className="position-absolute top-0 end-0 mt-1">
                        <MoreVertical size={18} style={{cursor:'pointer'}} onClick={() => handleOpenActions(item)}/>
                    </div>
                  <CardBody>
                    {item.popular === true && (
                      <div className="pricing-badge text-end">
                        <Badge color="light-primary" pill>
                          {t('popular')}
                        </Badge>
                      </div>
                    )}
                      <div className='apply-job-package bg-light-primary rounded'>
                          <h2>{item?.title}</h2>
                      </div>
                    <div className="annual-plan">
                      <div className="plan-price mt-2">
                        {item.price === 0 ? (
                          <Badge color='light-warning'>مجاناً</Badge>
                        ) : (
                          <>
                            <sup className="font-medium-1 fw-bold text-primary me-25">$</sup>
                            <span className="fw-bolder text-primary">
                              {item.price_after_discount > 0 ? item.price_after_discount?.toLocaleString() : item.price?.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                      {item.discount_percentage ? (
                        <small className="text-muted">خصم {parseInt(item.discount_percentage)} %</small>
                      ) : null}
                    </div>
                    <ListGroup tag="ul" className="list-group-circle text-start">
                      <ListGroupItem tag="li">مدة الاشتراك: {item.number_of_days === -1 ? 'غير محدودة' : `${item.number_of_days} يوم`}</ListGroupItem>
                      <ListGroupItem tag="li"> حالة الخطة: {item.publish_status === 'published' ? 'مرئية' : 'تم اخفاؤها'}</ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
          )) : <EmptyComponent title={'لا يوجد خطط'} body={'لا يوجد خطط'}/>}
        </Row>
        <SystemModal show={modal}
                      setShow={setModal} 
                      title={`${t('Remove this plan')} (${selectedPlan?.title}) !`} 
                      onReomve={() => remove({id:selectedPlan?.id})}
                      isRemoving={removing}
                      status={removeStatus}
                      message={removeError?.data?.message}>
                <Alert color='warning'>
                  <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                  <div className='alert-body' style={{fontSize:'11px'}}>
                  {t('Are you sure you want to remove this plan? it will not shown to users!!')}
                  </div>
                </Alert>
        </SystemModal>
        <SystemModal show={hideModal}
                      setShow={setHideModal} 
                      title={` ${selectedPlan?.publish_status === 'published' ? t('Hide this plan') : t('Show this plan')} (${selectedPlan?.title}) !`} 
                      onReomve={() => hide({id:selectedPlan?.id})}
                      isRemoving={hiding}
                      status={hideStatus}
                      message={hideError?.data?.message}>
                <Alert color='warning'>
                  <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                  <div className='alert-body' style={{fontSize:'11px'}}>
                  {selectedPlan?.publish_status === 'published' ? t('Are you sure you want to hide this plan? it will not shown to users!!') : t('Are you sure you want to show this plan? it will shown to users!!')}
                  </div>
                </Alert>
        </SystemModal>
        <PlanActionsModal
          isOpen={modalOpen}
          toggle={toggleModal}
          selectedPlan={selectedPlan}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onHide={handleHide}
        />

    </Fragment>
  )
}

export default PlansManagement