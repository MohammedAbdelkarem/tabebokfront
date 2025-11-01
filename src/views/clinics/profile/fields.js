import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Badge, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Row, Table } from "reactstrap"

const CustomFields = ({data}) => {
  const {t} = useTranslation()
  return (
    <Fragment>
        <CardBody>
        <CardTitle tag='h5' className='fw-bold mb-2' style={{ color: '#000', fontSize: '19px' }}>
            {t('Custom fields details')}
        </CardTitle>
            <Row className='match-height'>
                {data?.map((item, idx) => {
                    const { value, field } = item
                    const {
                    type_trans,
                    name,
                    is_required,
                    type
                    } = field
                    const displayValue = type === 'multiselect' ? JSON.parse(value).join(', ') : value
                    return (
                        <Col sm="12" md="4" lg="3" key={idx}>
                            <Card
                                className="mb-3"
                                style={{
                                width: "100%",
                                boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)",
                                borderRadius: "5px",
                                padding: "5px",
                                borderRight: "10px solid #1fa2ff",
                                direction: "rtl" // Ensure RTL layout
                                }}
                            >
                                <CardBody>
                                {/* Title and Badge aligned horizontally */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <CardTitle tag="h4" style={{ margin: 0, marginBottom: "15px" }}>{name}</CardTitle>
                                    {!is_required ? (
                                    <Badge color="light-warning">{t('غير مطلوب')}</Badge>
                                    ) : (
                                    <Badge color="light-primary">{t('مطلوب')}</Badge>
                                    )}
                                </div>

                                <CardSubtitle className="text-muted mb-1">{type_trans}</CardSubtitle>

                                <CardText><strong>القيمة:</strong> {displayValue || '-'}</CardText>
                                </CardBody>
                            </Card>
                            </Col>

                        )
                    })}
            </Row>
        </CardBody>
    </Fragment>
  )
}

export default CustomFields