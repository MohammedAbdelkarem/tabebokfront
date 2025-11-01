// ** React Imports
import { Fragment, useState, useEffect, useCallback } from 'react'

// ** Reactstrap Imports
import { 
  Card, CardBody, CardTitle, Row, Col, 
  Input, Label, FormGroup, Button, Collapse,
  Badge, Spinner
} from 'reactstrap'

// ** Third Party Components
import Select from 'react-select'
import { selectThemeColors } from '@utils'

// ** Icons
import { Search, Filter, X, ChevronDown, ChevronUp, MapPin } from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Redux
import { useGetQuery } from '@src/redux/rtkQuery/content/category'
import { useGetMutation } from '@src/redux/rtkQuery/content/subCategory'
import { useCitiesQuery } from '@src/redux/rtkQuery/admin'

const FilterSidebar = ({ filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
  const { t } = useTranslation()

  // ** States
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [selectedCategory, setSelectedCategory] = useState(filters.category_ids?.[0] || '')
  const [selectedSubCategories, setSelectedSubCategories] = useState(filters.sub_category_ids || [])
  const [selectedCities, setSelectedCities] = useState(filters.city_ids || [])
  const [isCenter, setIsCenter] = useState(filters.is_center || false)
  const [phoneNumber, setPhoneNumber] = useState(filters.phone_number || '')

  // ** Collapse States
  const [categoryCollapse, setCategoryCollapse] = useState(true)
  const [subCategoryCollapse, setSubCategoryCollapse] = useState(true)
  const [locationCollapse, setLocationCollapse] = useState(true)

  // ** Debounce Timer
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)

  // ** RTK Query Hooks
  const { data: categoriesData, isLoading: loadingCategories } = useGetQuery({})
  const [getSubCategories, { data: subCategoriesData, isLoading: loadingSubCategories }] = useGetMutation()
  const { data: citiesData, isLoading: loadingCities } = useCitiesQuery()

  // ** Data Processing
  const categories = categoriesData?.data || []
  const subCategories = subCategoriesData?.data || []
  const cities = citiesData?.data?.map(city => ({
    value: city.id,
    label: city.name
  })) || []

  // ** Debounced Filter Application
  const debouncedApplyFilters = useCallback((newFilters) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Show loading state
    setIsApplyingFilters(true)

    // Set new timer
    const timer = setTimeout(() => {
      onFiltersChange(newFilters)
      onApplyFilters(newFilters)
      setIsApplyingFilters(false)
    }, 2000) // 2 seconds delay

    setDebounceTimer(timer)
  }, [debounceTimer, onFiltersChange, onApplyFilters])

  // ** Auto-trigger filters when any filter changes
  useEffect(() => {
    const newFilters = {
      search: searchTerm,
      category_ids: selectedCategory ? [selectedCategory] : [],
      sub_category_ids: selectedSubCategories,
      city_ids: selectedCities,
      is_center: isCenter ? 1 : 0,
      phone_number: phoneNumber
    }

    debouncedApplyFilters(newFilters)

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [searchTerm, selectedCategory, selectedSubCategories, selectedCities, isCenter, phoneNumber])

  // ** Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      getSubCategories({ id: selectedCategory })
      setSubCategoryCollapse(true)
    } else {
      setSelectedSubCategories([])
      setSubCategoryCollapse(false)
    }
  }, [selectedCategory])

  // ** Handle Category Change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategories([]) // Clear subcategories when category changes
  }

  // ** Handle SubCategory Change
  const handleSubCategoryChange = (subCategoryId, checked) => {
    if (checked) {
      setSelectedSubCategories(prev => [...prev, subCategoryId])
    } else {
      setSelectedSubCategories(prev => prev.filter(id => id !== subCategoryId))
    }
  }

  // ** Handle Cities Change
  const handleCitiesChange = (selectedOptions) => {
    const cityIds = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedCities(cityIds)
  }

  // ** Clear All Filters
  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedSubCategories([])
    setSelectedCities([])
    setIsCenter(false)
    setPhoneNumber('')
    
    const clearedFilters = {
      search: '',
      category_ids: [],
      sub_category_ids: [],
      city_ids: [],
      is_center: 0,
      phone_number: ''
    }
    
    onFiltersChange(clearedFilters)
    onClearFilters()
  }

  // ** Count Active Filters
  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategory) count++
    if (selectedSubCategories.length > 0) count++
    if (selectedCities.length > 0) count++
    if (isCenter) count++
    if (phoneNumber) count++
    return count
  }

  return (
    <Card className='filter-sidebar'>
      <CardBody>
        <CardTitle tag='h5' className='mb-3 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <Filter size={18} className='me-2 text-primary' />
            {t('Filters')}
          </div>
          {getActiveFiltersCount() > 0 && (
            <Badge color='primary' pill>
              {getActiveFiltersCount()}
            </Badge>
          )}
        </CardTitle>

        {/* Search Input */}
        <FormGroup className='mb-3'>
          <Label className='form-label fw-bold'>{t('Search')}</Label>
          <div className='position-relative'>
            <Input
              type='text'
              placeholder={t('Search clinics...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='ps-5'
            />
            <Search size={16} className='position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
          </div>
        </FormGroup>

        {/* Phone Number */}
        <FormGroup className='mb-3'>
          <Label className='form-label fw-bold'>{t('Phone Number')}</Label>
          <Input
            type='text'
            placeholder={t('Enter phone number...')}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </FormGroup>

        {/* Is Center Checkbox */}
        <FormGroup className='mb-3'>
          <div className='form-check'>
            <Input
              type='checkbox'
              id='is-center'
              checked={isCenter}
              onChange={(e) => setIsCenter(e.target.checked)}
            />
            <Label check for='is-center' className='fw-bold'>
              {t('Medical Centers Only')}
            </Label>
          </div>
        </FormGroup>

        {/* Categories Section */}
        <div className='mb-3'>
          <div 
            className='d-flex align-items-center justify-content-between cursor-pointer p-2 bg-light rounded'
            onClick={() => setCategoryCollapse(!categoryCollapse)}
          >
            <Label className='form-label fw-bold mb-0'>{t('Categories')}</Label>
            {categoryCollapse ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          <Collapse isOpen={categoryCollapse}>
            <div className='mt-2'>
              {loadingCategories ? (
                <div className='text-center py-2'>
                  <Spinner size='sm' color='primary' />
                </div>
              ) : (
                <FormGroup>
                  {/* All Categories Option */}
                  <div className='form-check mb-2'>
                    <Input
                      type='radio'
                      name='category'
                      id='category-all'
                      checked={!selectedCategory}
                      onChange={() => handleCategoryChange('')}
                    />
                    <Label check for='category-all'>
                      {t('All Categories')}
                    </Label>
                  </div>
                  
                  {/* Category Options */}
                  {categories.map(category => (
                    <div key={category.id} className='form-check mb-2'>
                      <Input
                        type='radio'
                        name='category'
                        id={`category-${category.id}`}
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      <Label check for={`category-${category.id}`}>
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </FormGroup>
              )}
            </div>
          </Collapse>
        </div>

        {/* SubCategories Section */}
        {selectedCategory && (
          <div className='mb-3'>
            <div 
              className='d-flex align-items-center justify-content-between cursor-pointer p-2 bg-light rounded'
              onClick={() => setSubCategoryCollapse(!subCategoryCollapse)}
            >
              <Label className='form-label fw-bold mb-0'>{t('Subcategories')}</Label>
              {subCategoryCollapse ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            <Collapse isOpen={subCategoryCollapse}>
              <div className='mt-2'>
                {loadingSubCategories ? (
                  <div className='text-center py-2'>
                    <Spinner size='sm' color='primary' />
                  </div>
                ) : subCategories.length > 0 ? (
                  <FormGroup>
                    {subCategories.map(subCategory => (
                      <div key={subCategory.id} className='form-check mb-2'>
                        <Input
                          type='checkbox'
                          id={`subcategory-${subCategory.id}`}
                          checked={selectedSubCategories.includes(subCategory.id)}
                          onChange={(e) => handleSubCategoryChange(subCategory.id, e.target.checked)}
                        />
                        <Label check for={`subcategory-${subCategory.id}`}>
                          {subCategory.name}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                ) : (
                  <p className='text-muted small'>{t('No subcategories available')}</p>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {/* Cities Section */}
        <div className='mb-4'>
          <div 
            className='d-flex align-items-center justify-content-between cursor-pointer p-2 bg-light rounded'
            onClick={() => setLocationCollapse(!locationCollapse)}
          >
            <Label className='form-label fw-bold mb-0'>
              {t('Cities')}
            </Label>
            {locationCollapse ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          <Collapse isOpen={locationCollapse}>
            <div className='mt-2'>
              {loadingCities ? (
                <div className='text-center py-2'>
                  <Spinner size='sm' color='primary' />
                </div>
              ) : (
                <Select
                  isMulti
                  options={cities}
                  value={cities.filter(city => selectedCities.includes(city.value))}
                  onChange={handleCitiesChange}
                  placeholder={t('Select cities...')}
                  className='react-select'
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  isClearable
                />
              )}
            </div>
          </Collapse>
        </div>

        {/* Action Buttons */}
        <Row>
          <Col xs={12}>
            <Button
              color='secondary'
              outline
              block
              onClick={handleClearFilters}
              className='btn-sm'
            >
              <X size={14} className='me-1' />
              {t('Clear All Filters')}
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default FilterSidebar
