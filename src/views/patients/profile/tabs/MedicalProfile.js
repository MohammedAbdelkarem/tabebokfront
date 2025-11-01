// ** React Imports
import { Activity, AlertTriangle, Calendar, Droplet, FileText, Heart, User } from 'react-feather'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Progress
} from 'reactstrap'

// ** Icons
// import { 
//   Heart, 
//   Activity, 
//   Droplet, 
//   Ruler, 
//   Weight, 
//   Cigarette,
//   Wine,
//   FileText,
//   AlertTriangle,
//   User,
//   Calendar
// } from 'react-feather'

const MedicalProfile = ({ patient }) => {
  const { t } = useTranslation()

  // ** Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }

  // ** Get BMI Status
  const getBMIStatus = (bmi) => {
    if (!bmi) return { status: 'Unknown', color: 'secondary' }
    
    if (bmi < 18.5) return { status: 'Underweight', color: 'info' }
    if (bmi < 25) return { status: 'Normal', color: 'success' }
    if (bmi < 30) return { status: 'Overweight', color: 'warning' }
    return { status: 'Obese', color: 'danger' }
  }

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

  const bmi = calculateBMI(patient.weight, patient.height)
  const bmiStatus = getBMIStatus(bmi)
  const age = calculateAge(patient.birth_date)

  return (
    <div className='medical-profile-content'>
      <Row>
        {/* Basic Information */}
        <Col lg={6} className='mb-4'>
          <Card className='h-100'>
            <CardHeader>
              <CardTitle tag='h5' className='d-flex align-items-center'>
                <User size={18} className='me-2 text-primary' />
                {t('Basic Information')}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='basic-info-grid'>
                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Birth Date')}:</span>
                    <span className='info-value ms-auto'>
                      {new Date(patient.birth_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Age')}:</span>
                    <span className='info-value ms-auto'>
                      {age} {t('years')}
                    </span>
                  </div>
                </div>
                
                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Gender')}:</span>
                    <Badge 
                      color={patient.is_male ? 'light-primary' : 'light-secondary'}
                      className='ms-auto'
                    >
                      {patient.is_male ? t('Male') : t('Female')}
                    </Badge>
                  </div>
                </div>
                
                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Relation')}:</span>
                    <Badge color='light-info' className='ms-auto'>
                      {patient.relation}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Vital Statistics */}
        <Col lg={6} className='mb-4'>
          <Card className='h-100'>
            <CardHeader>
              <CardTitle tag='h5' className='d-flex align-items-center'>
                <Activity size={18} className='me-2 text-success' />
                {t('Vital Statistics')}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='basic-info-grid'>
                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Height')}:</span>
                    <span className='info-value ms-auto'>
                      {patient.height ? `${patient.height} cm` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Weight')}:</span>
                    <span className='info-value ms-auto'>
                      {patient.weight ? `${patient.weight} kg` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('Blood Type')}:</span>
                    <Badge color='light-danger' className='ms-auto'>
                      {patient.blood_type || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div className='info-row'>
                  <div className='info-item'>
                    <span className='info-label'>{t('BMI')}:</span>
                    <div className='ms-auto d-flex align-items-center gap-2'>
                      <span className='info-value'>
                        {bmi || 'N/A'}
                      </span>
                      {bmi && (
                        <Badge color={`light-${bmiStatus.color}`}>
                          {t(bmiStatus.status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Lifestyle Factors */}
        <Col lg={6} className='mb-4'>
          <Card className='h-100'>
            <CardHeader>
              <CardTitle tag='h5' className='d-flex align-items-center'>
                <Activity size={18} className='me-2 text-warning' />
                {t('Lifestyle Factors')}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='lifestyle-factors'>
                <div className='factor-item mb-3'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center'>
                      <span className='factor-label'>{t('Smoking Status')}</span>
                    </div>
                    <Badge 
                      color={patient.smoking === 'smoker' ? 'light-danger' : 'light-success'}
                    >
                      {patient.smoking || 'N/A'}
                    </Badge>
                  </div>
                </div>
                
                <div className='factor-item mb-3'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center'>
                      <span className='factor-label'>{t('Alcohol Consumption')}</span>
                    </div>
                    <Badge 
                      color={patient.alcohol ? 'light-warning' : 'light-success'}
                    >
                      {patient.alcohol ? t('Yes') : t('No')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Medical History */}
        <Col lg={6} className='mb-4'>
          <Card className='h-100'>
            <CardHeader>
              <CardTitle tag='h5' className='d-flex align-items-center'>
                <AlertTriangle size={18} className='me-2 text-danger' />
                {t('Medical History')}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='medical-history'>
                <div className='history-item mb-3'>
                  <h6 className='history-title'>
                    {t('Chronic Diseases')}
                  </h6>
                  <div className='history-content'>
                    {patient.chronic_diseases ? (
                      <p className='mb-0'>{patient.chronic_diseases}</p>
                    ) : (
                      <span className='text-muted'>{t('No chronic diseases recorded')}</span>
                    )}
                  </div>
                </div>
                
                <div className='history-item'>
                  <h6 className='history-title'>
                    {t('Additional Notes')}
                  </h6>
                  <div className='history-content'>
                    {patient.notes ? (
                      <p className='mb-0'>{patient.notes}</p>
                    ) : (
                      <span className='text-muted'>{t('No additional notes')}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default MedicalProfile
