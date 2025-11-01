import React, { useEffect } from 'react'
import {
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
  CardFooter,
  CardLink
} from 'reactstrap'
import { useListMutation } from '../../redux/rtkQuery/addons'
import LoadSpinner from '../../@core/components/spinner/loaders'
import EmptyComponent from "../components/empty"
import './plan.css'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
const Addons = ({data}) => {
  const {t} = useTranslation()

  return (
    <div className="pricing-scroll-container">
      {data?.length > 0 ? data?.map((item, index) => (
        <div className="pricing-card-wrapper" key={index}>
          <Card
           style = {{ width: "100%", 
                      boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)", 
                      borderRadius: "5px", 
                      borderTop: "7px solid #06deda",
                      borderBottom: "7px solid #06deda",
                      textAlign:'center'}}>
            <CardBody>
              {item.popular === true && (
                <div className="pricing-badge text-end">
                  <Badge color="light-primary" pill>
                    شائع
                  </Badge>
                </div>
              )}
                <div className='apply-job-package bg-light-primary rounded'>
                    <h1>{item?.name}</h1>
                </div>
              <div className="annual-plan">
                <div className="plan-price mt-2">
                  {item.price === 0 ? (
                    <Badge color='light-warning'>مجاناً</Badge>
                  ) : (
                    <>
                      <sup className="font-medium-1 fw-bold text-primary me-25">ل.س</sup> /
                      <span className="fw-bolder text-primary">
                        {item.discount_price_syp > 0 ? item.discount_price_syp?.toLocaleString() : item.price_syp?.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                {item.has_discount && item.discount ? (
                  <Badge className={'mt-2'} color='light-warning'>خصم {item.discount}%</Badge>
                ) : null}
              </div>
              <ListGroup tag="ul" className="list-group-circle text-start">
                <ListGroupItem tag="li">مدة الاشتراك: {item.duration === -1 ? 'غير محدودة' : `${item.duration} يوم`}</ListGroupItem>
                <ListGroupItem tag="li">عدد المشتركين: {item.subscriptions_count}</ListGroupItem>
              </ListGroup>
            </CardBody>
            <Link className={'m-1'} to={`/addon-subscriptions/${item.name}`} state={{id:item?.id}}>
                {t('Previrew subscriptions')}
            </Link>
            <CardFooter>
                <small className='text-muted'>Last updated {item.updated_at?.slice(0, 10)}</small>
            </CardFooter>
          </Card>
        </div>
      )) : <EmptyComponent title={'لا يوجد خطط'} body={'لا يوجد خطط'}/>}
    </div>
  )
}

export default Addons