// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { 
  Card, CardBody, CardTitle, Row, Col, 
  Badge, CardText, Button 
} from 'reactstrap'

// ** Icons
import { 
  FileText, Eye, Heart, MessageCircle, 
  Calendar, User, TrendingUp 
} from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

const Articles = ({ data }) => {
  const { t } = useTranslation()

  if (!data?.articles || data.articles.length === 0) {
    return (
      <Card>
        <CardBody className='text-center py-5'>
          <FileText size={48} className='text-muted mb-3' />
          <h5 className='text-muted'>{t('No Articles Available')}</h5>
          <p className='text-muted'>{t('This clinic has not published any articles yet.')}</p>
        </CardBody>
      </Card>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Truncate text
  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Fragment>
      <Row>
        {/* Articles List */}
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h5' className='mb-3'>
                <FileText size={18} className='me-2 text-primary' />
                {t('Published Articles')}
              </CardTitle>

              <Row>
                {data.articles.map((article, index) => (
                  <Col lg={6} md={12} key={article.id || index} className='mb-3'>
                    <Card className='h-100 border-0 shadow-sm'>
                      <CardBody className='p-3'>
                        {/* Article Header */}
                        <div className='d-flex justify-content-between align-items-start mb-3'>
                          <div className='flex-grow-1'>
                            <h6 className='mb-2 text-dark fw-bold'>
                              {article.title}
                            </h6>
                            <div className='d-flex align-items-center text-primary small'>
                              <Calendar size={12} className='me-1' />
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                          </div>
                          <Badge color='light-primary' className='ms-2'>
                            {t('Article')} #{article.id}
                          </Badge>
                        </div>

                        {/* Article Content Preview */}
                        <CardText className='text-justify small mb-3'>
                          {truncateText(article.body)}
                        </CardText>

                        {/* Article Stats */}
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-3'>
                              <Eye size={14} className='text-info me-1' />
                              <small className='text-muted'>{article.views || 0}</small>
                            </div>
                            <div className='d-flex align-items-center me-3'>
                              <Heart size={14} className='text-danger me-1' />
                              <small className='text-muted'>{article.number_of_likes || 0}</small>
                            </div>
                            <div className='d-flex align-items-center'>
                              <MessageCircle size={14} className='text-warning me-1' />
                              <small className='text-muted'>{article.number_of_comments || 0}</small>
                            </div>
                          </div>
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
    </Fragment>
  )
}

export default Articles
