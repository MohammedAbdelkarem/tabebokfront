// ** React Imports
import { useContext, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import Earnings from './ui-elements/cards/analytics/Earnings'
import CardMedal from './ui-elements/cards/advance/CardMedal'
import CardMeetup from './ui-elements/cards/advance/CardMeetup'
import StatsCard from './ui-elements/cards/statistics/StatsCard'
import GoalOverview from './ui-elements/cards/analytics/GoalOverview'
import RevenueReport from './ui-elements/cards/analytics/RevenueReport'
import OrdersBarChart from './ui-elements/cards/statistics/OrdersBarChart'
import CardTransactions from './ui-elements/cards/advance/CardTransactions'
import ProfitLineChart from './ui-elements/cards/statistics/ProfitLineChart'
import CardBrowserStates from './ui-elements/cards/advance/CardBrowserState'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import { useOverviewMutation } from '../../redux/rtkQuery/admin'
import useHeaders from '@hooks/useHeaders'
const EcommerceDashboard = () => {
  const headers = useHeaders()
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** vars
  const trackBgColor = '#e9ecef'
  const [overview, { data, isLoading, isError }] = useOverviewMutation()

  useEffect(() => {
    overview({headers})
  }, [])


  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='4' md='6' xs='12'>
          <Earnings success={colors.success.main} />
        </Col>
        <Col xl='8' md='6' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='4' md='6' xs='12'>
          <CardMeetup />
        </Col>
        <Col lg='4' md='6' xs='12'>
          <CardBrowserStates colors={colors} trackBgColor={trackBgColor} />
        </Col>
        <Col lg='4' md='6' xs='12'>
          <CardTransactions />
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
