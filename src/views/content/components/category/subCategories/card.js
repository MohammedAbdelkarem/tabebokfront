// ** React Imports
import { Fragment, useMemo, useState } from 'react'

// ** Reactstrap Imports
import { Card, CardImg, CardTitle, CardBody, CardText, Row, Col, CardHeader, Button, Alert } from 'reactstrap'
import useHeaders from '../../../../../utility/hooks/useHeaders'
import { useTranslation } from 'react-i18next'
import { Edit, Trash2 } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import SystemModal from '../../../../components/systemModal'
import DescriptionCell from '../../../../components/DescriptionCell'
import EmptyComponent from '../../../../components/empty'
import SuccessAlert from '../../../../components/handleStatusCode/success'
import ErrorAlert from '../../../../components/handleStatusCode/error'
// ** Custom Components
import Avatar from '@components/avatar'
import { useDeleteMutation } from '../../../../../redux/rtkQuery/content/subCategory'

const SubCard = ({data, setManagementModal, selected, setSelected, handleUpdate}) => {
  const headers = useHeaders()
  const navigate = useNavigate()
  const {t} = useTranslation()
  // ** State
  const [modal, setModal] = useState(false)
//   const [selected, setSelected] = useState(null)
  // ** Method
  const [remove, {data:removeData, isLoading:removing, status:removeStatus, error:removeError}] = useDeleteMutation()
  
  const handleRemove = (item) => {
      setSelected(item)
      setModal(true)
  }
//   useMemo(() => {
//     if (removeStatus === 'fulfilled') {
//       SuccessAlert({
//         title: t('Success'),
//         body: removeData?.message,
//         position: 'top-left'
//       })
//       handleClose()
//     } else if (removeStatus === 'rejected') {
//       ErrorAlert({
//         title: t('Failed'),
//         body: removeError?.data?.message,
//         position: 'top-left', 
//         bottun: t('Done')
//       })
//       handleClose()
//     }
//   }, [removeStatus])
  
  return (
    <Fragment>
      <Row>
        <CardHeader style={{display:'flex', justifyContent:'space-between', padding:'10px'}}>
            <CardTitle tag='h4'>{t(' list')}</CardTitle>
            <Button color='primary' outline onClick={() => setManagementModal(true)}>
            {t('Add new')}
            </Button>
        </CardHeader>
        <div style={{height:'60vh', overflowY:'auto'}}>
          <Row>
          {
              data?.length === 0 ? <EmptyComponent title={t('No Data')} body={t('No sub added')}/> : data?.map((item) => (
                    <Col xl='3' md='6'>
                      <Card style={{ width: "100%",
                                    boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)",
                                    borderRadius: "5px",
                                    padding: "5px",
                                    borderRight: "10px solid #1fa2ff"}}>
                          <CardBody>
                                <div className='profile-image-wrapper d-flex justify-content-center mb-1'>
                                    <div style={{ borderRadius: '50%', overflow: 'visible' }}>
                                    <Avatar img={item?.media?.[0]?.url} imgHeight='100' imgWidth='100' />
                                    </div>
                                </div>
                              <h3 style={{textAlign:'center'}}>{item?.name}</h3>
                              <h6 className='text-muted' style={{textAlign:'center'}}>{ <DescriptionCell row={item} text={item?.bio} number={18} />}</h6>
                              <hr className='mb-2' />
                              <CardText style={{ display: 'flex', justifyContent: 'space-around' }}>
                                  <Edit size={18}
                                      style={{ color: '#1fa2ff', cursor: 'pointer' }}
                                      onClick={() => handleUpdate(item)} />
                                  <Trash2 size={18}
                                      style={{ color: '#ff748e', cursor: 'pointer' }}
                                      onClick={() => handleRemove(item)} />
                              </CardText>
                      </CardBody>
                  </Card>
                  </Col>
              ))
          }
          </Row>
        </div>
      </Row>
      {
        modal && (
        <SystemModal show={modal}
                      setShow={setModal} 
                      title={`${t('Remove this sub category')} (${selected?.name}) !`} 
                      onReomve={() => remove({headers, id:selected?.id})}
                      isRemoving={removing}
                      status={removeStatus}
                      message={removeError?.data?.message}>
                <Alert color='warning'>
                  <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                  <div className='alert-body' style={{fontSize:'11px'}}>
                  {t('Are you sure you want to remove this sub category? it will not shown to users!!')}
                  </div>
                </Alert>
        </SystemModal>
        )
      }
    </Fragment>
  )
}

export default SubCard
