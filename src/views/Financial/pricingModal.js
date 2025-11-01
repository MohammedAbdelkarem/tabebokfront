// ** React Imports
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** Reactstrap Imports
import { Modal, Button, ModalBody, ModalHeader, Card, CardBody, CardText, ListGroup, ListGroupItem, CardFooter, Spinner } from 'reactstrap'

// ** Custom Component

// ** Styles
import '@styles/base/pages/page-pricing.scss'
import './plan.css'
import { useAssignMutation, useListMutation } from '../../redux/rtkQuery/plan'
import LoadSpinner from '../../@core/components/spinner/loaders'
import SuccessAlert from '../components/handleStatusCode/success'
import ErrorAlert from '../components/handleStatusCode/error'
const PricingModal = ({ show, setShow, myPlan, userId }) => {
    const [plan, setPlan] = useState(null)
    const [assign, {status, isLoading:assignLoading, error}] = useAssignMutation()
    const [get, {data, isLoading}] = useListMutation()
    const plans = data?.data || []
    useEffect(() => {
        get()
    }, []) 
    const handleAssign = (id) => {
     setPlan(id)
      const body = new FormData()
      body.append('user_id', userId)
      body.append('plan_id', id)
      assign({body})
    }
    useMemo(() => {
        if (status === 'fulfilled') {
          setShow(false)
          SuccessAlert({
            title: 'Success',
            body: 'Plan assigned successfully',
            position: 'top-right'
            })
        }
        if (status === 'rejected') {
          setShow(false)
          ErrorAlert({
            title: 'Error',
            body: error?.data?.message,
            button:'Done'
            })
        }
        
    },[status])
  return (
    <Fragment>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Subscription Plan</h1>
          <p className='text-center mb-3'>
            All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your
            needs.
          </p>
          {
            isLoading ? <LoadSpinner/> : <div className="pricing-scroll-container">
                {plans.map((item, index) => (
                    <div className="pricing-card-wrapper" key={index}>
                    <Card style = {{ width: "100%", 
                      boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)", 
                      borderRadius: "5px", 
                      borderTop: "7px solid #1fa2ff",
                      borderBottom: "7px solid #1fa2ff",
                      textAlign:'center'}}
                    >
                    <CardBody>
                        <h3>{item.name}</h3>
                        <CardText dangerouslySetInnerHTML={{ __html: item.description }} />
                        <div className="annual-plan">
                            <div className="plan-price mt-2">
                            {item.price === 0 ? (
                                <span className="fw-bolder text-success">مجاناً</span>
                            ) : (
                                <>
                                <sup className="font-medium-1 fw-bold text-primary me-25">SYP</sup>
                                <span className="fw-bolder text-primary">
                                    {item.discount_price_syp > 0 ? item.discount_price_syp : item.price_syp}
                                </span>
                                </>
                            )}
                            </div>
                            {item.has_discount && item.discount ? (
                            <small className="text-muted">خصم {item.discount}%</small>
                            ) : null}
                        </div>
                        <ListGroup tag="ul" className="list-group-circle text-start mb-2">
                            <ListGroupItem tag="li">مدة الاشتراك: {item.duration === -1 ? 'غير محدودة' : `${item.duration} يوم`}</ListGroupItem>
                            <ListGroupItem tag="li">عدد المشتركين: {item.subscriptions_count}</ListGroupItem>
                        </ListGroup>
                        </CardBody>
                        <CardFooter>
                            <Button block
                                    color={myPlan?.id === item?.id ? 'secondary' : 'primary'}
                                    disabled={myPlan?.id === item?.id}
                                    onClick={() => handleAssign(item?.id)}>
                                {plan === item?.id && assignLoading ? <Spinner size={'sm'}/> : myPlan?.id === item?.id ? 'خطته مسبقاً' : 'Assign'}
                            </Button>
                        </CardFooter>
                    </Card>
                    </div>
                ))}
            </div>
          }
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default PricingModal
