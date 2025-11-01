// ** React Imports
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Spinner,
  Alert,
  Input,
  Form,
  FormGroup
} from 'reactstrap'

// ** Components
import SystemModal from '../components/systemModal'

// ** Icons
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Trash2,
  Calendar,
  Share2,
  Check,
  X
} from 'react-feather'

// ** RTK Query
import {
  useDetailsMutation,
  useRemoveCommentMutation,
  useRemoveReplayMutation,
  useDeleteMutation
} from '../../redux/rtkQuery/articles'
import blank from '../../assets/images/base/avatar-blank.png'
// ** Styles
import './article-profile.scss'

const ArticleProfile = () => {
  const id = useLocation()?.state
  const navigate = useNavigate()
  const { t } = useTranslation()

  // ** States
  const [article, setArticle] = useState(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  const [deleteConfirm, setDeleteConfirm] = useState({})
  const [replyDeleteConfirm, setReplyDeleteConfirm] = useState({})
  const [deletingComment, setDeletingComment] = useState({})
  const [deletingReply, setDeletingReply] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletingArticle, setDeletingArticle] = useState(false)

  // ** RTK Query
  const [getArticle, { isLoading, error }] = useDetailsMutation()
  const [deleteComment] = useRemoveCommentMutation()
  const [deleteReply] = useRemoveReplayMutation()
  const [deleteArticle] = useDeleteMutation()

  // ** Fetch Article Function
  const fetchArticle = async () => {
    try {
      const response = await getArticle({ id }).unwrap()
      if (response?.data) {
        setArticle(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
    }
  }

  // ** Fetch Article on Mount
  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  // ** Handle Delete Comment Confirmation
  const handleDeleteCommentConfirm = (commentId) => {
    setDeleteConfirm(prev => ({ ...prev, [commentId]: true }))
  }

  // ** Cancel Delete Comment
  const cancelDeleteComment = (commentId) => {
    setDeleteConfirm(prev => ({ ...prev, [commentId]: false }))
  }

  // ** Confirm Delete Comment
  const confirmDeleteComment = async (commentId) => {
    try {
      setDeletingComment(prev => ({ ...prev, [commentId]: true }))
      await deleteComment({ id: commentId }).unwrap()
      setDeleteConfirm(prev => ({ ...prev, [commentId]: false }))
      setDeletingComment(prev => ({ ...prev, [commentId]: false }))
      fetchArticle()
    } catch (error) {
      console.error('Failed to delete comment:', error)
      setDeleteConfirm(prev => ({ ...prev, [commentId]: false }))
      setDeletingComment(prev => ({ ...prev, [commentId]: false }))
    }
  }

  // ** Handle Delete Reply Confirmation
  const handleDeleteReplyConfirm = (replyId) => {
    setReplyDeleteConfirm(prev => ({ ...prev, [replyId]: true }))
  }

  // ** Cancel Delete Reply
  const cancelDeleteReply = (replyId) => {
    setReplyDeleteConfirm(prev => ({ ...prev, [replyId]: false }))
  }

  // ** Confirm Delete Reply
  const confirmDeleteReply = async (replyId) => {
    try {
      setDeletingReply(prev => ({ ...prev, [replyId]: true }))
      await deleteReply({ id: replyId }).unwrap()
      setReplyDeleteConfirm(prev => ({ ...prev, [replyId]: false }))
      setDeletingReply(prev => ({ ...prev, [replyId]: false }))
      fetchArticle()
    } catch (error) {
      console.error('Failed to delete reply:', error)
      setReplyDeleteConfirm(prev => ({ ...prev, [replyId]: false }))
      setDeletingReply(prev => ({ ...prev, [replyId]: false }))
    }
  }

  // ** Handle Delete Article
  const handleDeleteArticle = () => {
    setShowDeleteModal(true)
    setDeleteConfirmText('')
  }

  // ** Confirm Delete Article
  const confirmDeleteArticle = async () => {
    if (deleteConfirmText !== article?.title) {
      return // Don't delete if title doesn't match
    }

    try {
      setDeletingArticle(true)
      await deleteArticle({ id }).unwrap()
      setShowDeleteModal(false)
      navigate('/articles')
    } catch (error) {
      console.error('Failed to delete article:', error)
      setDeletingArticle(false)
    }
  }

  // ** Cancel Delete Article
  const cancelDeleteArticle = () => {
    setShowDeleteModal(false)
    setDeleteConfirmText('')
    setDeletingArticle(false)
  }

  // ** Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // ** Get User Avatar
  const getUserAvatar = (user) => {
    return user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || user?.phone_number}&background=1fa2ff&color=fff`
  }

  // ** Loading State
  if (isLoading) {
    return (
      <Container fluid className='article-profile-container'>
        <div className='text-center py-5'>
          <Spinner color='primary' size='lg' />
          <h5 className='mt-3'>{t('Loading Article...')}</h5>
        </div>
      </Container>
    )
  }

  // ** Error State
  if (error || !article) {
    return (
      <Container fluid className='article-profile-container'>
        <Alert color='danger'>
          <h4 className='alert-heading'>{t('Error')}</h4>
          <p>{t('Failed to load article. Please try again.')}</p>
          <Button color='primary' onClick={() => navigate('/articles')}>
            {t('Back to Articles')}
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className='article-profile-container'>
      {/* Header with Back Button */}
      <div className='profile-header mb-4'>
        <Button
          color='link'
          className='back-btn p-0'
          onClick={() => navigate('/articles')}
        >
          <ArrowLeft size={20} className='me-2' />
          {t('Back to Articles')}
        </Button>
      </div>
      {
        article && (
        <Row className='justify-content-center'>
          <Col xl={8} lg={10}>
            <div className='article-profile-content'>
              {/* Article Content & Doctor Info Combined */}
              <div className='article-content-section mb-4'>
                <Card className='content-card'>
                  <CardBody className='p-4'>
                    {/* Article Title & Date */}
                    <div className='article-header mb-3'>
                      <h1 className='article-title'>{article.title}</h1>
                      <div className='article-date'>
                        <Calendar size={14} className='me-1' />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>

                    {/* Article Media Section */}
                    {article.media && article.media.length > 0 && (
                      <div className='article-media-section mb-1'>
                        <div className='media-container'>
                          {/* Current Media Display */}
                          <div className='media-display'>
                            {(() => {
                              const currentMedia = article.media[activeMediaIndex]
                              return currentMedia.type === 'video' ? (
                                <video
                                  src={currentMedia.url}
                                  className='article-media'
                                  controls
                                  poster={currentMedia.thumbnail || ''}
                                />
                              ) : (
                                <img
                                  src={currentMedia.url}
                                  alt={article.title}
                                  className='article-media'
                                />
                              )
                            })()}
                          </div>

                          {/* Media Navigation */}
                          {article.media.length > 1 && (
                            <div className='media-pagination'>
                              {article.media.map((_, index) => (
                                <button
                                  key={index}
                                  className={`media-dot ${activeMediaIndex === index ? 'active' : ''}`}
                                  onClick={() => setActiveMediaIndex(index)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Doctor Info Inline */}
                    {article.doctor && (
                      <div className='doctor-info-inline mb-1'>
                        <div className='doctor-header'>
                          <div className='doctor-avatar'>
                            <img
                              src={article.doctor.logo?.[0]?.url || `https://ui-avatars.com/api/?name=${article.doctor.clinic_name}&background=1fa2ff&color=fff`}
                              alt={article.doctor.clinic_name}
                              className='avatar-img'
                            />
                          </div>
                          <div className='doctor-details'>
                            <Link to={`/clinics/profile/${article.doctor.clinic_name}`} state={{id:article.doctor.id}} className='doctor-name mb-1'>{article.doctor.clinic_name}</Link>
                            <div className='doctor-meta'>
                              <span className='text-muted'>{article.doctor.address_text}</span>
                              <Badge color='light-primary' className='ms-2'>
                                ⭐ {article.doctor.rate}/5
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Article Stats & Actions */}
                    <div className='article-stats-bar mb-1'>
                      <div className='stats-left'>
                        <div className='stat-item'>
                          <Eye size={16} className='me-1' />
                          <span>{article.views}</span>
                        </div>
                        <div className='stat-item'>
                          <MessageCircle size={16} className='me-1' />
                          <span>{article.number_of_comments}</span>
                        </div>
                      </div>

                      <div className='stats-right'>
                        <Button
                          color='link'
                          className='action-btn p-0 text-danger'
                          onClick={handleDeleteArticle}
                          title={t('Delete Article')}
                        >
                          <Trash2 size={16} className='me-1' />
                          <span>{t('Delete')}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Article Body */}
                    <div className='article-body mb-1'>
                      <p>{article.body}</p>
                    </div>

                  </CardBody>
                </Card>
              </div>

              {/* Comments Section */}
              <div className='comments-section'>
                <Card className='comments-card'>
                  <CardBody className='p-4'>
                    <div className='comments-header mb-1'>
                      <h4 className='comments-title mb-0'>
                        {t('Comments')} ({article.comments?.length || 0})
                      </h4>
                    </div>
                    {/* Comments List */}
                    <div className='comments-list'>
                      {article?.comments && article?.comments.length > 0 ? (
                        article?.comments.map((comment) => (
                          <div key={comment?.id} className={`comment-item mb-4 ${comment?.status === 'deleted' ? 'comment-deleted' : ''}`}>
                            <div className='comment-main'>
                              <div className='comment-avatar'>
                                <img
                                  src={getUserAvatar(comment?.user)}
                                  alt={comment?.user?.name || comment?.user?.phone_number}
                                  className='avatar-img'
                                />
                              </div>

                              <div className='comment-content'>
                                <div className='comment-header'>
                                  <div className='comment-user-info'>
                                    <Link to={comment?.user?.role_name === 'doctor' ? `/clinics/profile/${comment?.user?.name}` : `/patients/profile/${comment?.user?.name}`}
                                          state={{id:comment?.user?.id}}
                                          className='user-name'>
                                      {comment?.user?.name || comment?.user?.phone_number}
                                    </Link>
                                    <Badge color={`light-${comment?.user?.role_name === 'doctor' ? 'primary' : 'secondary'}`} className='ms-2'>
                                      {comment?.user?.role_name}
                                    </Badge>
                                    <span className='comment-date ms-2'>
                                      {comment?.created_at}
                                    </span>
                                  </div>

                                  <div className='comment-actions'>
                                    {comment?.status !== 'deleted' && (
                                      <>
                                        {deleteConfirm[comment?.id] ? (
                                          <div className='delete-confirm-actions d-flex'>
                                            <Button
                                              color='link'
                                              size='sm'
                                              className='action-btn p-0 me-1 text-success'
                                              onClick={() => confirmDeleteComment(comment?.id)}
                                              title={t('Confirm Delete')}
                                              disabled={deletingComment[comment?.id]}
                                            >
                                              {deletingComment[comment?.id] ? (
                                                <Spinner size='sm' />
                                              ) : (
                                                <Check size={14} />
                                              )}
                                            </Button>
                                            <Button
                                              color='link'
                                              size='sm'
                                              className='action-btn p-0 text-muted'
                                              onClick={() => cancelDeleteComment(comment?.id)}
                                              title={t('Cancel')}
                                              disabled={deletingComment[comment?.id]}
                                            >
                                              <X size={14} />
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            color='link'
                                            size='sm'
                                            className='action-btn p-0 text-danger'
                                            onClick={() => handleDeleteCommentConfirm(comment?.id)}
                                            title={t('Delete Comment')}
                                          >
                                            <Trash2 size={14} />
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className='comment-text'>
                                  <p>
                                    {comment?.comment}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Replies */}
                            {comment?.replay && comment?.replay.length > 0 && (
                              <div className='replies-section mt-3'>
                                {comment?.replay.map((reply) => (
                                  <div key={reply.id} className={`reply-item ${reply.status === 'deleted' ? 'reply-deleted' : ''}`}>
                                    <div className='reply-content'>
                                      <div className='reply-header'>
                                        <img
                                          src={blank}
                                          className='avatar-img'
                                          style={{
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px'
                                          }}
                                        />
                                        <span className='reply-text'>
                                          {reply.replay}
                                        </span>
                                        <div className='reply-meta'>
                                          <span className='reply-date'>{reply.created_at}</span>
                                          {reply.status !== 'deleted' && (
                                            <>
                                              {replyDeleteConfirm[reply.id] ? (
                                                <div className='delete-confirm-actions d-flex ms-2'>
                                                  <Button
                                                    color='link'
                                                    size='sm'
                                                    className='action-btn p-0 me-1 text-success'
                                                    onClick={() => confirmDeleteReply(reply.id)}
                                                    title={t('Confirm Delete')}
                                                    disabled={deletingReply[reply.id]}
                                                  >
                                                    {deletingReply[reply.id] ? (
                                                      <Spinner size='sm' />
                                                    ) : (
                                                      <Check size={12} />
                                                    )}
                                                  </Button>
                                                  <Button
                                                    color='link'
                                                    size='sm'
                                                    className='action-btn p-0 text-muted'
                                                    onClick={() => cancelDeleteReply(reply.id)}
                                                    title={t('Cancel')}
                                                    disabled={deletingReply[reply.id]}
                                                  >
                                                    <X size={12} />
                                                  </Button>
                                                </div>
                                              ) : (
                                                <Button
                                                  color='link'
                                                  size='sm'
                                                  className='delete-reply-btn p-0 ms-2 text-danger'
                                                  onClick={() => handleDeleteReplyConfirm(reply.id)}
                                                  title={t('Delete Reply')}
                                                >
                                                  <Trash2 size={12} />
                                                </Button>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className='no-comments text-center py-4'>
                          <MessageCircle size={48} className='text-muted mb-3' />
                          <h5 className='text-muted'>{t('No Comments Yet')}</h5>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
        )
      }

      {/* Delete Article Modal */}
      <SystemModal
        show={showDeleteModal}
        setShow={cancelDeleteArticle}
        title={t('Delete Article')}
        confirmText={t('Delete')}
        cancelText={t('Cancel')}
        onReomve={confirmDeleteArticle}
        disabled={deleteConfirmText !== article?.title || deletingArticle}
        isRemoving={deletingArticle}
        confirmColor='danger'
      >
         <Alert color='danger'>
            <h6 className='alert-heading'>{`${t('Warning')}!`}</h6>
            <div className='alert-body' style={{ fontSize: '11px' }}>
              {t('To confirm deletion, please type the article title:')}
            </div>
          </Alert>
        <div className='mb-3'>
          <Form>
            <FormGroup>
              <Input
                type='text'
                placeholder={t('Type article title here...')}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deletingArticle}
              />
            </FormGroup>
          </Form>
        </div>
      </SystemModal>
    </Container>
  )
}

export default ArticleProfile
