// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'

// ** Third Party Components
import '@fullcalendar/react/dist/vdom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

// ** Reactstrap Imports
import { 
  Card, CardBody, CardTitle, Row, Col, 
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge, Spinner, Alert
} from 'reactstrap'

// ** Icons
import { Calendar, Clock, User, MapPin, Phone } from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Redux
import { useListMutation, useShowMutation } from '../../../../redux/rtkQuery/reservation'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'

// ** Styles
import '@styles/react/apps/app-calendar.scss'
import './reservation-calendar.scss'

const ReservationCalendar = ({ doctorId }) => {
  const { t } = useTranslation()
  const [isRtl] = useRTL()
  const calendarRef = useRef(null)

  // ** States
  const [events, setEvents] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [reservationDetails, setReservationDetails] = useState(null)
  const [dayReservationsModal, setDayReservationsModal] = useState(false)
  const [selectedDayReservations, setSelectedDayReservations] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  // ** RTK Query Hooks
  const [getReservations, { isLoading: loadingReservations }] = useListMutation()
  const [getReservationDetails, { isLoading: loadingDetails }] = useShowMutation()

  // ** Helper Functions
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':')
    const endHour = parseInt(hours) + 1 // Assume 1 hour appointments
    return `${endHour.toString().padStart(2, '0')}:${minutes}:00`
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#fff3cd',      // Light yellow
      done: '#e9ecef',         // Light secondary/gray
      cancelled: '#f8d7da'     // Light red
    }
    return statusColors[status?.toLowerCase()] || '#e9ecef'
  }

  const getStatusBorderColor = (status) => {
    const borderColors = {
      pending: '#ffc107',      // Yellow border
      done: '#6c757d',         // Secondary/gray border
      cancelled: '#dc3545'     // Red border
    }
    return borderColors[status?.toLowerCase()] || '#6c757d'
  }

  const fetchReservations = async () => {
    try {
      const response = await getReservations({ id: doctorId }).unwrap()
      
      if (response.status_code === 200 && response.data) {
        const formattedEvents = response.data.map(reservation => ({
          id: reservation.id,
          title: `${t('Reservation')} #${reservation.id}`,
          start: reservation.appointment_date ? `${reservation.appointment_date}T${reservation.appointment_time || '09:00:00'}` : reservation.created_at,
          end: reservation.appointment_date ? `${reservation.appointment_date}T${calculateEndTime(reservation.appointment_time || '09:00:00')}` : reservation.created_at,
          backgroundColor: getStatusColor(reservation.status),
          borderColor: getStatusBorderColor(reservation.status),
          extendedProps: {
            reservation,
            status: reservation.status,
            patient: reservation.patient,
            type: reservation.type || 'appointment'
          }
        }))
        
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    }
  }

  // ** Fetch Reservations on Mount
  useEffect(() => {
    if (doctorId) {
      fetchReservations()
    }
  }, [doctorId])

  // ** Handle Event Click
  const handleEventClick = async (clickInfo) => {
    const reservation = clickInfo.event.extendedProps.reservation
    setSelectedReservation(reservation)
    setModalOpen(true)

    // Fetch detailed information
    try {
      const response = await getReservationDetails({ id: reservation.id }).unwrap()
      if (response.status_code === 200) {
        setReservationDetails(response.data)
      }
    } catch (error) {
      console.error('Error fetching reservation details:', error)
    }
  }

  // ** Handle More Link Click
  const handleMoreLinkClick = (info) => {
    const date = info.date
    const dateStr = date.toISOString().split('T')[0]

    // Get all reservations for this date
    const dayReservations = events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0]
      return eventDate === dateStr
    }).map(event => event.extendedProps.reservation)

    setSelectedDate(date.toLocaleDateString())
    setSelectedDayReservations(dayReservations)
    setDayReservationsModal(true)

    return 'popover' // Still show popover as fallback
  }

  // ** Calendar Options
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,listWeek'
    },

    events,
    eventClick: handleEventClick,
    height: 'auto',
    direction: isRtl ? 'rtl' : 'ltr',
    locale: isRtl ? 'ar' : 'en',
    eventDisplay: 'block',
    dayMaxEvents: 3,
    moreLinkClick: handleMoreLinkClick,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  // ** Format Time
  const formatTime = (timeString) => {
    if (!timeString) return '--'
    return timeString.slice(0, 5) // HH:MM format
  }

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h4' className='mb-4'>
                <Calendar size={20} className='me-2 text-primary' />
                {t('Reservations Calendar')}
              </CardTitle>

              {loadingReservations ? (
                <div className='text-center py-5'>
                  <Spinner color='primary' />
                  <p className='mt-2'>{t('Loading reservations...')}</p>
                </div>
              ) : events.length === 0 ? (
                <Alert color='info' className='text-center'>
                  <Calendar size={24} className='mb-2' />
                  <h6>{t('No Reservations Found')}</h6>
                  <p className='mb-0'>{t('No reservations have been scheduled yet.')}</p>
                </Alert>
              ) : (
                <div className='calendar-wrapper reservation-calendar'>
                  <FullCalendar
                    ref={calendarRef}
                    {...calendarOptions}
                  />

                  {/* Status Legend - will be moved to header via CSS */}
                  <div className='status-legend-container d-flex align-items-center justify-content-end mt-2'>
                    <span className='me-3 small text-muted'>{t('Status')}:</span>
                    <div className='d-flex align-items-center gap-3'>
                      <div className='d-flex align-items-center'>
                        <span
                          className='me-1'
                          style={{
                            color: '#ffc107',
                            fontSize: '16px',
                            lineHeight: '1'
                          }}
                        >●</span>
                        <span className='small'>{t('Pending')}</span>
                      </div>
                      <div className='d-flex align-items-center'>
                        <span
                          className='me-1'
                          style={{
                            color: '#6c757d',
                            fontSize: '16px',
                            lineHeight: '1'
                          }}
                        >●</span>
                        <span className='small'>{t('Done')}</span>
                      </div>
                      <div className='d-flex align-items-center'>
                        <span
                          className='me-1'
                          style={{
                            color: '#dc3545',
                            fontSize: '16px',
                            lineHeight: '1'
                          }}
                        >●</span>
                        <span className='small'>{t('Cancelled')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Reservation Details Modal */}
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        size='lg'
        centered
        className='reservation-modal'
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          <h3><Calendar size={18} className='me-2' />
          {t('Reservation Details')}</h3>
        </ModalHeader>
        <ModalBody>
          {loadingDetails ? (
            <div className='text-center py-4'>
              <Spinner color='primary' />
              <p className='mt-2'>{t('Loading details...')}</p>
            </div>
          ) : selectedReservation ? (
            <div>
              {/* Basic Reservation Info */}
              <Row className='mb-3'>
                <Col md={6}>
                  <h6 className='fw-bold text-muted mb-2'>{t('Reservation Info')}</h6>
                  <div className='mb-2'>
                    <strong>{t('ID')}:</strong> #{selectedReservation.id}
                  </div>
                  <div className='mb-2'>
                    <strong>{t('Status')}:</strong>
                    <Badge
                      color={
                        selectedReservation.status === 'done' ? 'light-success' : (
                          selectedReservation.status === 'pending' ? 'light-warning' : (
                            selectedReservation.status === 'cancelled' ? 'light-danger' : 'light-secondary'
                          )
                        )
                      }
                      className='ms-2'
                    >
                      {selectedReservation.status}
                    </Badge>
                  </div>
                  <div className='mb-2'>
                    <strong>{t('Text')}:</strong> {selectedReservation.text || '--'}
                  </div>
                  <div className='mb-2'>
                    <strong>{t('Visits Available')}:</strong>
                    <Badge color='light-info' className='ms-2'>
                      {selectedReservation.visits_available || 0}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className='fw-bold text-muted mb-2'>{t('Schedule')}</h6>
                  <div className='mb-2'>
                    <Clock size={14} className='me-2 text-primary' />
                    <strong>{t('Date')}:</strong> {formatDate(selectedReservation.date || selectedReservation.created_at)}
                  </div>
                  <div className='mb-2'>
                    <Clock size={14} className='me-2 text-success' />
                    <strong>{t('Appointment Time')}:</strong> {formatTime(selectedReservation.time_to_come)}
                  </div>
                  <div className='mb-2'>
                    <Clock size={14} className='me-2 text-info' />
                    <strong>{t('Shift')}:</strong> {formatTime(selectedReservation.shift_start_time)} - {formatTime(selectedReservation.shift_end_time)}
                  </div>
                </Col>
              </Row>

              {/* Patient Information */}
              {selectedReservation.patient && (
                <Row className='mb-3'>
                  <Col xs={12}>
                    <h6 className='fw-bold text-muted mb-2'>{t('Patient Information')}</h6>
                    <div className='p-3 bg-light rounded patient-info'>
                      <Row>
                        <Col md={6}>
                          <div className='d-flex align-items-center mb-2'>
                            <User size={16} className='me-2 text-info' />
                            <strong>{selectedReservation.patient.full_name}</strong>
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Gender')}:</strong> {selectedReservation.patient.is_male ? t('Male') : t('Female')}
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Birth Date')}:</strong> {formatDate(selectedReservation.patient.birth_date)}
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Blood Type')}:</strong> {selectedReservation.patient.blood_type || '--'}
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Relation')}:</strong> {selectedReservation.patient.relation || '--'}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className='mb-2'>
                            <strong>{t('Height')}:</strong> {selectedReservation.patient.height} cm
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Weight')}:</strong> {selectedReservation.patient.weight} kg
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Smoking')}:</strong> {selectedReservation.patient.smoking || '--'}
                          </div>
                          <div className='mb-2'>
                            <strong>{t('Alcohol')}:</strong> {selectedReservation.patient.alcohol ? t('Yes') : t('No')}
                          </div>
                        </Col>
                      </Row>

                      {/* Medical Information */}
                      {(selectedReservation.patient.chronic_diseases || selectedReservation.patient.notes) && (
                        <div className='mt-3 pt-3 border-top'>
                          <h6 className='text-muted mb-2'>{t('Medical Information')}</h6>
                          {selectedReservation.patient.chronic_diseases && (
                            <div className='mb-2'>
                              <strong>{t('Chronic Diseases')}:</strong>
                              <p className='mb-0 mt-1 text-muted'>{selectedReservation.patient.chronic_diseases}</p>
                            </div>
                          )}
                          {selectedReservation.patient.notes && (
                            <div className='mb-2'>
                              <strong>{t('Medical Notes')}:</strong>
                              <p className='mb-0 mt-1 text-muted'>{selectedReservation.patient.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              )}

              {/* Visit Information */}
              {selectedReservation.visit && (
                <Row className='mb-3'>
                  <Col xs={12}>
                    <h6 className='fw-bold text-muted mb-2'>{t('Visit Information')}</h6>
                    <div className='p-3 bg-light rounded'>
                      <div className='mb-2'>
                        <strong>{t('Visit ID')}:</strong> #{selectedReservation.visit.id}
                      </div>
                      <div className='mb-2'>
                        <strong>{t('Title')}:</strong> {selectedReservation.visit.title}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Doctor Information */}
              {selectedReservation.doctor && (
                <Row className='mb-3'>
                  <Col xs={12}>
                    <h6 className='fw-bold text-muted mb-2'>{t('Doctor Information')}</h6>
                    <div className='p-3 bg-light rounded'>
                      <div className='mb-2'>
                        <strong>{t('Clinic')}:</strong> {selectedReservation.doctor.clinic_name}
                      </div>
                      <div className='mb-2'>
                        <MapPin size={14} className='me-2 text-danger' />
                        <strong>{t('Address')}:</strong> {selectedReservation.doctor.address_text}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Additional Details */}
              <Row>
                <Col xs={12}>
                  <h6 className='fw-bold text-muted mb-2'>{t('Additional Details')}</h6>
                  <div className='p-3 bg-light rounded'>
                    {selectedReservation.notes && (
                      <div className='mb-2'>
                        <strong>{t('Notes')}:</strong>
                        <p className='mb-0 mt-1'>{selectedReservation.notes}</p>
                      </div>
                    )}
                    {selectedReservation.rejection_reason && (
                      <div className='mb-2'>
                        <strong>{t('Rejection Reason')}:</strong>
                        <p className='mb-0 mt-1 text-danger'>{selectedReservation.rejection_reason}</p>
                      </div>
                    )}
                    {selectedReservation.other_rejection_reason && (
                      <div className='mb-2'>
                        <strong>{t('Other Rejection Reason')}:</strong>
                        <p className='mb-0 mt-1 text-danger'>{selectedReservation.other_rejection_reason}</p>
                      </div>
                    )}
                    <div className='mb-2'>
                      <strong>{t('Created')}:</strong> {formatDate(selectedReservation.created_at)}
                    </div>
                    {selectedReservation.complaints && selectedReservation.complaints.length > 0 && (
                      <div className='mb-2'>
                        <strong>{t('Complaints')}:</strong>
                        <Badge color='light-warning' className='ms-2'>
                          {selectedReservation.complaints.length}
                        </Badge>
                      </div>
                    )}
                    {selectedReservation.media && selectedReservation.media.length > 0 && (
                      <div>
                        <strong>{t('Media Files')}:</strong>
                        <Badge color='light-info' className='ms-2'>
                          {selectedReservation.media.length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <Alert color='warning'>{t('No reservation selected')}</Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => setModalOpen(false)}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Day Reservations Modal */}
      <Modal
        isOpen={dayReservationsModal}
        toggle={() => setDayReservationsModal(false)}
        size='lg'
        centered
        className='day-reservations-modal'
      >
        <ModalHeader toggle={() => setDayReservationsModal(false)}>
          <h3>
            <Calendar size={18} className='me-2' />
            {t('Reservations for')} {selectedDate}
          </h3>
        </ModalHeader>
        <ModalBody>
          {selectedDayReservations.length === 0 ? (
            <Alert color='info' className='text-center'>
              <Calendar size={24} className='mb-2' />
              <h6>{t('No Reservations')}</h6>
              <p className='mb-0'>{t('No reservations found for this date.')}</p>
            </Alert>
          ) : (
            <div className='reservations-list'>
              {selectedDayReservations.map((reservation) => (
                <Card key={reservation.id} className='mb-3 border-0 shadow-sm'>
                  <CardBody className='p-3'>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                      <div className='d-flex align-items-center'>
                        <Badge
                          color='light-primary'
                          className='me-3'
                          style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
                        >
                          #{reservation.id}
                        </Badge>
                        <div>
                          <h6 className='mb-1'>{t('Reservation')} #{reservation.id}</h6>
                          <div className='d-flex align-items-center text-muted'>
                            <Clock size={14} className='me-1' />
                            <small>{formatTime(reservation.time_to_come)}</small>
                          </div>
                        </div>
                      </div>
                      <Badge
                        color={
                          reservation.status === 'done' ? 'light-success' : (
                            reservation.status === 'pending' ? 'light-warning' : (
                              reservation.status === 'cancelled' ? 'light-danger' : 'light-secondary'
                            )
                          )
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </div>

                    {/* Patient Info */}
                    {reservation.patient && (
                      <div className='d-flex align-items-center mb-2'>
                        <User size={14} className='me-2 text-info' />
                        <span className='fw-bold me-2'>{reservation.patient.full_name}</span>
                        <small className='text-muted'>
                          ({reservation.patient.is_male ? t('Male') : t('Female')})
                        </small>
                      </div>
                    )}

                    {/* Reservation Text */}
                    {reservation.text && (
                      <div className='mb-2'>
                        <small className='text-muted'>{reservation.text}</small>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className='text-end'>
                      <Button
                        color='primary'
                        size='sm'
                        outline
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setDayReservationsModal(false)
                          setModalOpen(true)
                        }}
                      >
                        {t('View Details')}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => setDayReservationsModal(false)}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default ReservationCalendar
