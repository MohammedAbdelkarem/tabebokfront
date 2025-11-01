
import { Fragment, useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


import {
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Spinner,
  Alert
} from 'reactstrap'


import { User, Users, FileText, Heart, Calendar, Edit2 } from 'react-feather'


import PatientHeader from './components/PatientHeader'
import MedicalProfile from './tabs/MedicalProfile'
import Instructions from './tabs/Instructions'
import Medicines from './tabs/Medicines'
import Reservations from './tabs/Reservations'




import './patient-profile.scss'
import { useDetailsMutation } from '../../../redux/rtkQuery/patient'
import Reports from './tabs/reports'

const PatientsProfile = () => {
  const { t } = useTranslation()
  const id  = useLocation()?.state
  
  
  const [activeTab, setActiveTab] = useState('medical')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [familyMembers, setFamilyMembers] = useState([])
  const [owner, setOwner] = useState(null)

  
  const [
    getPatientDetails,
    {
      data: patientsData,
      isLoading,
      error
    }
  ] = useDetailsMutation()

  
  useEffect(() => {
    if (id) {
      getPatientDetails({ id })
    }
  }, [id])

  
  useEffect(() => {
    if (patientsData?.data) {
      const patients = patientsData.data

      
      const ownerPatient = patients.find(p => p.is_owner === 1)
      setOwner(ownerPatient)

      
      const family = patients.filter(p => p.is_owner === 0)
      setFamilyMembers(family)

      
      setSelectedPatient(ownerPatient || patients[0])
    }
  }, [patientsData])

  
  const refetch = () => {
    if (id) {
      getPatientDetails({ id })
    }
  }

  
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setActiveTab('medical') 
  }

  
  if (isLoading) {
    return (
      <div className='text-center py-5'>
        <Spinner color='primary' size='lg' />
        <h5 className='mt-3'>{t('Loading Patient Profile...')}</h5>
      </div>
    )
  }

  
  if (error) {
    return (
      <Alert color='danger' className='m-3'>
        <h4 className='alert-heading'>{t('Error')}</h4>
        <p>{t('Failed to load patient profile. Please try again.')}</p>
      </Alert>
    )
  }

  
  if (!selectedPatient) {
    return (
      <Alert color='warning' className='m-3'>
        <h4 className='alert-heading'>{t('No Data')}</h4>
        <p>{t('No patient data found.')}</p>
      </Alert>
    )
  }

  return (
    <Fragment>
      <div className='patient-profile-wrapper'>
        {(owner || familyMembers.length > 0) && (
            <div className='family-tabs-section mb-4'>
              <div className='d-flex align-items-center mb-3'>
                <Users size={18} className='me-2 text-primary' />
                <h6 className='mb-0 fw-bold'>{t('Family Members')}</h6>
              </div>

              <div className='family-members-tabs'>
                <Nav pills className='flex-wrap'>
                  {/* Owner Tab */}
                  {owner && (
                    <NavItem className='me-2 mb-2'>
                      <NavLink
                        active={selectedPatient?.id === owner.id}
                        onClick={() => handlePatientSelect(owner)}
                        className={`family-tab ${selectedPatient?.id === owner.id ? 'active' : ''}`}
                      >
                        <div className='d-flex align-items-center'>
                          <img
                            src={owner.avatar}
                            alt={owner.full_name}
                            className='family-avatar me-2'
                          />
                          <div>
                            <div className='family-name'>{owner.full_name}</div>
                            <Badge color='primary' className='family-relation'>
                              {owner.relation}
                            </Badge>
                          </div>
                        </div>
                      </NavLink>
                    </NavItem>
                  )}

                  {/* Family Members Tabs */}
                  {familyMembers.map(member => (
                    <NavItem key={member.id} className='me-2 mb-2'>
                      <NavLink
                        active={selectedPatient?.id === member.id}
                        onClick={() => handlePatientSelect(member)}
                        className={`family-tab ${selectedPatient?.id === member.id ? 'active' : ''}`}
                      >
                        <div className='d-flex align-items-center'>
                          <img
                            src={member.avatar}
                            alt={member.full_name}
                            className='family-avatar me-2'
                          />
                          <div>
                            <div className='family-name'>{member.full_name}</div>
                            <Badge color='info' className='family-relation'>
                              {member.relation}
                            </Badge>
                          </div>
                        </div>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
            </div>
        )}
        <PatientHeader 
          patient={selectedPatient}
          owner={owner}
          familyMembers={familyMembers}
          onPatientSelect={handlePatientSelect}
        />

       
        {/* Profile Content Tabs */}
        <Card>
          <CardBody>
            <Nav tabs className='profile-tabs'>
              <NavItem>
                <NavLink
                  active={activeTab === 'medical'}
                  onClick={() => toggle('medical')}
                >
                  <Heart size={16} className='me-1' />
                  {t('Medical Profile')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'instructions'}
                  onClick={() => toggle('instructions')}
                >
                  <FileText size={16} className='me-1' />
                  {t('Instructions')}
                  {selectedPatient.instructions?.length > 0 && (
                    <Badge color='light-primary' className='ms-2'>
                      {selectedPatient.instructions.length}
                    </Badge>
                  )}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'medicines'}
                  onClick={() => toggle('medicines')}
                >
                  {/* <Pill size={16} className='me-1' /> */}
                  {t('Medicines')}
                  {selectedPatient.medicines?.length > 0 && (
                    <Badge color='light-success' className='ms-2'>
                      {selectedPatient.medicines.length}
                    </Badge>
                  )}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'reservations'}
                  onClick={() => toggle('reservations')}
                >
                  <Calendar size={16} className='me-1' />
                  {t('Reservations')}
                </NavLink>
              </NavItem>
               <NavItem>
                <NavLink
                  active={activeTab === 'reports'}
                  onClick={() => toggle('reports')}
                >
                  <Edit2 size={16} className='me-1' />
                  {t('Reports')}
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className='mt-4'>
              <TabPane tabId='medical'>
                <MedicalProfile patient={selectedPatient} />
              </TabPane>
              <TabPane tabId='instructions'>
                <Instructions 
                  instructions={selectedPatient.instructions || []}
                  patientId={selectedPatient.id}
                  onUpdate={refetch}
                />
              </TabPane>
              <TabPane tabId='medicines'>
                <Medicines 
                  medicines={selectedPatient.medicines || []}
                  patientId={selectedPatient.id}
                  onUpdate={refetch}
                />
              </TabPane>
              <TabPane tabId='reservations'>
                <Reservations patientId={id} />
              </TabPane>
              <TabPane tabId='reports'>
                <Reports complaints={selectedPatient.complaints} />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default PatientsProfile
