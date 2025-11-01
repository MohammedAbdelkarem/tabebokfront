import {
  Card,
  CardBody,
  Badge,
  ListGroup,
  ListGroupItem,
  CardFooter
} from 'reactstrap'
import EmptyComponent from '../components/empty'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Plans = ({ data }) => {
  const { t } = useTranslation()

  return (
    <div className="pricing-scroll-container">
      {data?.length > 0 ? (
        data.map((item, index) => (
          <div className="pricing-card-wrapper" key={index}>
            <Card
              style={{
                width: '100%',
                boxShadow: '0 8px 10px rgb(0, 0, 0, 0.2)',
                borderRadius: '5px',
                borderTop: '7px solid #06deda',
                borderBottom: '7px solid #06deda',
                textAlign: 'center'
              }}
            >
              <CardBody>
                {item.popular === true && (
                  <div className="pricing-badge text-end">
                    <Badge color="light-primary" pill>
                      شائع
                    </Badge>
                  </div>
                )}
                <div className="apply-job-package bg-light-primary rounded">
                  <h1>{item.title}</h1>
                </div>

                {/* No description in new data - remove or add fallback */}
                {/* <CardText dangerouslySetInnerHTML={{ __html: item.description || '' }} /> */}

                <div className="annual-plan">
                  <div className="plan-price mt-2">
                    {item.price === 0 ? (
                      <Badge color="light-warning">مجاناً</Badge>
                    ) : (
                      <>
                        <sup className="font-medium-1 fw-bold text-primary me-25">SYP</sup>
                        <span className="fw-bolder text-primary">
                          {item.price_after_discount > 0 ? item.price_after_discount : item.price}
                        </span>
                      </>
                    )}
                  </div>

                  {item.discount_percentage > 0 ? (
                    <small className="text-muted">خصم {item.discount_percentage}%</small>
                  ) : null}
                </div>

                <ListGroup tag="ul" className="list-group-circle text-start">
                  <ListGroupItem tag="li">
                    مدة الاشتراك: {item.number_of_days === -1 ? 'غير محدودة' : `${item.number_of_days} يوم`}
                  </ListGroupItem>
                  {/* No subscriptions_count in new data, remove or add if available */}
                  {/* <ListGroupItem tag="li">عدد المشتركين: {item.subscriptions_count}</ListGroupItem> */}
                </ListGroup>
              </CardBody>

              <Link className={'m-1'} to={`/plan-subscriptions/${item.title}`} state={{ id: item.id }}>
                {t('Preview subscriptions')}
              </Link>

              <CardFooter>
                {/* No updated_at field in new data, you can remove or add if available */}
                {/* <small className="text-muted">Last updated {item.updated_at?.slice(0, 10)}</small> */}
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <EmptyComponent title={'لا يوجد خطط'} body={'لا يوجد خطط'} />
      )}
    </div>
  )
}

export default Plans
