// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'

// ** Icons
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  Activity,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Star,
  Download,
  MessageSquare,
  ZoomIn,
  Award,
  Image,
  Info
} from 'react-feather'

// ** RTK Query
import { useShowMutation } from '../../../redux/rtkQuery/reservation'
import Reports from './reports'
import '../../articles/article-profile.scss'


const ReservationProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // ** States
  const [activeTab, setActiveTab] = useState('reservation')
  const [reservation, setReservation] = useState(null)
console.log('reservation',reservation);

  // ** RTK Query
  const [getReservation, { isLoading, error }] = useShowMutation()

  // ** Fetch Reservation Details
  const fetchReservation = async () => {
    try {
      const response = await getReservation({ id }).unwrap()
      if (response?.data) {
        setReservation(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch reservation:', error)
    }
  }

    // ** State for expanded medicine times
    const [expandedMedicines, setExpandedMedicines] = useState(new Set())
  
    // ** Toggle expanded state for a medicine
    const toggleExpanded = (medicineId) => {
      const newExpanded = new Set(expandedMedicines)
      if (newExpanded.has(medicineId)) {
        newExpanded.delete(medicineId)
      } else {
        newExpanded.add(medicineId)
      }
      setExpandedMedicines(newExpanded)
    }
  

  useEffect(() => {
    if (id) {
      fetchReservation()
    }
  }, [id])

  // ** Get Status Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'done': return 'light-success'
      case 'rejected': return 'light-danger'
      case 'pending': return 'light-warning'
      default: return 'light-secondary'
    }
  }

  // ** Get Status Icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'done': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      case 'pending': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  // ** Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  const getUserAvatar = (user) => {
    return user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.phone_number}&background=1fa2ff&color=fff`
  }
  // ** Format Time
  const formatTime = (timeString) => {
    if (!timeString) return '--'
    return timeString.slice(0, 5)
  }

  // ** Loading State
  if (isLoading) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Spinner color='primary' size='lg' />
          <h5 className='mt-3'>{t('Loading Reservation?...')}</h5>
        </CardBody>
      </Card>
    )
  }

  // ** Error State
  if (error || !reservation) {
    return (
      <Alert color='danger'>
        <h4 className='alert-heading'>{t('Error')}</h4>
        <p>{t('Failed to load reservation details. Please try again.')}</p>
        <Button color='primary' onClick={() => navigate('/reservations')}>
          {t('Back to Reservations')}
        </Button>
      </Alert>
    )
  }

  return (
    <div className='reservation-profile'>
      {/* Enhanced Header */}
      <Row className='mb-4'>
        <Col xs={12}>
          <Card className='border-0 shadow-lg'>
            <CardBody className='p-4'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <div className='d-flex align-items-center'>
                  <Button
                    color='light'
                    size='sm'
                    className='me-3 shadow-sm'
                    onClick={() => navigate('/reservations')}
                  >
                    <ArrowLeft size={16} className='me-1' />
                    {t('Back')}
                  </Button>
                  <div>
                    <h2 className='mb-2 text-primary fw-bold'>
                      {t('Reservation')} #{reservation?.id}
                    </h2>
                    <div className='d-flex align-items-center flex-wrap gap-3'>
                      <Badge color={getStatusColor(reservation?.status)} className='px-3 py-2 fs-6'>
                        {getStatusIcon(reservation?.status)}
                        <span className='ms-2 fw-bold'>{t(reservation?.status)}</span>
                      </Badge>
                      <div className='d-flex align-items-center text-muted'>
                        <Calendar size={16} className='me-2' />
                        <span className='fw-semibold'>{formatDate(reservation?.date)}</span>
                      </div>
                      <div className='d-flex align-items-center text-muted'>
                        <Clock size={16} className='me-2' />
                        <span className='fw-semibold'>{formatTime(reservation?.time_to_come)}</span>
                      </div>
                      {reservation?.shift_start_time && reservation?.shift_end_time && (
                        <div className='d-flex align-items-center text-muted'>
                          <Activity size={16} className='me-2' />
                          <span className='fw-semibold'>{formatTime(reservation?.shift_start_time)} - {formatTime(reservation?.shift_end_time)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='text-end'>
                  <div className='d-flex align-items-center mb-2'>
                    <Eye size={14} className='me-2 text-muted' />
                    <small className='text-muted'>{t('Created')}: {formatDate(reservation?.created_at)}</small>
                  </div>
                  {reservation?.visits_available > 0 && (
                    <Badge color='light-success' className='px-3 py-2'>
                      <Award size={14} className='me-1' />
                      {reservation?.visits_available} {t('visits available')}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Enhanced Quick Info Cards */}
              <Row className='g-4'>
                <Col lg={3} md={6}>
                  <div className='d-flex align-items-center p-3 bg-light-primary rounded-3 h-100'>
                    <div className='avatar avatar-lg bg-primary rounded-circle me-3 d-flex align-items-center justify-content-center'>
                      <User size={24} className='text-dark' />
                    </div>
                    <div className='flex-grow-1'>
                      <small className='text-muted d-block mb-1'>{t('Patient')}</small>
                      <h6 className='mb-1 text-dark'>{reservation?.patient?.full_name}</h6>
                      <small className='text-primary fw-semibold'>{reservation?.patient?.relation}</small>
                    </div>
                  </div>
                </Col>
                <Col lg={3} md={6}>
                  <div className='d-flex align-items-center p-3 bg-light-success rounded-3 h-100'>
                    <div className='avatar avatar-lg bg-success rounded-circle me-3 d-flex align-items-center justify-content-center'>
                      <MapPin size={24} className='text-dark' />
                    </div>
                    <div className='flex-grow-1'>
                      <small className='text-muted d-block mb-1'>{t('Clinic')}</small>
                      <h6 className='mb-1 text-dark'>{reservation?.doctor?.clinic_name}</h6>
                      <small className='text-success fw-semibold'>{reservation?.doctor?.address_text}</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Navigation Tabs - Separate Card */}
      <Row className='mb-4'>
        <Col xs={12}>
          <Nav tabs className='nav-justified border-0'>
            <NavItem>
              <NavLink
                active={activeTab === 'reservation'}
                onClick={() => setActiveTab('reservation')}
                className={`border-0 ${activeTab === 'reservation' ? 'bg-primary text-dark' : 'text-dark'}`}
                style={{ cursor: 'pointer', borderRadius: '0', fontWeight: '600' }}
              >
                <FileText size={18} className='me-2' />
                {t('Reservation Details')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === 'medical'}
                onClick={() => setActiveTab('medical')}
                className={`border-0 ${activeTab === 'medical' ? 'bg-primary text-dark' : 'text-dark'}`}
                style={{ cursor: 'pointer', borderRadius: '0', fontWeight: '600' }}
              >
                <Heart size={18} className='me-2' />
                {t('Medical Report')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === 'complaints'}
                onClick={() => setActiveTab('complaints')}
                className={`border-0 ${activeTab === 'complaints' ? 'bg-primary text-dark' : 'text-dark'}`}
                style={{ cursor: 'pointer', borderRadius: '0', fontWeight: '600' }}
              >
                <MessageSquare size={18} className='me-2' />
                {t('Complaints')}
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      {/* Tab Content - Separate Card */}
      <Row>
        <Col xs={12}>
          <Card className='border-0 shadow-sm'>

            <CardBody className='p-4'>
              <TabContent activeTab={activeTab}>
            {/* Reservation Details Tab */}
            <TabPane tabId='reservation'>
              <Row>
                <Col xs={12}>
                  <Card className='border-0 shadow-sm'>
                    <CardBody>
                      <h4 className='mb-4 text-primary'>
                        <FileText size={24} className='me-2' />
                        {t('Reservation Information')}
                      </h4>

                      <Row className='g-4'>
                        {/* Basic Information */}
                        <Col lg={6}>
                          <Card className='border-0 bg-light-primary h-100'>
                            <CardBody>
                              <h6 className='mb-3 text-primary'>
                                <Info size={18} className='me-2' />
                                {t('Basic Details')}
                              </h6>
                              <div className='mb-3'>
                                <small className='text-muted fw-bold'>{t('Reason for Visit')}</small>
                                <div className='fw-semibold'>{reservation?.text || '--'}</div>
                              </div>

                              <div className='mb-3'>
                                <small className='text-muted fw-bold'>{t('Status')}</small>
                                <div className='mt-1'>
                                  <Badge color={getStatusColor(reservation?.status)} className='px-3 py-2'>
                                    {getStatusIcon(reservation?.status)}
                                    <span className='ms-2 fw-bold'>{t(reservation?.status)}</span>
                                  </Badge>
                                </div>
                              </div>
                              {reservation?.notes && (
                                <div className='mb-3'>
                                  <small className='text-muted fw-bold'>{t('Notes')}</small>
                                  <div className='p-3 bg-white rounded mt-1'>
                                    <p className='mb-0'>{reservation?.notes}</p>
                                  </div>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        </Col>

                        {/* SPECTACULAR Schedule Details */}
                        <Col lg={6}>
                          <Card className='border-0 shadow-lg h-100 position-relative overflow-hidden'>
                            <div className='position-absolute top-0 end-0 w-50 h-50 opacity-10'>
                              <Calendar size={120} className='text-primary' style={{ transform: 'rotate(15deg)' }} />
                            </div>
                            <CardBody className='p-4 position-relative'>
                              {/* Elegant Header */}
                              <div className='d-flex align-items-center mb-4 pb-3'>
                                <div className='position-relative me-3'>
                                  <div className='avatar avatar-xl bg-primary shadow-lg rounded-4 d-flex align-items-center justify-content-center'>
                                    <Calendar size={28} className='text-white' />
                                  </div>
                                  <div className='position-absolute top-0 start-100 translate-middle'>
                                    <div className='bg-success rounded-circle' style={{ width: '12px', height: '12px' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className='mb-1 text-dark fw-bold'>{t('Schedule Details')}</h4>
                                  <small className='text-muted fw-semibold'>{t('Appointment Information')}</small>
                                </div>
                              </div>

                              {/* Premium Date & Time Cards */}
                              <Row className='g-3 mb-4'>
                                <Col sm={6}>
                                  <div className='position-relative'>
                                    <div className='card border-0 shadow-sm h-100 hover-lift-light'>
                                      <div className='card-body text-center p-4'>
                                        <div className='avatar avatar-lg bg-gradient-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow'>
                                          <Calendar size={24} className='text-white' />
                                        </div>
                                        <h6 className='text-muted fw-bold mb-2 text-uppercase letter-spacing-1'>{t('Appointment Date')}</h6>
                                        <h4 className='text-dark fw-bold mb-0'>{formatDate(reservation?.date)}</h4>
                                        <div className='mt-2'>
                                          <div className='bg-primary rounded-pill mx-auto' style={{ width: '40px', height: '3px' }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div className='position-relative'>
                                    <div className='card border-0 shadow-sm h-100 hover-lift-light'>
                                      <div className='card-body text-center p-4'>
                                        <div className='avatar avatar-lg bg-gradient-info rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow'>
                                          <Clock size={24} className='text-white' />
                                        </div>
                                        <h6 className='text-muted fw-bold mb-2 text-uppercase letter-spacing-1'>{t('Appointment Time')}</h6>
                                        <h4 className='text-dark fw-bold mb-0'>{formatTime(reservation?.time_to_come)}</h4>
                                        <div className='mt-2'>
                                          <div className='bg-info rounded-pill mx-auto' style={{ width: '40px', height: '3px' }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>

                      {/* Rejection Information */}
                      {(reservation?.rejection_reason || reservation?.other_rejection_reason) && (
                        <Row className='mt-4'>
                          <Col xs={12}>
                            <Card className='border-0 bg-light-danger'>
                              <CardBody>
                                <h6 className='mb-3 text-danger'>
                                  <XCircle size={18} className='me-2' />
                                  {t('Rejection Information')}
                                </h6>

                                {reservation?.rejection_reason && (
                                  <div className='mb-3'>
                                    <small className='text-muted fw-bold'>{t('Rejection Reason')}</small>
                                    <div className='fw-semibold text-danger'>{reservation?.rejection_reason}</div>
                                  </div>
                                )}

                                {reservation?.other_rejection_reason && (
                                  <div className='mb-3'>
                                    <small className='text-muted fw-bold'>{t('Other Rejection Reason')}</small>
                                    <div className='fw-semibold text-danger'>{reservation?.other_rejection_reason}</div>
                                  </div>
                                )}
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      )}

                      {/* Reservation Media */}
                      {reservation?.media?.length > 0 && (
                        <Row className='mt-1'>
                          <Col xs={12}>
                            <Card className='border-0'>
                              <CardBody>
                                <h3 className='mb-3 text-dark'>
                                  <Image size={18} className='me-2' />
                                  {t('مرفقات الحجز')}
                                </h3>
                                <Row>
                                  {reservation?.media.map((media, index) => (
                                    <Col lg={3} md={4} sm={6} key={index} className='mb-1'>
                                      <Card className='border-0 shadow-sm h-100'>
                                        <div className='position-relative'>
                                          <img
                                            src={media.url}
                                            alt={media.title || `Media ${index + 1}`}
                                            className='card-img-top cursor-pointer'
                                            style={{ height: '150px', objectFit: 'cover' }}
                                            onClick={() => window.open(media.url, '_blank')}
                                          />
                                          <div className='position-absolute top-0 end-0 p-2'>
                                            <Button
                                              color='light'
                                              size='sm'
                                              className='btn-icon rounded-circle shadow'
                                              onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = media.url
                                                link.download = media.title || `reservation-media-${index + 1}`
                                                link.click()
                                              }}
                                            >
                                              <Download size={12} />
                                            </Button>
                                          </div>
                                        </div>
                                        {media.title && (
                                          <CardBody className='p-2'>
                                            <small className='text-muted fw-semibold'>{media.title}</small>
                                          </CardBody>
                                        )}
                                      </Card>
                                    </Col>
                                  ))}
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            {/* Medical Report Tab */}
            <TabPane tabId='medical'>
              {reservation?.visit ? (
                <div>
                  {/* Visit Information Section */}
                  <Row className='mb-4'>
                    <Col xs={12}>
                      <Card className='border-0 shadow-sm'>
                        <CardBody>
                          <h4 className='mb-4 text-primary'>
                            <Heart size={24} className='me-2' />
                            {t('Visit Information')}
                          </h4>

                          <Row>
                            <Col lg={8}>
                              <div className='mb-4'>
                                <h5 className='text-dark mb-2'>{`  التشخيص الرئيسي :   ${reservation?.visit.title}`}</h5>
                                <h5>
                                  توصيف الحالة:
                                </h5>
                                <p className='text-muted mb-0 fs-6'>{reservation?.visit.description}</p>
                              </div>

                              {reservation?.visit.note && (
                                <div className='mb-4 p-4 bg-light-info rounded-3'>
                                  <h6 className='text-info mb-2'>
                                    <FileText size={16} className='me-2' />
                                    {t('Doctor Notes')}
                                  </h6>
                                  <p className='mb-0'>{reservation?.visit.note}</p>
                                </div>
                              )}

                              {reservation?.visit?.rate !== null && (
                                <div className="mb-4 p-3 bg-light-warning rounded-3">
                                  <h6 className="mb-2 text-warning d-flex align-items-center">
                                    <Star size={16} className="me-2" />
                                    {t('Visit Rating')}
                                  </h6>

                                  <div className="d-flex align-items-center mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={20}
                                        className={i < reservation?.visit.rate?.rate ? 'text-warning' : 'text-muted'}
                                        fill={i < reservation?.visit.rate?.rate ? 'currentColor' : 'none'}
                                      />
                                    ))}
                                    <span className="ms-2 fw-bold">{reservation?.visit.rate?.rate}/5</span>
                                  </div>

                                  <div className="comment-main d-flex align-items-start">
                                    <div className="comment-avatar me-2">
                                      <img
                                        src={getUserAvatar(reservation?.patient)}
                                        className="rounded-circle"
                                        width={40}
                                        height={40}
                                        alt="User Avatar"
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </div>

                                    <div className="comment-content w-100">
                                      <div className="comment-header mb-1">
                                        <div className="comment-user-info d-flex align-items-center">
                                          <Link
                                            to={`/patients/profile/${reservation.patient.full_name}`}
                                            state={{ id: reservation?.patient.id }}
                                            className="fw-bold text-dark"
                                          >
                                            {reservation?.patient.full_name}
                                          </Link>
                                          <Badge color="light-secondary" className="ms-2">
                                            {t('patient')}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="comment-text">
                                        <p className="mb-0">{reservation?.visit.rate.comment}</p>
                                      </div>

                                      {reservation?.visit.rate.doctor_replay && (
                                        <div className="replies-section mt-3 ps-4 border-start">
                                          <div className="d-flex align-items-start">
                                            <img
                                              src={reservation?.doctor?.user.avatar}
                                              className="rounded-circle me-2"
                                              width={30}
                                              height={30}
                                              alt="Doctor Avatar"
                                              style={{ objectFit: 'cover' }}
                                            />
                                            <div className="reply-text bg-light p-2 rounded-2 w-100">
                                              <span className="fw-semibold d-block mb-1">{t('Doctor Reply')}</span>
                                              <p className="mb-0">{reservation?.visit.rate.doctor_replay}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                            </Col>

                            <Col lg={4}>
                              {reservation?.visit.patientUpdatedInfo && (
                                <Card className='border-0 bg-light-primary'>
                                  <CardBody>
                                    <h3 className='mb-3 text-primary'>
                                      <Activity size={18} className='me-2' />
                                      {t('Patient Updates')}
                                    </h3>

                                    <div className='mb-3'>
                                      <small className='text-muted fw-bold'>{t('Height')}</small>
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <span className='text-muted'>{reservation?.visit.patientUpdatedInfo.old_height}cm</span>
                                        <span className='text-primary'>→</span>
                                        <span className='fw-bold text-primary'>{reservation?.visit.patientUpdatedInfo.current_height}cm</span>
                                      </div>
                                    </div>

                                    <div className='mb-3'>
                                      <small className='text-muted fw-bold'>{t('Weight')}</small>
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <span className='text-muted'>{reservation?.visit.patientUpdatedInfo.old_weight}kg</span>
                                        <span className='text-primary'>→</span>
                                        <span className='fw-bold text-primary'>{reservation?.visit.patientUpdatedInfo.current_weight}kg</span>
                                      </div>
                                    </div>

                                    {reservation?.visit.patientUpdatedInfo.current_blood_type && (
                                      <div className='mb-3'>
                                        <small className='text-muted fw-bold'>{t('Blood Type')}</small>
                                        <div className='d-flex justify-content-between align-items-center'>
                                          <span className='text-muted'>{reservation?.visit.patientUpdatedInfo.old_blood_type}</span>
                                          <span className='text-primary'>→</span>
                                          <span className='fw-bold text-primary'>{reservation?.visit.patientUpdatedInfo.current_blood_type}</span>
                                        </div>
                                      </div>
                                    )}

                                    {reservation?.visit.patientUpdatedInfo.current_notes && (
                                      <div className='mt-3 p-3 bg-white rounded'>
                                        <small className='text-muted fw-bold'>{t('Updated Notes')}</small>
                                        <p className='mb-0 mt-1 small'>{reservation?.visit.patientUpdatedInfo.current_notes}</p>
                                      </div>
                                    )}
                                  </CardBody>
                                </Card>
                              )}
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  {reservation?.visit.media?.length > 0 && (
                    <Row className='mb-1'>
                      <Col xs={12}>
                        <Card className='border-0 shadow-sm'>
                          <CardBody>
                            <h3 className='mb-4 text-dark'>
                              <Image size={20} className='me-2' />
                              {t('المرفقات ')}
                            </h3>
                            <Row>
                              {reservation?.visit.media.map((media) => (
                                <Col lg={3} md={4} sm={6} key={media.id} className='mb-1'>
                                  <Card className='border-0 shadow-sm h-100'>
                                    <div className='position-relative'>
                                      <img
                                        src={media.url}
                                        alt={media.title}
                                        className='card-img-top cursor-pointer'
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onClick={() => window.open(media.url, '_blank')}
                                      />
                                      <div className='position-absolute top-0 end-0 p-2'>
                                        <Button
                                          color='light'
                                          size='sm'
                                          className='btn-icon rounded-circle shadow'
                                          onClick={() => {
                                            const link = document.createElement('a')
                                            link.href = media.url
                                            link.download = media.title || 'visit-media'
                                            link.click()
                                          }}
                                        >
                                          <Download size={14} />
                                        </Button>
                                      </div>
                                      <div className='position-absolute bottom-0 start-0 end-0 p-2 bg-gradient-dark text-dark'>
                                        <ZoomIn
                                          size={16}
                                          className='cursor-pointer'
                                          onClick={() => window.open(media.url, '_blank')}
                                        />
                                      </div>
                                    </div>
                                    {media.title && (
                                      <CardBody className='p-3'>
                                        <small className='text-muted fw-semibold'>{media.title}</small>
                                      </CardBody>
                                    )}
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
                  {reservation?.visit.medicines?.length > 0 && (
                    <Row className='mb-1'>
                      <Col xs={12}>
                        <Card className='border-0 shadow-sm'>
                          <CardBody>
                            <h3 className='mb-4 text-dark'>
                              {/* <Pill size={20} className='me-2' /> */}
                              {t('Prescribed Medicines')}
                            </h3>
                            <Row>
                              {reservation?.visit.medicines.map((medicine) => (
                                  <Col lg={4} md={6} sm={12} key={medicine.id} className='mb-1'>
                                    <Card
                                      className='medicine-card h-100'
                                      style={{ backgroundColor: '#d6eeff' }}
                                    >
                                      <CardBody className='p-1'>
                                        {/* Medicine Name */}
                                        <div className='medicine-name'>
                                          <h4 className='text-dark mb-2 fw-bold d-flex align-items-center'>
                                            {medicine.text}
                                          </h4>
                                        </div>

                                        {/* Added By */}
                                        {medicine.added_by && (
                                          <div className='added-by-section'>
                                            <h6 className='text-dark mb-2 fw-bold'>{t('Prescribed by')}:</h6>
                                            <div className='d-flex align-items-center'>
                                              <img
                                                src={medicine.added_by.avatar}
                                                alt={medicine.added_by.full_name}
                                                className='added-by-avatar me-2'
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                              />
                                              <div>
                                                <div className='added-by-name text-dark fw-medium' style={{ fontSize: '0.875rem' }}>
                                                  {medicine.added_by.full_name}
                                                </div>
                                                <Badge color='light-primary' style={{ fontSize: '0.75rem' }}>
                                                  {medicine.added_by.role_name}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {/* Schedule Details */}
                                        <div className='schedule-details'>
                                          {/* Days to Take */}
                                          <div className='mb-2'>
                                            <span className='text-muted' style={{ fontSize: '0.875rem' }}>
                                              <strong>{t('Days to take')}:</strong> {medicine.days_to_take}
                                            </span>
                                          </div>

                                          {/* End Date */}
                                          {medicine.end_date && (
                                            <div>
                                              <Calendar size={14} className='me-1 text-muted' />
                                              <span className='text-muted' style={{ fontSize: '0.875rem' }}>
                                                <strong>{t('Until')}:</strong> {new Date(medicine.end_date).toLocaleDateString()}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Medicine Times */}
                                        {medicine.medicine_days && medicine.medicine_days.length > 0 && (
                                          <div className='medicine-times mb-1 mt-1'>
                                            <h6 className='text-dark mb-2 fw-bold'>{t('Times')}:</h6>
                                            <div className='times-table'>
                                              <table className='table table-sm table-borderless mb-0'>
                                                <tbody>
                                                  {/* Show first row or all rows based on expanded state */}
                                                  {(expandedMedicines.has(medicine.id) ? medicine.medicine_days : medicine.medicine_days.slice(0, 1)).map((day, dayIndex) => (
                                                    <tr key={dayIndex}>
                                                      <td className='p-1' style={{ width: '30%' }}>
                                                        {day.day && (
                                                          <Badge color='light-primary' style={{ fontSize: '0.7rem' }}>
                                                            {day.day.name}
                                                          </Badge>
                                                        )}
                                                      </td>
                                                      <td className='p-1'>
                                                        {day.medicine_time && day.medicine_time.length > 0 && (
                                                          <div className='d-flex flex-wrap gap-1'>
                                                            {day.medicine_time.map((time, timeIndex) => (
                                                              <Badge
                                                                key={timeIndex}
                                                                color='light-secondary'
                                                                style={{ fontSize: '0.7rem' }}
                                                              >
                                                                {time.time ? formatTime(time.time) : time.other_time}
                                                              </Badge>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>

                                              {/* Show More/Less Button */}
                                              {medicine.medicine_days.length > 1 && (
                                                <div className='text-center mt-2'>
                                                  <Button
                                                    color='link'
                                                    size='sm'
                                                    className='p-0 text-primary'
                                                    style={{ fontSize: '0.75rem', textDecoration: 'none' }}
                                                    onClick={() => toggleExpanded(medicine.id)}
                                                  >
                                                    {expandedMedicines.has(medicine.id) ? `${t('Show Less')}` : `${t('Show More')} (+${medicine.medicine_days.length - 1})`}
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Col>
                              ))}
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
                  {reservation?.visit.instructions?.length > 0 && (
                    <Row className='mb-1'>
                      <Col xs={12}>
                        <Card className='border-0 shadow-sm'>
                          <CardBody>
                            <h3 className='mb-4 text-dark'>
                              <CheckCircle size={20} className='me-2' />
                              {t('Medical Instructions')}
                            </h3>
                            <Row>
                              {reservation?.visit.instructions.map((instruction) => (
                                <Col lg={4} md={4} sm={6} key={instruction.id} className='mb-1'>
                                  <Card
                                    className='instruction-card h-100'
                                    style={{ backgroundColor: '#d6eeff' }}
                                  >
                                    <CardBody className='p-1'>
                                      {/* Instruction Text */}
                                      <div className='instruction-text mb-1'>
                                        <p className='mb-0 text-dark' style={{ fontSize: '1.3rem' }}>
                                          {instruction.text}
                                        </p>
                                      </div>

                                      {/* Notes */}
                                      {instruction.notes && (
                                        <div className='instruction-notes mb-1'>
                                          <h6 className='text-dark fw-bold'>{t('• Notes')}:</h6>
                                          <p className='mb-0 text-muted' style={{ fontSize: '1rem' }}>
                                            {instruction.notes}
                                          </p>
                                        </div>
                                      )}

                                      {/* Added By */}
                                      {instruction.added_by && (
                                        <div className='added-by-section'>
                                          <h6 className='text-dark mb-2 fw-bold'>{t('Added by')}:</h6>
                                          <div className='d-flex align-items-center'>
                                            <img
                                              src={instruction.added_by.avatar}
                                              alt={instruction.added_by.full_name}
                                              className='added-by-avatar me-2'
                                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <div>
                                              <div className='added-by-name text-dark fw-medium' style={{ fontSize: '0.875rem' }}>
                                                {instruction.added_by.full_name}
                                              </div>
                                              <Badge color='light-primary' style={{ fontSize: '0.75rem' }}>
                                                {instruction.added_by.role_name}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </CardBody>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
                </div>
              ) : (
                <Alert className='text-center py-5'>
                  <Heart size={48} className='mb-3 text-muted' />
                  <h4 className='text-muted'>{t('No Medical Report')}</h4>
                  <p className='mb-0 text-muted'>{t('No visit details available for this reservation?.')}</p>
                </Alert>
              )}
            </TabPane>
                <TabPane tabId='complaints'>
                  <Reports complaints={reservation?.complaints}/>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ReservationProfile
