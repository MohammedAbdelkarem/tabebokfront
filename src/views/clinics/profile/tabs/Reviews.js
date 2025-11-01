// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
  Card, CardBody, CardTitle, Row, Col,
  Badge, Progress, CardText, ListGroup, ListGroupItem,
  Button, Alert
} from 'reactstrap'

// ** Icons
import { Star, User, MessageCircle, ThumbsUp, Trash2 } from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Redux
import { useRemoveRateMutation } from '@src/redux/rtkQuery/clinic'

// ** Custom Components
import SystemModal from '../../../components/systemModal'

const Reviews = ({ data, onDataUpdate }) => {
  const { t } = useTranslation()

  // ** States
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  // ** RTK Query Hook
  const [removeRate, { isLoading: isDeleting }] = useRemoveRateMutation()

  // ** Handle Delete Review
  const handleDeleteClick = (review) => {
    setSelectedReview(review)
    setDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return

    try {
      await removeRate({ id: selectedReview.id }).unwrap()
      // Trigger data refresh in parent component
      if (onDataUpdate) {
        onDataUpdate()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  if (!data?.rates || data.rates.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Star size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No Reviews Available')}</h5>
          <p className='text-muted'>{t('This clinic has not received any reviews yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  // Calculate rating statistics
  const totalRatings = data.rates.length
  const averageRating = data.rate || 0
  
  // Count ratings by star level
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: data.rates.filter(rate => rate.rate === star).length
  }))

  // Helper function to render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'text-warning' : 'text-muted'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Fragment>
      <Row>
        {/* Rating Overview */}
        <Col lg={4} md={12}>
          <Card className='mb-3'>
            <CardBody className='text-center'>
              <CardTitle tag='h5' className='mb-3'>
                <Star size={18} className='me-2 text-warning' />
                {t('Rating Overview')}
              </CardTitle>
              
              <div className='mb-3'>
                <h1 className='display-4 text-warning mb-1'>{averageRating.toFixed(1)}</h1>
                <div className='mb-2'>
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className='text-muted mb-0'>
                  {t('Based on')} {totalRatings} {t('reviews')}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className='rating-distribution'>
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className='d-flex align-items-center mb-2'>
                    <span className='me-2'>{star}</span>
                    <Star size={12} className='text-warning me-2' fill='currentColor' />
                    <Progress 
                      value={(count / totalRatings) * 100} 
                      className='flex-grow-1 me-2'
                      style={{ height: '8px' }}
                    />
                    <span className='small text-muted'>{count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Reviews List */}
        <Col lg={8} md={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h5' className='mb-3'>
                <MessageCircle size={18} className='me-2 text-primary' />
                {t('Patient Reviews')}
              </CardTitle>

              <ListGroup flush>
                {data.rates.map((review, index) => (
                  <ListGroupItem key={review.id || index} className='px-0 py-3'>
                    <div className='d-flex'>
                      <div
                        className='bg-light-primary rounded-circle me-3 d-flex align-items-center justify-content-center'
                        style={{
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        <User size={16} className='text-primary' />
                      </div>
                      
                      <div className='flex-grow-1'>
                        <div className='d-flex justify-content-between align-items-start mb-2'>
                          <div>
                            <h6 className='mb-1'>
                              {t('Patient')}: {review.patient.full_name}
                            </h6>
                            <div className='d-flex align-items-center mb-1'>
                              {renderStars(review.rate)}
                              <Badge color='light-warning' className='ms-2'>
                                {review.rate}/5
                              </Badge>
                            </div>
                          </div>
                          <div className='d-flex align-items-center'>
                            <small className='text-muted me-3'>
                              {formatDate(review.created_at)}
                            </small>
                            <Button
                              color='danger'
                              size='sm'
                              outline
                              onClick={() => handleDeleteClick(review)}
                              className='btn-icon'
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>

                        {/* Review Comment */}
                        {review.comment && (
                          <CardText className='text-justify'>
                            "{review.comment}"
                          </CardText>
                        )}

                        {/* Doctor Reply */}
                        {review.doctor_replay && (
                          <div className='mt-1 p-1 bg-light rounded'>
                            {/* <h6 className='mb-1'>
                              {t('Doctor')}: {review.doctor.name}
                            </h6> */}
                            <CardText className='small mb-0'>
                              {review.doctor_replay}
                            </CardText>
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Rating Statistics */}
      <Row className='mt-3'>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h6' className='mb-3'>{t('Rating Statistics')}</CardTitle>
              <Row>
                <Col md={3} className='text-center'>
                  <h4 className='text-primary mb-1'>{totalRatings}</h4>
                  <small className='text-muted'>{t('Total Reviews')}</small>
                </Col>
                <Col md={3} className='text-center'>
                  <h4 className='text-warning mb-1'>{averageRating.toFixed(1)}</h4>
                  <small className='text-muted'>{t('Average Rating')}</small>
                </Col>
                <Col md={3} className='text-center'>
                  <h4 className='text-success mb-1'>
                    {ratingCounts.filter(r => r.star >= 4).reduce((sum, r) => sum + r.count, 0)}
                  </h4>
                  <small className='text-muted'>{t('Positive Reviews')}</small>
                </Col>
                <Col md={3} className='text-center'>
                  <h4 className='text-info mb-1'>
                    {data.rates.filter(r => r.doctor_replay).length}
                  </h4>
                  <small className='text-muted'>{t('Replied Reviews')}</small>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedReview && (
        <SystemModal
          show={deleteModal}
          setShow={setDeleteModal}
          title={`${t('Delete Review')} (${t('Patient')} #${selectedReview.patient_id})`}
          onReomve={handleDeleteConfirm}
          isRemoving={isDeleting}
        >
          <Alert color='warning'>
            <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
            <div className='alert-body' style={{ fontSize: '11px' }}>
              {t('لن تستطيع التراجع عن الحذف')}
            </div>
          </Alert>

          {/* Review Preview */}
          <div className='mt-3 p-3 bg-light rounded'>
            <div className='d-flex align-items-center mb-2'>
              <User size={16} className='me-2 text-primary' />
              <strong>{t('Patient')} #{selectedReview.patient_id}</strong>
            </div>
            <div className='d-flex align-items-center mb-2'>
              {renderStars(selectedReview.rate)}
              <Badge color='light-info' className='ms-2'>
                {selectedReview.rate}/5
              </Badge>
            </div>
            {selectedReview.comment && (
              <CardText className='mb-0 small text-muted'>
                "{selectedReview.comment}"
              </CardText>
            )}
          </div>
        </SystemModal>
      )}
    </Fragment>
  )
}

export default Reviews
