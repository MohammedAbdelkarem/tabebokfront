// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane, Alert, Card, CardBody, Button, Collapse, Badge, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'

// ** Demo Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import { useShowMutation } from '../../../redux/rtkQuery/clinic'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoadSpinner from '../../../@core/components/spinner/loaders'
import { useTranslation } from 'react-i18next'
import Tabs from './Tabs'
// Import new tab components
import Overview from './tabs/Overview'
import ReservationCalendar from './tabs/ReservationCalendar'
import Reviews from './tabs/Reviews'
import Articles from './tabs/Articles'
import Analytics from './tabs/Analytics'
import Licenses from './tabs/Licenses'
import SystemModal from '../../components/systemModal'
import Reports from './tabs/reports'
import { ChevronDown, ChevronRight, MoreVertical, Phone, Star } from 'react-feather'
import Shifts from './tabs/shifts'

// Add CSS animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
  }

  @keyframes starGlow {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
    50% { transform: scale(1.1); filter: drop-shadow(0 4px 8px rgba(255,193,7,0.4)); }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  .doctor-profile-card:hover .hover-shimmer {
    left: 100% !important;
  }

  .clinic-hero-card:hover .clinic-logo-container {
    transform: scale(1.05) rotate(5deg);
  }
`

const ClinicProfile = () => {
  const {t} = useTranslation()
  const state = useLocation()?.state
  console.log('state',state);
   
  const [show, {data, isLoading}] = useShowMutation()
  const profile = data?.data || null
  const [enteredName, setEnteredName] = useState('')
  const [hideModal, setHideModal] = useState(false)
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const navigate = useNavigate()
  const toggleTab = tab => {
    setActiveTab(tab)
  }

    useEffect(() => {
        if (state) {
        show({id:state?.id})
        }
    }, [state])

  return (
    <Fragment>
      {/* Inject CSS animations */}
      <style>{styles}</style>
      <Breadcrumbs title= {t('Clinics profile')} data={[{ title: t('Clinics'), link:'/clinics' }, { title: profile?.clinic_name }]} />
        <Row>
          {
            isLoading ? <LoadSpinner/> : <Row className={'match-height'}>
                <Col xs={12}>
                    <Col xs={12}>
                      <Card
                        className='border-0 shadow-sm'
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden'
                        }}
                      >
                        <CardBody className='text-center p-1'>
                              <UncontrolledDropdown direction="down" className="position-absolute" style={{ top: '25px', left: '5px' }}>
                          <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
                            <MoreVertical size={18} />
                          </DropdownToggle>
                          <DropdownMenu end>
                            
                            <DropdownItem onClick={() => navigate('/story-management', {state:{clinic:profile}}) }>
                              {t('Add Story')}
                            </DropdownItem>
                            
                            <DropdownItem onClick={() => navigate('/banner-management', {state:{clinic:profile}}) }>
                              {t('Add Banner')}
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                          <div className='mb-3'>
                            {
                              profile?.logo?.length > 0 && (
                                <img
                                  src={profile?.logo[0]?.url}
                                  className='img-fluid rounded-circle shadow-sm'
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    border: '4px solid #f8f9fa'
                                  }}
                                />
                              )
                            }
                          </div>
                          <h3 className='text-primary mb-3 fw-bold'>
                            {profile?.clinic_name}
                          </h3>

                          {/* Rating */}
                          <div className='mb-4'>
                            <div className='d-flex justify-content-center align-items-center mb-2'>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  className={`me-1 ${i < Math.floor(profile?.rate) ? 'text-warning' : 'text-muted'}`}
                                  fill='currentColor'
                                />
                              ))}
                            </div>
                            <Badge color='primary'>
                              {profile?.rate}/5 • {profile?.rates?.length || 0} {t('Reviews')}
                            </Badge>
                          </div>
                        </CardBody>

                      </Card>
                    </Col>
                </Col>
                
                <Col xs={12}>
                    <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId='1'>
                            <Overview data={profile}/>
                        </TabPane>
                        <TabPane tabId='2'>
                            <ReservationCalendar doctorId={profile?.id} />
                        </TabPane>
                        <TabPane tabId='3'>
                            <Reviews
                              data={profile}
                              onDataUpdate={() => show({id: state?.id})}
                            />
                        </TabPane>
                        <TabPane tabId='4'>
                            <Articles data={profile} />
                        </TabPane>
                        <TabPane tabId='5'>
                            <Analytics doctorId={profile?.id} />
                        </TabPane>
                        <TabPane tabId='6'>
                            <Licenses data={profile}/>
                        </TabPane>
                        
                        <TabPane tabId='7'>
                            <Reports complaints={profile?.complaints}/>
                        </TabPane>
                        <TabPane tabId='8'>
                            <Shifts shifts={profile?.shifts}/>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
          }
        </Row>
        {
            hideModal && (
                <SystemModal
                    show={hideModal}
                    setShow={setHideModal}
                    title={`${t('Hide product')} (${profile?.name})`}
                    onReomve={() => hide({id:profile.id})}
                    isRemoving={hiding}
                    status={status}
                    message={hideErr?.data?.message}     
                    disabled={enteredName.trim() !== profile?.name.trim()}
                >
                    <Alert color='danger'>
                    <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
                    <div className='alert-body' style={{ fontSize: '11px' }}>
                        { profile?.hidden_case !== '' ? t('To confirm Show this product enter its name below..') : t('To confirm Hide this product enter its name below..')}
                    </div>
                    </Alert>
                    <div className="mt-2">
                    <input
                        type="text"
                        className="form-control"
                        value={enteredName}
                        onChange={(e) => setEnteredName(e.target.value)}
                        onPaste={(e) => e.preventDefault()}
                        placeholder={`${t('e.g.')  } Store name`}
                    />
                    {enteredName && enteredName !== profile?.name.trim() && (
                        <small className="text-danger">{t('the name does not match')}</small>
                    )}
                    </div>
                </SystemModal>
            )
        }
    </Fragment>
  )
}

export default ClinicProfile
