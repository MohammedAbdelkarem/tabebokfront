// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Spinner, Alert } from 'reactstrap'

// ** Custom Components
import FilterSidebar from './FilterSidebar'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Redux (assuming you have a clinics slice)

// ** Styles
import './filter-sidebar.scss'

const ClinicsList = () => {
  const { t } = useTranslation()

  // ** States
  const [filters, setFilters] = useState({
    search: '',
    category_ids: [],
    sub_category_ids: [],
    city_ids: [],
    is_center: 0,
    phone_number: ''
  })
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(false)

  // ** RTK Query Hook (uncomment when you have the clinics API)

  // ** Build Filter Query String
  const buildFilterQuery = (filterData) => {
    const params = new URLSearchParams()
    
    if (filterData.search) {
      params.append('search', filterData.search)
    }
    
    if (filterData.phone_number) {
      params.append('phone_number', filterData.phone_number)
    }
    
    if (filterData.is_center) {
      params.append('is_center', filterData.is_center)
    }
    
    // Handle array parameters
    filterData.category_ids?.forEach(id => {
      params.append('category_ids[]', id)
    })
    
    filterData.sub_category_ids?.forEach(id => {
      params.append('sub_category_ids[]', id)
    })
    
    filterData.city_ids?.forEach(id => {
      params.append('city_ids[]', id)
    })
    
    return params.toString()
  }

  // ** Fetch Clinics
  const fetchClinics = async (filterData = filters) => {
    setLoading(true)
    try {
      const queryString = buildFilterQuery(filterData)
      console.log('Filter Query:', queryString)
      
      // ** Replace this with your actual API call
      // const response = await getClinics({ filterOptions: queryString }).unwrap()
      // setClinics(response.data || [])
      
      // ** Mock data for demonstration
      setTimeout(() => {
        setClinics([
          { id: 1, name: 'Sample Clinic 1', city: 'City 1' },
          { id: 2, name: 'Sample Clinic 2', city: 'City 2' }
        ])
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error fetching clinics:', error)
      setLoading(false)
    }
  }

  // ** Handle Filter Changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  // ** Handle Apply Filters
  const handleApplyFilters = (newFilters) => {
    fetchClinics(newFilters)
  }

  // ** Handle Clear Filters
  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category_ids: [],
      sub_category_ids: [],
      city_ids: [],
      is_center: 0,
      phone_number: ''
    }
    setFilters(clearedFilters)
    fetchClinics(clearedFilters)
  }

  // ** Initial Load
  useEffect(() => {
    fetchClinics()
  }, [])

  return (
    <Fragment>
      <Row>
        <Col lg={9} md={8} sm={12}>
          <Card>
            <CardBody>
              <h4 className='mb-4'>{t('Clinics List')}</h4>
              
              {loading ? (
                <div className='text-center py-5'>
                  <Spinner color='primary' size='lg' />
                  <p className='mt-3'>{t('Loading clinics...')}</p>
                </div>
              ) : clinics.length > 0 ? (
                <Row>
                  {clinics.map(clinic => (
                    <Col md={6} lg={4} key={clinic.id} className='mb-3'>
                      <Card className='h-100'>
                        <CardBody>
                          <h6>{clinic.name}</h6>
                          <p className='text-muted'>{clinic.city}</p>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert color='info' className='text-center'>
                  <h6>{t('No Clinics Found')}</h6>
                  <p className='mb-0'>{t('Try adjusting your filters to see more results.')}</p>
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ClinicsList
