import { useTranslation } from "react-i18next"
import {
  Badge,
  Card,
  CardBody,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
  Modal,
  ModalBody,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap"
import { Fragment, useEffect, useMemo, useState } from "react"
import { Paperclip, Tool } from "react-feather"
import LoadSpinner from "../../@core/components/spinner/loaders"
import DescriptionCell from "../components/descriptionCell"
import { useActionMutation, useFiltersMutation, useReportsMutation } from "../../redux/rtkQuery/report"
import EmptyComponent from "../components/empty"

const ReportsManagement = () => {
  const [getReports, { data, isLoading }] = useReportsMutation()
  const reports = data?.data || []
  const [getFilters, { data:filterData, isLoading:filtering}] = useFiltersMutation()
  const filters = filterData?.data.map(filter => ({ value: filter }))
    const [active, setActive] = useState(null)
    const toggle = tab => {
        if (active !== tab) {
        setActive(tab)
        }
    }
    useEffect(() => {
        getFilters()
    }, [])
    useEffect(() => {
        if (filters?.length > 0  && !active) {
            setActive(filters[0]?.value)
        }
    }, [filters])
  const [processingId, setProcessingId] = useState(null)

  const [action, { isLoading:processing, status }] = useActionMutation()
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isProcessedFilter, setIsProcessedFilter] = useState(1)
useEffect(() => {
  if (active) {
    const query = `page=1&perPage=100&filter=${active}`

    let isProcessedQuery = ''
    
    if (isProcessedFilter === 1) isProcessedQuery = '&is_processed=1'
    if (isProcessedFilter === 2) isProcessedQuery = '&is_processed=2'
    if (isProcessedFilter === 3) isProcessedQuery = '&is_processed=3'

    getReports({ filterOptions: query + isProcessedQuery })
  }
}, [active, isProcessedFilter])


  useEffect(() => {
    if (active) {
        getReports({ filterOptions: `page=1&perPage=100&filter=${active}` })
    }
    }, [active])

  const handleAction = async (reportId) => {
    setProcessingId(reportId)
    try {
        await action({ id: reportId })
    } finally {
        setProcessingId(null)
    }
    }

  useMemo(() => {
    if (status === 'fulfilled') {
        getReports()
    }
  }, [status])

  const handleImageClick = (url) => {
    setSelectedImage(url)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }
  console.log('active', active)
  

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <h3 className="mb-0">{t('Reports Management')}</h3>

        <UncontrolledButtonDropdown>
            <DropdownToggle color='flat-primary' caret>
            {t(
                isProcessedFilter === 1 ? 'All' : isProcessedFilter === 2 ? 'Processed' : 'Unprocessed'
            )}
            </DropdownToggle>
            <DropdownMenu end>
            {[
                { key: 1, label: t('All') },
                { key: 2, label: t('Processed') },
                { key: 3, label: t('Unprocessed') }
            ].map((field) => (
                <DropdownItem
                key={field.key}
                onClick={() => setIsProcessedFilter(field.key)}
                active={isProcessedFilter === field.key}
                >
                {field.label}
                </DropdownItem>
            ))}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
        </div>

        <Nav className='justify-content-center' tabs>
            {
                filters?.map((item) => (
                    <NavItem>
                        <NavLink
                            active={active === item.value}
                            onClick={() => {
                            toggle(item.value)
                            }}
                        >
                            {item.value}
                        </NavLink>
                    </NavItem>
                ))
            }
      </Nav>
      <Row className='match-height'>
        {isLoading || filtering ? (
          <LoadSpinner />
        ) : (
            reports.length === 0 ? <EmptyComponent title={t('No Data')} body={t('No reports added yet..')}/>  : reports.map((item) => (
            <Col md={4} key={item.id}>
              <Card
                className='mb-4'
                style={{
                  width: "100%",
                  boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)",
                  borderRadius: "5px",
                  padding: "5px",
                  borderRight: item.is_processed ? "10px solid #1fa2ff" : "10px solid #ff748e"
                }}
              >
                <CardBody>
                  <CardTitle tag='h4' className="d-flex justify-content-between align-items-center">
                    <Badge color={'light-warning'}>{item.report_type_name}</Badge>
                    <small className="text-muted">
                      {item.report_at ? new Date(item.report_at).toLocaleDateString() : ''}
                    </small>
                  </CardTitle>
                  <CardSubtitle className='text-muted mb-1'>{item.reported_name}</CardSubtitle>
                  <CardText>
                    <DescriptionCell number={35} row={item} text={item?.description} />
                  </CardText>{item?.media_url && (
                    <CardLink
                        href="#"
                        onClick={(e) => {
                        e.preventDefault()
                        handleImageClick(item.media_url)
                        }}
                        className="d-inline-flex align-items-center me-2"
                    >
                        <Paperclip size={15} className="me-50" />
                        {t('View Attachment')}
                    </CardLink>
                    )}
                    <CardLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            handleAction(item.id)
                        }}
                        className="d-inline-flex align-items-center text-secondary">
                        {
                            item.id === processingId && processing ? <Spinner size="sm" /> : <>
                            <Tool size={15} className="me-50" />
                            {!item?.is_processed ? t('Processed') : t('UnProcessed')}
                            </>
                        }
                    </CardLink>

                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Image Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} size="lg" >
        <div className="text-center">
            <h2 style={{
                    display: "inline-block",
                    borderRadius: "5px",
                    padding: "20px 20px",
                    color: "#000",
                    marginTop:'30px',
                    borderRight: "10px solid #1fa2ff",
                    borderLeft: "10px solid #1fa2ff"}}>
                {t('Report Attachment')}
            </h2>
        </div>
        <ModalBody className="text-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Attachment"
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ReportsManagement
