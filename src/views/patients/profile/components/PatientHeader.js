// ** React Imports
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
import { 
  User, 
  Calendar, 
  Heart, 
  Activity, 
  Star,
  Edit3
} from 'react-feather'

const PatientHeader = ({ patient, owner, familyMembers, onPatientSelect }) => {
  const { t } = useTranslation()

  // ** Calculate Age
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  // ** Get Status Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'pending': return 'warning'
      default: return 'primary'
    }
  }

  return (
    <Card className='patient-header-card mb-4'>
      <CardBody>
        <Row className='align-items-center'>
          {/* Patient Avatar & Basic Info */}
          <Col lg={4} md={6} className='mb-3 mb-lg-0'>
            <div className='d-flex align-items-center'>
              <div className='position-relative me-3'>
                <img
                  src={patient.avatar}
                  alt={patient.full_name}
                  className='patient-avatar'
                />
              </div>
              
              <div>
                <h4 className='patient-name mb-1'>
                  {patient.full_name}
                  {patient.is_owner === 1 && (
                    <Badge color='light-warning' className='ms-2 owner-badge-text'>
                      {t('Owner')}
                    </Badge>
                  )}
                </h4>
                
                <div className='patient-details'>
                  <div className='d-flex align-items-center mb-1'>
                    <User size={14} className='me-2 text-muted' />
                    <span className='text-muted'>
                      {t('ID')}: #{patient.id}
                    </span>
                  </div>
                  
                  <div className='d-flex align-items-center mb-1'>
                    <Calendar size={14} className='me-2 text-muted' />
                    <span className='text-muted'>
                      {calculateAge(patient.birth_date)} {t('years old')}
                    </span>
                  </div>
                  
                  <Badge 
                    color='light-info' 
                    className='relation-badge'
                  >
                    {patient.relation}
                  </Badge>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={2}/>
          {/* Quick Stats & Actions */}
          <Col lg={6}>
          {(owner || familyMembers?.length > 0) && (
            <div className='family-summary'>
              <h6 className='section-title mb-2'>
                <User size={16} className='me-2 text-info' />
                {t('About Family')}
              </h6>
              
              <div className='d-flex align-items-center flex-wrap'>
                <span className='text-muted me-3'>
                  {t('Total Members')}: 
                  <Badge color='light-primary' className='ms-1'>
                    {(owner ? 1 : 0) + (familyMembers?.length || 0)}
                  </Badge>
                </span>
                
                {owner && (
                  <span className='text-muted me-3'>
                    {t('Owner')}: 
                    <Badge color='light-warning' className='ms-1'>
                      {owner.full_name}
                    </Badge>
                  </span>
                )}
                
                <span className='text-muted'>
                  {t('Relations')}: 
                  <Badge color='light-info' className='ms-1'>
                    {familyMembers?.length || 0} {t('members')}
                  </Badge>
                </span>
              </div>
            </div>
          )}
          </Col>
        </Row>

      </CardBody>
    </Card>
  )
}

export default PatientHeader
