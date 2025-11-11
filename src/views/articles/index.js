
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardImg,
    Badge,
    Spinner,
    Alert,
    Input,
    Label,
    FormGroup,
    Button
} from 'reactstrap'


import {
    Eye,
    Heart,
    MessageCircle,
    Calendar,
    User,
    Play,
    Filter,
    X
} from 'react-feather'


import { useListMutation } from '../../redux/rtkQuery/articles'
import { useGetQuery as useCategoryQuery } from '../../redux/rtkQuery/content/category'


import './articles.scss'
import { useOverviewMutation } from '../../redux/rtkQuery/admin'
import useHeaders from '@hooks/useHeaders'
const Articles = () => {
    const headers = useHeaders()
    const { t } = useTranslation()
    const [articles, setArticles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)
    const [activeMediaIndex, setActiveMediaIndex] = useState({})
    const [expandedArticles, setExpandedArticles] = useState(new Set())

    // ** Filter States
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [filterTimeout, setFilterTimeout] = useState(null)
    const [overview, { data, isError }] = useOverviewMutation()

    useEffect(() => {
      overview({headers})
    }, [])
  
  
    const [getArticles, { isLoading, error }] = useListMutation()
    const { data: categoriesData, isLoading: categoriesLoading } = useCategoryQuery({})
        const fetchArticles = useCallback(
            async (page = 1, reset = false, overrideCategories = null) => {
                if (loading) return
                if (!reset && !hasMore) return

                setLoading(true)
                try {
                const buildFilterOptions = (categories) => {
                    const params = new URLSearchParams()

                    params.append('page', reset ? 1 : currentPage)
                    params.append('per_page', 12)

                    if (categories?.length > 0) {
                    categories.forEach(id => {
                        params.append('category_ids[]', id)
                    })
                    }

                    return params.toString()
                }

                const categoriesToUse = overrideCategories ?? selectedCategories
                console.log('selectedCategories:', categoriesToUse)

                const filterOptions = buildFilterOptions(categoriesToUse)
                console.log('filterOptions:', filterOptions)

                const response = await getArticles({ filterOptions }).unwrap()

                if (response?.data) {
                    setArticles(prevArticles => {
                    const newArticles = response.data.filter(
                        newArticle => !prevArticles.some(existing => existing.id === newArticle.id)
                    )
                    return [...prevArticles, ...newArticles]
                    })

                    const pagination = response.pagination_data
                    setHasMore(pagination.next_page_url)
                    setCurrentPage(pagination.current_page)
                }
                } catch (error) {
                console.error('Failed to fetch articles:', error)
                } finally {
                setLoading(false)
                setInitialLoad(false)
                }
            },
            [selectedCategories, currentPage, hasMore, loading, articles]
            )

        const handleCategoryChange = (id) => {
            let updatedList = []

            if (selectedCategories.includes(id)) {
                // Uncheck (remove it)
                updatedList = selectedCategories.filter(cat => cat !== id)
            } else {
                // Check (add it)
                updatedList = [...selectedCategories, id]
            }

            // Remove duplicates just in case
            updatedList = [...new Set(updatedList)]

            // Set and fetch
            setSelectedCategories(updatedList)
            fetchArticles(1, true, updatedList)
            }

    useEffect(() => {
        fetchArticles(1, true)
    }, [])


    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 900 &&
            hasMore &&
            !loading
        ) {
            fetchArticles(currentPage + 1)
        }
    }, [currentPage, hasMore, loading, fetchArticles])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }


    const needsTruncation = (text) => {
        if (!text) return false
        return text.length > 35
    }

    const getTruncatedText = (text) => {
        if (!text) return ''
        return text.length > 35 ? text.substring(0, 35) + '..' : text
    }


    const toggleExpanded = (articleId) => {
        const newExpanded = new Set(expandedArticles)
        if (newExpanded.has(articleId)) {
            newExpanded.delete(articleId)
        } else {
            newExpanded.add(articleId)
        }
        setExpandedArticles(newExpanded)
    }


    if (initialLoad && isLoading) {
        return (
            <Container fluid className='articles-container'>
                <div className='text-center py-5'>
                    <Spinner color='primary' size='lg' />
                    <h5 className='mt-3'>{t('Loading Articles...')}</h5>
                </div>
            </Container>
        )
    }


    if (error) {
        return (
            <Container fluid className='articles-container'>
                <Alert color='danger'>
                    <h4 className='alert-heading'>{t('Error')}</h4>
                    <p>{t('Failed to load articles. Please try again.')}</p>
                </Alert>
            </Container>
        )
    }

    return (
        <Container fluid className='articles-container'>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-end m-1 pt-25">
                <div className="d-flex flex-column">
                    <h3>{t("Articles management")}</h3>
                    <p className="mb-0">
                        {t(
                        "Here is a list of articles within Hospital Foundation, which you can manage simply through this page."
                        )}
                    </p>
                </div>
                <div className="d-flex align-items-center">
                    <Button
                        color='primary'
                        outline
                        onClick={() => setShowFilters(!showFilters)}
                        className='me-2'
                    >
                        <Filter size={16} className='me-1' />
                        {t('filters')}
                    </Button>
                </div>
            </div>

            <Row>
                {/* Filter Sidebar */}
                {showFilters && (
                    <Col lg={3} md={4} className='mb-4'>
                        <Card className='filter-card'>
                            <CardBody>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h5 className='mb-0'>{t('filters')}</h5>
                                    <Button
                                        color='link'
                                        size='sm'
                                        className='p-0'
                                        onClick={() => setShowFilters(false)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>

                                {/* Categories Filter */}
                                <div className='filter-section mb-4'>
                                    <h6 className='filter-title mb-3'>{t('Categories')}</h6>
                                    <div className='filter-options'>
                                        {categoriesLoading ? (
                                            <div className='text-center py-2'>
                                                <Spinner size='sm' />
                                            </div>
                                        ) : (
                                            categoriesData?.data?.map((category) => (
                                                <FormGroup key={category.id} check className='mb-2'>
                                                    <Input
                                                        type='checkbox'
                                                        id={`category-${category.id}`}
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                                    />
                                                    <Label check for={`category-${category.id}`} className='ms-1'>
                                                        {category.name}
                                                    </Label>
                                                </FormGroup>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Clear filters */}
                                {selectedCategories.length > 0 && (
                                    <Button
                                        color='secondary'
                                        outline
                                        size='sm'
                                        onClick={() => {
                                            setSelectedCategories([])
                                            if (filterTimeout) {
                                                clearTimeout(filterTimeout)
                                            }
                                            const newTimeout = setTimeout(() => {
                                                setCurrentPage(1)
                                                setHasMore(true)
                                                fetchArticles(1, true)
                                            }, 500)
                                            setFilterTimeout(newTimeout)
                                        }}
                                        className='w-100'
                                    >
                                        {t('Clear filters')}
                                    </Button>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                )}

                {/* Articles Grid */}
                <Col lg={showFilters ? 9 : 12} md={showFilters ? 8 : 12}>
                    {/* Pinterest-style Grid */}
                    <div className={`pinterest-grid ${showFilters ? 'with-filters' : ''}`}>
                {articles.map((article, index) => (
                    <div key={`${article.id}-${index}`} className='pinterest-item'>
                        <Card
                            className='article-card h-90'
                        >
                            {article.media && article.media.length > 0 && (
                                <div className='article-media-container'>
                                    <div className='media-carousel'>
                                        <div className='media-slide'>
                                            {(() => {
                                                const currentIndex = activeMediaIndex[article.id] || 0
                                                const currentMedia = article.media[currentIndex]
                                                return (
                                                    <img
                                                        src={currentMedia.url}
                                                        alt={currentMedia.title || article.title}
                                                        className='article-media'
                                                    />
                                                )
                                            })()}
                                        </div>
                                        {article.media.length > 1 && (
                                            <div className='carousel-pagination'>
                                                {article.media.map((_, dotIndex) => (
                                                    <button
                                                        key={dotIndex}
                                                        className={`pagination-dot ${(activeMediaIndex[article.id] || 0) === dotIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveMediaIndex(prev => ({ ...prev, [article.id]: dotIndex }))}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='media-overlay'>
                                        <div className='overlay-stats'>
                                            <div className='stat-item'>
                                                <Eye size={14} />
                                                <span>{article.views}</span>
                                            </div>
                                            <div className='stat-item'>
                                                <Heart size={14} />
                                                <span>{article.number_of_likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <CardBody className='article-content'>
                                {/* Article Title */}
                                <Link to={`/articles/profile/${article.title}`} state={article.id} className='article-title mb-1'>{article.title}</Link>

                                {/* Article Body with Read More */}
                                <div className='article-body mb-1'>
                                    <p className='mb-0'>
                                        {expandedArticles.has(article.id) ? (
                                            <>
                                                {article.body}
                                                {needsTruncation(article.body) && (
                                                    <>
                                                        {' '}
                                                        <button
                                                            className='read-more-btn'
                                                            onClick={() => toggleExpanded(article.id)}
                                                        >
                                                            {t('Show Less')}
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {getTruncatedText(article.body)}
                                                {needsTruncation(article.body) && (
                                                    <>
                                                        ...{' '}
                                                        <button
                                                            className='read-more-btn'
                                                            onClick={() => toggleExpanded(article.id)}
                                                        >
                                                            {t('Read More')}
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Article Stats */}
                                <div className='article-stats mb-1'>
                                    <div className='stats-container'>
                                        <div className='stat-item'>
                                            <div className='stat-icon'>
                                                <Eye size={16} className='text-muted' />
                                            </div>
                                            <div className='stat-value'>{article.views}</div>
                                        </div>

                                        <div className='stat-item'>
                                            <div className='stat-icon'>
                                                <Heart size={16} className='text-danger' />
                                            </div>
                                            <div className='stat-value'>{article.number_of_likes}</div>
                                        </div>

                                        <div className='stat-item'>
                                            <div className='stat-icon'>
                                                <MessageCircle size={16} className='text-primary' />
                                            </div>
                                            <div className='stat-value'>{article.number_of_comments}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Article Footer */}
                                <div className='article-footer'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='article-date'>
                                            <Calendar size={12} className='me-1 text-muted' />
                                            <small className='text-muted'>
                                                {formatDate(article.created_at)}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    ))}
                    </div>

                    {/* Loading More Indicator */}
                    {loading && !initialLoad && (
                        <div className='text-center py-4'>
                            <Spinner color='primary' />
                            <p className='mt-2 text-muted'>{t('Loading more articles...')}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {articles.length === 0 && !loading && (
                        <div className='text-center py-5'>
                            <User size={48} className='text-muted mb-3' />
                            <h5 className='text-muted'>{t('No Articles Available')}</h5>
                            <p className='text-muted'>{t('No articles have been published yet.')}</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default Articles