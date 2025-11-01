// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Roles Components
import ClinicsCard from "./card"
import useHeaders from "../../utility/hooks/useHeaders"
import EmptyComponent from "../components/empty"
import { useTranslation } from "react-i18next"
import LoadSpinner from "../../@core/components/spinner/loaders"
import { useListMutation } from "../../redux/rtkQuery/clinic"
import { Col, Row } from "reactstrap"
import FilterSidebar from "./list/FilterSidebar"

const Clinics = () => {
  const headers = useHeaders()
  const { t } = useTranslation()
  // ** State
  const [clinics, setClinics] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [filtersArr, setFiltersArr] = useState([])

  // ** Methods
  const [get, { isLoading }] = useListMutation()

  // ** States
  const [filters, setFilters] = useState({
    search: '',
    category_ids: [],
    sub_category_ids: [],
    city_ids: [],
    is_center: 0,
    phone_number: ''
  })
  const [loading, setLoading] = useState(false)

  // ** RTK Query Hook (uncomment when you have the clinics API)
  // const [getClinics, { isLoading }] = useListMutation()

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
      const response = await get({ filterOptions: queryString }).unwrap()
      setClinics(response.data || [])
      
  
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
      <div className="d-flex justify-content-between align-items-end m-1 pt-25">
        <div className="d-flex flex-column">
          <h3>{t("Clinics management")}</h3>
          <p className="mb-0">
            {t(
              "Here is a list of clinics within Hospital Foundation, which you can manage simply through this page."
            )}
          </p>
        </div>
      </div>
      <Row>
        <Col lg={3} md={4} sm={12}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </Col>
        <Col lg={9}>
          {isLoading ? (
            <LoadSpinner />
          ) : clinics.length === 0 ? (
            <EmptyComponent
              title={t("No Data")}
              body={t("Sorry, apparently there are no clinics added.")}
            />
          ) : (
            <>
              <ClinicsCard data={clinics} />
              <div
                style={{ height: "20px", background: "transparent" }}
              />
              {isFetching && <LoadSpinner />}
            </>
          )}
        </Col>
      </Row>
    </Fragment>
  )
}

export default Clinics
