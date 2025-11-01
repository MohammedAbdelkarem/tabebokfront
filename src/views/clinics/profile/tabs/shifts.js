// ** React Imports
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge
} from 'reactstrap'

// ** Icons
import {
  Clock,
  Calendar
} from 'react-feather'

const Shifts = ({ shifts }) => {
  const { t } = useTranslation()

  // ** Format time to 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // ** Empty State
  if (!shifts || shifts.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Clock size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No shifts here')}</h5>
          <p className='text-muted'>{t('This clinic has no shifts yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <div style={{ height: '60vh', overflowY: 'scroll' }}>
          <Row>
            {shifts.map((shift) => (
              <Col lg={4} md={6} sm={12} key={shift.id} className='mb-3'>
                <Card
                  className='shift-card h-100'
                  style={{ backgroundColor: '#d6eeff' }}
                >
                  <CardBody className='p-3'>
                    {/* Shift Header */}
                    <div className='shift-header mb-1 text-center'>
                      <Calendar size={24} className='text-primary mb-2' />
                      <h5 className='text-dark mb-0'>{shift.day?.name}</h5>
                    </div>

                    {/* Time Range */}
                    <div className='time-range-section'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='time-block text-center flex-fill'>
                          <Clock size={16} className='text-success mb-1' />
                          <div className='time-label text-muted' style={{ fontSize: '0.75rem' }}>
                            {t('Start Time')}
                          </div>
                          <div className='time-value text-dark fw-bold' style={{ fontSize: '1.1rem' }}>
                            {formatTime(shift.start_time)}
                          </div>
                        </div>

                        <div className='time-separator mx-2'>
                          <span className='text-muted'>←</span>
                        </div>

                        <div className='time-block text-center flex-fill'>
                          <Clock size={16} className='text-danger mb-1' />
                          <div className='time-label text-muted' style={{ fontSize: '0.75rem' }}>
                            {t('End Time')}
                          </div>
                          <div className='time-value text-dark fw-bold' style={{ fontSize: '1.1rem' }}>
                            {formatTime(shift.end_time)}
                          </div>
                        </div>
                      </div>

                      {/* Duration Badge */}
                      {/* <div className='text-center mt-3'>
                        <Badge color='light-info' className='px-3 py-2'>
                          <Clock size={12} className='me-1' />
                          {(() => {
                            const start = new Date(`2000-01-01T${shift.start_time}`)
                            const end = new Date(`2000-01-01T${shift.end_time}`)
                            const diffMs = end - start
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                            return `${diffHours}h ${diffMinutes}m`
                          })()}
                        </Badge>
                      </div> */}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </CardBody>
    </Card>
  )
}

export default Shifts
