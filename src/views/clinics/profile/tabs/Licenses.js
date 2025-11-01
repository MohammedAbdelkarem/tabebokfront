// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { 
  Card, CardBody, CardTitle, Row, Col, 
  Badge, Button, Modal, ModalHeader, ModalBody 
} from 'reactstrap'

// ** Icons
import { Award, Eye, Download, FileText, Image } from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

const Licenses = ({ data }) => {
  const { t } = useTranslation()
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  if (!data?.licenses || data.licenses.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <Award size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No Licenses Available')}</h5>
          <p className='text-muted'>{t('This clinic has not uploaded any licenses yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  const handleViewLicense = (license) => {
    setSelectedLicense(license)
    setModalOpen(true)
  }

  const handleDownload = (license) => {
    // Create a temporary link to download the file
    const link = document.createElement('a')
    link.href = license.url
    link.download = license.title || `license-${license.id}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h4' className='mb-4'>
                <Award size={20} className='me-2 text-primary' />
                {t('Medical Licenses & Certifications')}
              </CardTitle>

              {/* License Grid */}
              <Row>
                {data.licenses.map((license, index) => (
                  <Col lg={4} md={6} sm={12} key={license.id || index} className='mb-4'>
                    <Card className='h-100 border-0 shadow-sm license-card'>
                      <CardBody className='p-3'>
                        {/* License Preview */}
                        <div className='text-center mb-3'>
                          <div 
                            className='license-preview position-relative'
                            style={{
                              height: '200px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleViewLicense(license)}
                          >
                            {license.type === 'image' ? (
                              <img
                                src={license.url}
                                alt={license.title || `License ${index + 1}`}
                                className='w-100 h-100'
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className='d-flex align-items-center justify-content-center h-100'>
                                <FileText size={48} className='text-muted' />
                              </div>
                            )}
                            
                            {/* Overlay */}
                            <div 
                              className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                              style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                opacity: 0,
                                transition: 'opacity 0.3s'
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = 1}
                              onMouseLeave={(e) => e.target.style.opacity = 0}
                            >
                              <Eye size={24} className='text-white' />
                            </div>
                          </div>
                        </div>

                        {/* License Info */}
                        <div className='text-center mb-3'>
                          <h6 className='mb-2 text-dark'>
                            {license.title || `${t('License')} #${license.id}`}
                          </h6>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* License View Modal */}
      <Modal 
        isOpen={modalOpen} 
        toggle={() => setModalOpen(false)} 
        size='lg'
        centered
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          {selectedLicense?.title || t('License View')}
        </ModalHeader>
        <ModalBody className='text-center p-4'>
          {selectedLicense && (
            <>
              {selectedLicense.type === 'image' ? (
                <img
                  src={selectedLicense.url}
                  alt={selectedLicense.title}
                  className='img-fluid rounded'
                  style={{ maxHeight: '500px' }}
                />
              ) : (
                <div className='py-5'>
                  <FileText size={64} className='text-muted mb-3' />
                  <h5>{t('Document Preview Not Available')}</h5>
                  <p className='text-muted'>{t('Click download to view this document')}</p>
                  <Button
                    color='primary'
                    onClick={() => handleDownload(selectedLicense)}
                  >
                    <Download size={16} className='me-2' />
                    {t('Download Document')}
                  </Button>
                </div>
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Licenses
