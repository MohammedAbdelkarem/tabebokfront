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
  FileText,
  User
} from 'react-feather'

const Instructions = ({ instructions }) => {
  const { t } = useTranslation()

  // ** Empty State
  if (!instructions || instructions.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <FileText size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No Instructions Available')}</h5>
          <p className='text-muted'>{t('This patient has no medical instructions yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className='instructions-content'>
      <Row>
        {instructions.map((instruction) => (
          <Col lg={4} md={4} sm={6} key={instruction.id} className='mb-3'>
            <Card
              className='instruction-card h-100'
              style={{ backgroundColor: '#d6eeff' }}
            >
              <CardBody className='p-1'>
                {/* Instruction Text */}
                <div className='instruction-text mb-1'>
                  <p className='mb-0 text-dark' style={{ fontSize: '1.3rem' }}>
                    {instruction.text}
                  </p>
                </div>

                {/* Notes */}
                {instruction.notes && (
                  <div className='instruction-notes mb-1'>
                    <h6 className='text-dark fw-bold'>{t('• Notes')}:</h6>
                    <p className='mb-0 text-muted' style={{ fontSize: '1rem' }}>
                      {instruction.notes}
                    </p>
                  </div>
                )}

                {/* Added By */}
                {instruction.added_by && (
                  <div className='added-by-section'>
                    <h6 className='text-dark mb-2 fw-bold'>{t('Added by')}:</h6>
                    <div className='d-flex align-items-center'>
                      <img
                        src={instruction.added_by.avatar}
                        alt={instruction.added_by.full_name}
                        className='added-by-avatar me-2'
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className='added-by-name text-dark fw-medium' style={{ fontSize: '0.875rem' }}>
                          {instruction.added_by.full_name}
                        </div>
                        <Badge color='light-primary' style={{ fontSize: '0.75rem' }}>
                          {instruction.added_by.role_name}
                        </Badge>
                      </div>
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

export default Instructions
