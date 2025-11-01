import { useTranslation } from "react-i18next"
import {
  Badge,
  Card,
  CardBody,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap"
import { Fragment, useMemo, useState } from "react"
import { Tool, User, Calendar, AlertTriangle, Image, MapPin, FileText, Paperclip } from "react-feather"
import DescriptionCell from "../../../components/descriptionCell"
import { useProcessMutation } from "../../../../redux/rtkQuery/admin"
import { Link } from "react-router-dom"

const Reports = ({ complaints }) => {
  const [processingId, setProcessingId] = useState(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [action, { isLoading:processing, status }] = useProcessMutation()
  const { t } = useTranslation()

  const handleAction = async (reportId) => {
    setProcessingId(reportId)
    try {
        await action({ id: reportId })
    } finally {
        setProcessingId(null)
    }
  }

  const handleImageClick = (images) => {
    setSelectedImages(images)
    setCurrentImageIndex(0)
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
    setSelectedImages([])
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)
  }

  // Handle successful processing
  useMemo(() => {
    if (status === 'fulfilled') {
        // Refresh complaints data if needed
        console.log('Complaint processed successfully')
    }
  }, [status])

  if (!complaints || complaints.length === 0) {
      return (
        <Card>
          <CardBody className='text-center py-5'>
            <AlertTriangle size={48} className='text-muted mb-3' />
            <h5 className='text-muted'>{t('No Complaints Available')}</h5>
            <p className='text-muted'>{t('This clinic has not received any complaints yet.')}</p>
          </CardBody>
        </Card>
      )
    }
  return (
    <Fragment>
      <h3 style={{ marginBottom: '20px' }}>{t('Complaints')}</h3>
      <Row className='match-height'>
        {
          complaints.map((complaint) => (
            <Col md={4} key={complaint.id}>
              <Card
                className='mb-4'
                style={{
                  width: "100%",
                  boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)",
                  borderRadius: "5px",
                  padding: "5px",
                  borderRight: complaint.status === 'pending' ? "10px solid #f7d55d" : "10px solid #1fa2ff"
                }}
              >
                <CardBody>
                  <CardTitle tag='h4' className="d-flex justify-content-between align-items-center">
                    <Badge color={complaint.status === 'processed' ? 'light-success' : 'light-warning'}>
                      {complaint.status === 'processed' ? t('Processed') : t('Pending')}
                    </Badge>
                  </CardTitle>

                  {/* Patient Info */}
                  <div className="d-flex align-items-center mb-2">
                    <User size={16} className="me-2 text-primary" />
                    <Link to={`/users/profile/${complaint.patient?.full_name}`} state={{id:complaint.patient.id}} className="text-muted">
                      {complaint.patient ? complaint.patient.full_name : `${t('Patient ID')}: #${complaint.patient_id}`}
                    </Link>
                  </div>

                  {/* Reservation Info */}
                  {complaint.reservation && (
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={16} className="me-2 text-info" />
                      <span className="text-muted">
                        {t('Reservation')}: {complaint.reservation.text} ({complaint.reservation.status})
                      </span>
                    </div>
                  )}

                  {/* Complaint Value */}
                  <CardSubtitle className='text-muted mb-2 fw-bold'>{t('Complaint')}:</CardSubtitle>
                  <CardText className="mb-3">
                    <DescriptionCell number={50} row={complaint} text={complaint.value || complaint.other_value} />
                  </CardText>

                  {/* Images and Actions */}
                  <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                    <div>
                      {complaint.images && complaint.images.length > 0 && (
                        <CardLink
                            href="#"
                            onClick={(e) => {
                            e.preventDefault()
                            handleImageClick(complaint.images)
                            }}
                            className="d-inline-flex align-items-center"
                        >
                            <Image size={15} className="me-50" />
                            {t('View Images')} ({complaint.images.length})
                        </CardLink>
                      )}
                    </div>

                    <div>
                      {/* Action Button for Pending Complaints */}
                      {complaint.status === 'pending' && (
                        <CardLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handleAction(complaint.id)
                            }}
                            className="d-inline-flex align-items-center text-secondary">
                            {
                                complaint.id === processingId && processing ? <Spinner size="sm" /> : <>
                                <Tool size={15} className="me-50" />
                                {t('Mark as Processed')}
                                </>
                            }
                        </CardLink>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        }
      </Row>

      {/* Image Modal */}
      <Modal isOpen={imageModalOpen} toggle={closeImageModal} size="lg" centered>
        <ModalHeader toggle={closeImageModal}>
          {t('Image View')}
          {selectedImages.length > 1 && (
            <span className="text-muted ms-2">
              ({currentImageIndex + 1} / {selectedImages.length})
            </span>
          )}
        </ModalHeader>
        <ModalBody className="text-center position-relative">
          {selectedImages.length > 0 && (
            <>
              <img
                src={selectedImages[currentImageIndex]?.url}
                alt={`Complaint ${currentImageIndex + 1}`}
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />

              {/* Navigation buttons for multiple images */}
              {selectedImages.length > 1 && (
                <>
                  <Button
                    color="primary"
                    size="sm"
                    className="position-absolute start-0 top-50 translate-middle-y"
                    onClick={prevImage}
                    style={{ zIndex: 10 }}
                  >
                    ‹
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={nextImage}
                    style={{ zIndex: 10 }}
                  >
                    ›
                  </Button>
                </>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <div>
            {selectedImages.length > 1 && (
              <small className="text-muted">
                {t('Use arrows to navigate between images')}
              </small>
            )}
          </div>
          <Button color="secondary" onClick={closeImageModal}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default Reports
