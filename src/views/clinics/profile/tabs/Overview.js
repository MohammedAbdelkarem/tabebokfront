// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
  Card, CardBody, CardTitle, Row, Col,
  Badge, Button, CardText, Collapse
} from 'reactstrap'

// ** Icons
import {
  MapPin, Phone, Mail, Globe,
  Star, Award, Calendar, Clock, ChevronDown,
  ChevronRight,
  User,
  Paperclip
} from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Overview = ({ data }) => {
  const { t } = useTranslation()
  if (!data) return null
  return (
    <Fragment>
      <Row className={'match-height'}>
        {/* Basic Information */}
        <Col lg={8} md={12}>
          <Card className='mb-3'>
            <CardBody>
              <CardTitle tag='h4' className='mb-3'>
                <MapPin size={20} className='me-2 text-primary' />
                {t('Clinic Information')}
              </CardTitle>
              
              <Row>
                <Col md={6}>
                  <div className='mb-3'>
                    <h6 className='fw-bold text-muted mb-1'>{t('Clinic Name')}</h6>
                    <p className='mb-0'>{data.clinic_name}</p>
                  </div>
                  
                  <div className='mb-3'>
                    <h6 className='fw-bold text-muted mb-1'>{t('License Number')}</h6>
                    <p className='mb-0 text-primary fw-bold'>{data.license_number}</p>
                  </div>
                </Col>

                <Col md={6}>
                  <div className='mb-3'>
                    <h6 className='fw-bold text-muted mb-1'>{t('Rating')}</h6>
                    <div className='d-flex align-items-center'>
                      <Star size={18} className='text-warning me-1' fill='currentColor' />
                      <span className='fw-bold text-warning me-2'>{data.rate}</span>
                      <small className='text-muted'>
                        ({data.rates?.length || 0} {t('reviews')})
                      </small>
                    </div>
                  </div>

                  <div className='mb-3'>
                    <h6 className='fw-bold text-muted mb-1'>{t('Location')}</h6>
                    <div className='d-flex align-items-start'>
                      <MapPin size={16} className='text-danger me-2 mt-1' />
                      <div>
                        <p className='mb-1'>{data.address_text}</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Bio Section */}
              {data.bio && (
                <div className='mt-3'>
                  <h6 className='fw-bold text-muted mb-2'>{t('About')}</h6>
                  <CardText className='text-justify'>{data.bio}</CardText>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col lg={4} md={12}>
           {/* Doctor Profile */}
          {data.user && (
            <div className='d-flex justify-content-center'>
              <Link
                to={`/users/profile/${data.user.name}`}
                state={{ id: data.user.id }}
                className='text-decoration-none'
              >
                <Card
                  className='border-0 shadow-sm'
                  style={{
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardBody className='p-4 position-relative'>
                    <div className='attachment-icon position-absolute' style={{
                      top: '-18px',
                      right: '-15px',
                      zIndex: 10,
                      overflow:'visible',
                      borderRadius: '50%',
                      padding: '8px',
                      background: '#1fa2ff',
                      boxShadow: '0 2px 8px rgba(70, 131, 134, 0.3)'
                    }}>
                      <Paperclip size={25} className='text-white' />
                    </div>
                    <CardTitle tag='h5' className='mb-3'>
                      <User size={18} className='me-2 text-primary' />
                      {t('User info')}
                    </CardTitle>
                    <div className='d-flex align-items-center'>
                      {/* Doctor Avatar */}
                      <div className='position-relative me-3'>
                        <img
                          src={data.user.avatar || `https://ui-avatars.com/api/?name=${data.user.name}&background=1fa2ff&color=fff`}
                          alt={data.user.name}
                          className='rounded-circle'
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            border: '3px solid #1fa2ff'
                          }}
                        />
                        {/* Status Indicator */}
                        <div
                          className='position-absolute'
                          style={{
                            bottom: '4px',
                            right: '4px',
                            width: '14px',
                            height: '14px',
                            background: data.user.is_active ? '#28a745' : '#dc3545',
                            borderRadius: '50%',
                            border: '2px solid white'
                          }}
                        />
                      </div>

                      {/* Doctor Info */}
                      <div className='flex-grow-1 text-start'>
                        <h6 className='mb-2 text-dark fw-bold'>
                          Dr. {data.user.name}
                        </h6>

                        {/* Badges */}
                        <div className='d-flex flex-wrap gap-1 mb-2'>
                          <Badge color='light-primary' className='rounded-pill'>
                            {data.user.is_doctor ? t('Doctor') : t('User')}
                          </Badge>
                          <Badge
                            color={data.user.is_active ? 'light-success' : 'light-danger'}
                            className='rounded-pill'
                          >
                            {data.user.is_active ? t('Active') : t('Inactive')}
                          </Badge>
                        </div>

                        {/* Phone */}
                        <div className='d-flex align-items-center text-muted mb-2'>
                          <Phone size={14} className='me-2' />
                          <small>{data.user.phone_number}</small>
                        </div>

                        {/* View Profile Link */}
                        <div className='d-flex align-items-center text-primary'>
                          <small className='fw-semibold'>{t('View Profile')}</small>
                          <ChevronRight size={16} className='ms-1' />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </div>
          )}
          <Card className='mb-3'>
            <CardBody>
              <CardTitle tag='h5' className='mb-3'>
                <Award size={18} className='me-2 text-primary' />
                {t('Specializations')}
              </CardTitle>

              {data?.sub_categories && data.sub_categories.length > 0 ? (
                data.sub_categories.map((subCat, index) => (
                  <div key={subCat.id || index} className='d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded'>
                    <div>
                      <h6 className='mb-0'>{subCat.name}</h6>
                      <small className='text-muted'>
                        {subCat.category?.name || t('Uncategorized')}
                      </small>
                    </div>
                    <Badge color='light-primary'>
                      {t('Service')}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className='text-muted text-center'>{t('No specializations available')}</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

    </Fragment>
  )
}

export default Overview
