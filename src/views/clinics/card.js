// ** Reactstrap Imports
import { Card, CardBody, CardImg, Badge, Row, Col } from 'reactstrap'

// ** React
import { Fragment } from 'react'

// ** Icons
import { Paperclip, Star, MapPin } from 'react-feather'
import './doctor-card.scss'
import { Link } from 'react-router-dom'
const ClinicsCard = ({data}) => {
  return (
    <Fragment>
      <Row>
        {data?.map((item, index) => {
          return (
            <Col key={index} xl={4} md={6}>
              <Card className='card-profile doctor-card position-relative'>
                {/* Attachment Icon */}
                <div className='attachment-icon position-absolute' style={{
                  top: '-18px',
                  right: '-15px',
                  zIndex: 10,
                  overflow:'visible',
                  borderRadius: '50%',
                  padding: '8px'
                }}>
                  <Paperclip size={35} className='text-dark' />
                </div>
                {/* Cover Image */}
                <CardImg
                  className='img-fluid'
                  src={item?.logo?.[0]?.url}
                  top
                />
                <CardBody className='text-center p-1'>
                  {/* Clinic Name - Centered */}
                  <Link to={`/clinics/profile/${item?.clinic_name}`} state={{id:item?.id}} className='mb-1 text-center' style={{fontSize: '20px', fontWeight: '600'}}>
                    {item?.clinic_name}
                  </Link>

                  {/* Category Display */}
                  {item?.sub_categories && item.sub_categories.length > 0 && (
                    <p className='text-muted mb-1 text-center' style={{fontSize: '12px', fontWeight: '500'}}>
                      {item.sub_categories[0]?.category?.name}
                    </p>
                  )}
                  {/* Badge - Centered under name */}
                  <div className='text-center mb-2'>
                    <Badge
                      color={item?.is_center === 1 ? 'light-primary' : 'light-secondary'}
                      style={{fontSize: '13px', padding: '0.25rem 0.5rem'}}
                    >
                      {item?.is_center === 1 ? 'مركز طبي' : 'دكتور'}
                    </Badge>
                  </div>

                  {/* Bio/Description */}
                  {item?.bio && (
                    <p className='text-muted mb-2' style={{fontSize: '14px', lineHeight: '1.3'}}>
                      {item.bio}
                    </p>
                  )}
                  {/* Rating and License */}
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <div className='d-flex align-items-center'>
                      <Star size={14} className='text-warning me-1' fill='currentColor' />
                      <small className='fw-bold text-warning'  style={{fontSize: '14px'}}>
                        {item.rate}
                      </small>
                    </div>
                    <div className='d-flex align-items-center'>
                      <MapPin size={12} className='text-danger me-1' />
                      <small className='text-muted' style={{fontSize: '14px'}}>
                        {item.address_text}
                      </small>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Fragment>
  )
}

export default ClinicsCard
