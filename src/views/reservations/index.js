// ** React Imports
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Form
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
  AlertCircle,
  List,
  Search
} from 'react-feather'

// ** RTK Query
import { useFilterMutation } from '../../redux/rtkQuery/reservation'

// ** Calendar Component
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const ReservationsList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // ** States
  const [activeTab, setActiveTab] = useState('calendar')
  const [reservations, setReservations] = useState([])
  const [dayReservationsModal, setDayReservationsModal] = useState(false)
  const [selectedDayReservations, setSelectedDayReservations] = useState([])
  const [selectedDateForModal, setSelectedDateForModal] = useState(null)

  // ** Filter States
  const [filters, setFilters] = useState({
    name: '',
    date: '',
    start_time: '',
    end_time: ''
  })

  // ** RTK Query
  const [getReservations, { isLoading, error }] = useFilterMutation()

  // ** Build Filter Options
  const buildFilterOptions = () => {
    const filterParams = []

    if (filters.name.trim()) {
      filterParams.push(`name=${encodeURIComponent(filters.name.trim())}`)
    }
    if (filters.date) {
      filterParams.push(`date=${filters.date}`)
    }
    if (filters.start_time) {
      filterParams.push(`start_time=${filters.start_time}`)
    }
    if (filters.end_time) {
      filterParams.push(`end_time=${filters.end_time}`)
    }

    return filterParams.join('&')
  }

  // ** Fetch Reservations Function
  const fetchReservations = async () => {
    try {
      const filterOptions = buildFilterOptions()
      const response = await getReservations({ filterOptions }).unwrap()
      if (response?.data) {
        setReservations(response?.data)
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    }
  }

  // ** Handle Filter Change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // ** Clear Filters
  const clearFilters = () => {
    setFilters({
      name: '',
      date: '',
      start_time: '',
      end_time: ''
    })
  }

  // ** Handle Reservation Click
  const handleReservationClick = (reservationId) => {
    navigate(`/reservations/${reservationId}`)
  }

  // ** Fetch reservations on mount and filter change
  useEffect(() => {
    fetchReservations()
  }, [])

  // ** Debounced filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReservations()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [filters])

  // ** Get Status Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'light-success'
      case 'rejected': return 'light-danger'
      case 'pending': return 'light-warning'
      default: return 'light-secondary'
    }
  }

  // ** Get Status Border Color
  const getStatusBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return '#28a745'
      case 'rejected': return '#dc3545'
      case 'pending': return '#ffc107'
      default: return '#6c757d'
    }
  }

  // ** Get Status Icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle size={14} />
      case 'rejected': return <XCircle size={14} />
      case 'pending': return <AlertCircle size={14} />
      default: return <Clock size={14} />
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

  // ** Handle More Link Click
  const handleMoreLinkClick = (info) => {
    const date = info.date
    const dateStr = date.toISOString().split('T')[0]

    // Get all reservations for this date
    const dayReservations = reservations.filter(reservation => reservation.date === dateStr)

    setSelectedDateForModal(date.toLocaleDateString())
    setSelectedDayReservations(dayReservations)

    return 'popover' // Still show popover as fallback
  }

  // ** Get reservations for selected date
  const getReservationsForDate = (date) => {
    return reservations.filter(reservation => reservation.date === date)
  }

  // ** Handle date click
  const handleDateClick = (dateInfo) => {
    const clickedDate = dateInfo.dateStr
    setSelectedDate(clickedDate)
    setShowAllForDate(false)
  }
  // ** Format Calendar Events
  const calendarEvents = reservations.map(reservation => ({
    id: reservation.id,
    title: `${formatTime(reservation.time_to_come)} - ${reservation.doctor.clinic_name}`,
    date: reservation.date,
    backgroundColor: getStatusColor(reservation.status) === 'light-success' ? '#d4edda' :
                    getStatusColor(reservation.status) === 'light-danger' ? '#f8d7da' :
                    getStatusColor(reservation.status) === 'light-warning' ? '#fff3cd' : '#e9ecef',
    borderColor: getStatusColor(reservation.status) === 'light-success' ? '#c3e6cb' :
                getStatusColor(reservation.status) === 'light-danger' ? '#f5c6cb' :
                getStatusColor(reservation.status) === 'light-warning' ? '#ffeaa7' : '#dee2e6',
    textColor: '#495057',
    extendedProps: {
      reservation: reservation
    }
  }))
 


  // ** Render Loading State Content
  const renderLoadingState = () => (
    <Card>
      <CardBody className='text-center py-5'>
        <Spinner color='primary' size='lg' />
        <h5 className='mt-3'>{t('Loading Reservations...')}</h5>
      </CardBody>
    </Card>
  )

  // ** Render Error State Content
  const renderErrorState = () => (
    <Alert color='danger'>
      <h4 className='alert-heading'>{t('Error')}</h4>
      <p>{t('Failed to load reservations. Please try again.')}</p>
    </Alert>
  )

  // ** Render Empty State Content
  const renderEmptyState = () => (
    <Card>
      <CardBody className='text-center py-5'>
        <Calendar size={48} className='text-muted mb-3' />
        <h5 className='text-muted'>{t('No Reservations Available')}</h5>
        <p className='text-muted'>{t('No reservations found with current filters.')}</p>
      </CardBody>
    </Card>
  )

  return (
    <>
      {/* Filter Card */}
      <Card className='mb-4'>
        <CardBody>
          <h5 className='mb-3'>
            <Search size={18} className='me-2' />
            {t('Advanced Search')}
          </h5>
          <Form>
            <Row>
              {/* Name Filter */}
              <Col md={6} lg={3}>
                <FormGroup>
                  <Label for='name-filter'>{t('Search')}</Label>
                  <Input
                    id='name-filter'
                    type='text'
                    placeholder={t('Doctor or Patient name')}
                    value={filters.name}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </FormGroup>
              </Col>

              {/* Date Filter */}
              <Col md={6} lg={3}>
                <FormGroup>
                  <Label for='date-filter'>{t('Date')}</Label>
                  <Input
                    id='date-filter'
                    type='date'
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </FormGroup>
              </Col>

              {/* Start Time Filter */}
              <Col md={6} lg={3}>
                <FormGroup>
                  <Label for='start-time-filter'>{t('Start Time')}</Label>
                  <Input
                    id='start-time-filter'
                    type='time'
                    value={filters.start_time}
                    onChange={(e) => handleFilterChange('start_time', e.target.value)}
                  />
                </FormGroup>
              </Col>

              {/* End Time Filter */}
              <Col md={6} lg={3}>
                <FormGroup>
                  <Label for='end-time-filter'>{t('End Time')}</Label>
                  <Input
                    id='end-time-filter'
                    type='time'
                    value={filters.end_time}
                    onChange={(e) => handleFilterChange('end_time', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Clear Filters Button */}
            <Row>
              <Col xs={12}>
                <div className='d-flex justify-content-end mt-2'>
                  <Button
                    color='secondary'
                    outline
                    size='sm'
                    onClick={clearFilters}
                    disabled={!filters.name && !filters.date && !filters.start_time && !filters.end_time}
                  >
                    {t('Clear Filters')}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* Main Reservations Card */}
      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : !reservations || reservations.length === 0 ? (
        renderEmptyState()
      ) : (
        <Card>
          <CardBody>
            {/* Tab Navigation */}
            <Nav tabs className='mb-4'>
              <NavItem>
                <NavLink
                  active={activeTab === 'calendar'}
                  onClick={() => setActiveTab('calendar')}
                  style={{ cursor: 'pointer' }}
                >
                  <Calendar size={16} className='me-1' />
                  {t('Calendar View')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'list'}
                  onClick={() => setActiveTab('list')}
                  style={{ cursor: 'pointer' }}
                >
                  <List size={16} className='me-1' />
                  {t('List View')}
                </NavLink>
              </NavItem>
            </Nav>

            {/* Tab Content */}
            <TabContent activeTab={activeTab}>
          {/* Calendar View */}
          <TabPane tabId='calendar'>
            {/* Status Legend */}
            <div className='status-legend-container d-flex align-items-center justify-content-end mb-3'>
              <span className='me-3 small text-muted'>{t('Status')}:</span>
              <div className='d-flex align-items-center gap-3'>
                <div className='d-flex align-items-center'>
                  <span
                    className='me-1'
                    style={{
                      color: '#f0ad4e',
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
                      color: '#5cb85c',
                      fontSize: '16px',
                      lineHeight: '1'
                    }}
                  >●</span>
                  <span className='small'>{t('Accepted')}</span>
                </div>
                <div className='d-flex align-items-center'>
                  <span
                    className='me-1'
                    style={{
                      color: '#d9534f',
                      fontSize: '16px',
                      lineHeight: '1'
                    }}
                  >●</span>
                  <span className='small'>{t('Rejected')}</span>
                </div>
              </div>
            </div>

            <div style={{ height: '600px' }}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: '' // Remove view buttons, only month view
                }}
                initialView='dayGridMonth'
                events={calendarEvents}
                height='100%'
                dateClick={handleDateClick}
                eventClick={(info) => {
                  const reservation = info.event.extendedProps.reservation
                  handleReservationClick(reservation.id)
                }}
                // Day max events and more link
                dayMaxEvents={3}
                moreLinkClick={handleMoreLinkClick}
                // Light theme styling
                themeSystem='standard'
                dayHeaderClassNames='text-muted'
                eventClassNames='border-0'
                buttonText={{
                  today: t('Today')
                }}
              />
            </div>

          </TabPane>

          {/* List View */}
          <TabPane tabId='list'>
            <div className='table-responsive'>
              <Table hover>
                <thead>
                  <tr>
                    <th>{t('Date & Time')}</th>
                    <th>{t('Doctor/Clinic')}</th>
                    <th>{t('Patient')}</th>
                    <th>{t('Status')}</th>
                    <th>{t('Details')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations?.map((reservation) => (
                    <tr
                      key={reservation.id}
                      onClick={() => handleReservationClick(reservation.id)}
                      style={{ cursor: 'pointer' }}
                      className='hover-row'
                    >
                      <td>
                        <div>
                          <div className='fw-bold'>{reservation.date}</div>
                          <small className='text-muted'>
                            <Clock size={12} className='me-1' />
                            {reservation.time_to_come}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          {reservation.doctor.logo?.[0]?.url && (
                            <img
                              src={reservation.doctor.logo[0].url}
                              alt={reservation.doctor.clinic_name}
                              className='rounded me-2'
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div className='fw-bold'>{reservation.doctor.clinic_name}</div>
                            <small className='text-muted'>
                              <MapPin size={12} className='me-1' />
                              {reservation.doctor.address_text}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <img
                            src={reservation?.patient?.avatar || `https://ui-avatars.com/api/?name=${reservation?.patient?.full_name}&background=1fa2ff&color=fff`}
                            alt={reservation?.patient?.full_name}
                            className='rounded-circle me-2'
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className='fw-bold'>{reservation?.patient?.full_name}</div>
                            <small className='text-muted'>{reservation?.patient?.relation}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge color={getStatusColor(reservation.status)} className='d-flex align-items-center w-fit'>
                          {getStatusIcon(reservation.status)}
                          <span className='ms-1'>{t(reservation.status)}</span>
                        </Badge>
                      </td>
                      <td>
                        <div>
                          {reservation.text && (
                            <div className='mb-1'>
                              <FileText size={12} className='me-1' />
                              <small>{reservation.text}</small>
                            </div>
                          )}
                          {reservation.notes && (
                            <div className='mb-1'>
                              <small className='text-muted'>{reservation.notes}</small>
                            </div>
                          )}
                          {reservation.rejection_reason && (
                            <div className='text-danger'>
                              <small>{t('Rejection Reason')}: {reservation.rejection_reason}</small>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      )}
    </>
  )
}

export default ReservationsList
