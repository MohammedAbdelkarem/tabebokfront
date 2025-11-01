// ** React Imports
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  ListGroup,
  ListGroupItem
} from 'reactstrap'

// ** Icons
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'react-feather'
import { useListPatientsMutation } from '../../../../redux/rtkQuery/reservation'

// ** RTK Query

const Reservations = ({ patientId }) => {
  const { t } = useTranslation()

  // ** States
  const [reservations, setReservations] = useState([])

  // ** RTK Query
  const [getReservations, { isLoading, error }] = useListPatientsMutation()

  // ** Fetch Reservations Function
  const fetchReservations = async () => {
    try {
      const response = await getReservations({ id:patientId }).unwrap()
      if (response?.data) {
        setReservations(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    }
  }

  // ** Fetch reservations on mount
  useEffect(() => {
    if (patientId) {
      fetchReservations()
    }
  }, [patientId])

  // ** Get Status Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      case 'done': return 'success'
      case 'completed': return 'primary'
      default: return 'secondary'
    }
  }

  // ** Get Status Border Color
  const getStatusBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#28a745'
      case 'pending': return '#ffc107'
      case 'cancelled': return '#dc3545'
      case 'done': return '#28a745'
      case 'completed': return '#007bff'
      default: return '#6c757d'
    }
  }

  // ** Get Status Icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <CheckCircle size={14} />
      case 'pending': return <Clock size={14} />
      case 'cancelled': return <XCircle size={14} />
      case 'done': return <CheckCircle size={14} />
      case 'completed': return <CheckCircle size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  // ** Loading State
  if (isLoading) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Spinner color='primary' size='lg' />
          <h5 className='mt-3'>{t('Loading Reservations...')}</h5>
        </CardBody>
      </Card>
    )
  }

  // ** Error State
  if (error) {
    return (
      <Alert color='danger'>
        <h4 className='alert-heading'>{t('Error')}</h4>
        <p>{t('Failed to load reservations. Please try again.')}</p>
      </Alert>
    )
  }

  // ** Empty State
  if (!reservations || reservations.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Calendar size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No Reservations Available')}</h5>
          <p className='text-muted'>{t('This patient has no reservations yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className='reservations-list-card'>
      <CardBody className='p-0'>
        <ListGroup flush>
          {reservations.map((reservation) => (
            <ListGroupItem
              key={reservation.id}
              className='reservation-list-item border-0'
              style={{
                borderLeft: `4px solid ${getStatusBorderColor(reservation.status)}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                marginBottom: '1rem',
                borderRadius: '8px'
            }}
            >
              <div className='d-flex justify-content-between align-items-start mb-3'>
                {/* Left Side - Main Info */}
                <div className='reservation-main-info flex-grow-1'>
                  <div className='d-flex align-items-center mb-2'>
                    <div className={`status-icon text-${getStatusColor(reservation.status)} me-2`}>
                      {getStatusIcon(reservation.status)}
                    </div>
                    <h6 className='reservation-title mb-0 me-3'>
                      {t('Reservation')} #{reservation.id}
                    </h6>
                    <Badge color={`light-${getStatusColor(reservation.status)}`} className='me-2'>
                      {reservation.status}
                    </Badge>
                  </div>

                  {/* Reservation Details Row */}
                  <div className='reservation-details-row d-flex flex-wrap gap-3 mb-2'>
                    {/* Reason */}
                    {reservation.text && (
                      <div className='detail-item d-flex align-items-center'>
                        <FileText size={14} className='me-1 text-muted' />
                        <span className='detail-text'><strong>{t('Reason')}:</strong> {reservation.text}</span>
                      </div>
                    )}

                    {/* Date */}
                    {reservation.date && (
                      <div className='detail-item d-flex align-items-center'>
                        <Calendar size={14} className='me-1 text-muted' />
                        <span className='detail-text'><strong>{t('Date')}:</strong> {new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Time */}
                    {reservation.time_to_come && (
                      <div className='detail-item d-flex align-items-center'>
                        <Clock size={14} className='me-1 text-muted' />
                        <span className='detail-text'><strong>{t('Time')}:</strong> {reservation.time_to_come}</span>
                      </div>
                    )}
                  </div>

                  {/* Doctor & Clinic Info */}
                  <div className='doctor-clinic-info d-flex flex-wrap gap-3 mb-2'>
                    {/* Doctor/Clinic */}
                    {reservation.doctor && (
                      <div className='detail-item d-flex align-items-center'>
                        <User size={14} className='me-1 text-muted' />
                        <span className='detail-text'><strong>{t('Clinic')}:</strong> {reservation.doctor.clinic_name}</span>
                      </div>
                    )}

                    {/* Address */}
                    {reservation.doctor?.address_text && (
                      <div className='detail-item d-flex align-items-center'>
                        <MapPin size={14} className='me-1 text-muted' />
                        <span className='detail-text'><strong>{t('Address')}:</strong> {reservation.doctor.address_text}</span>
                      </div>
                    )}
                  </div>

                  {/* Shift Time */}
                  {(reservation.shift_start_time && reservation.shift_end_time) && (
                    <div className='shift-time mb-2'>
                      <div className='detail-item d-flex align-items-center'>
                        <Clock size={14} className='me-1 text-muted' />
                        <span className='detail-text'>
                          <strong>{t('Shift')}:</strong> {reservation.shift_start_time} - {reservation.shift_end_time}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {reservation.notes && (
                    <div className='reservation-notes'>
                      <div className='notes-content p-2 bg-light rounded'>
                        <small><strong>{t('Notes')}:</strong> {reservation.notes}</small>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Date Info */}
                <div className='reservation-meta text-end'>
                  <small className='text-muted d-block'>
                    {t('Created')}: {new Date(reservation.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  )
}

export default Reservations
