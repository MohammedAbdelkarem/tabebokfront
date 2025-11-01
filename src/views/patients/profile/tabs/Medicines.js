// ** React Imports
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Button
} from 'reactstrap'

// ** Icons
import { Clock, Calendar } from 'react-feather'

const Medicines = ({ medicines }) => {
  const { t } = useTranslation()

  // ** State for expanded medicine times
  const [expandedMedicines, setExpandedMedicines] = useState(new Set())

  // ** Format Time
  const formatTime = (time) => {
    if (!time) return 'N/A'
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  // ** Empty State
  if (!medicines || medicines.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          {/* <Pill size={48} className='text-muted mb-3' /> */}
          <h5 className='text-muted'>{t('No Medicines Available')}</h5>
          <p className='text-muted'>{t('This patient has no prescribed medicines yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className='medicines-content'>
      <Row>
        {medicines.map((medicine) => (
          <Col lg={4} md={6} sm={12} key={medicine.id} className='mb-3'>
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
    </div>
  )
}

export default Medicines
