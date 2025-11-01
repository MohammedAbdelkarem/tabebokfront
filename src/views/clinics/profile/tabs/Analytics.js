// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js'

// ** Reactstrap Imports
import { 
  Card, CardBody, CardTitle, Row, Col, 
  Spinner, Alert, Badge
} from 'reactstrap'

// ** Icons
import { BarChart2, TrendingUp, Users, CheckCircle, XCircle } from 'react-feather'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Redux
import { useAnalysisMutation } from '@src/redux/rtkQuery/reservation'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

const Analytics = ({ doctorId }) => {
  const { t } = useTranslation()

  // ** States
  const [analyticsData, setAnalyticsData] = useState(null)

  // ** RTK Query Hook
  const [getAnalysis, { isLoading }] = useAnalysisMutation()

  // ** Fetch Analytics Data
  useEffect(() => {
    if (doctorId) {
      fetchAnalytics()
    }
  }, [doctorId])

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalysis({ id: doctorId }).unwrap()
      if (response.status_code === 200) {
        setAnalyticsData(response.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  // ** Chart Configuration
  const chartData = analyticsData ? {
    labels: [t('Accepted Reservations'), t('Rejected Reservations')],
    datasets: [
      {
        data: [analyticsData.accepted_reservations, analyticsData.rejected_reservations],
        backgroundColor: [
          '#1fa2ff', // Primary color for accepted
          '#f8d7da'  // Light red for rejected
        ],
        borderColor: [
          '#1fa2ff',
          '#dc3545'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#3a6d70',
          '#f5c6cb'
        ],
        hoverBorderColor: [
          '#2f5a5d',
          '#721c24'
        ],
        cutout: '60%'
      }
    ]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const percentage = analyticsData ? 
              (context.dataIndex === 0 ? analyticsData.accepted_percentage : analyticsData.rejected_percentage) : 0
            return `${label}: ${value} (${percentage.toFixed(1)}%)`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1fa2ff',
        borderWidth: 1
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    }
  }

  // ** Statistics Cards Data
  const statsCards = analyticsData ? [
    {
      title: t('Total Reservations'),
      value: analyticsData.total_reservations,
      icon: Users,
      color: 'primary',
      bgColor: 'light-primary'
    },
    {
      title: t('Accepted'),
      value: analyticsData.accepted_reservations,
      percentage: analyticsData.accepted_percentage,
      icon: CheckCircle,
      color: 'success',
      bgColor: 'light-success'
    },
    {
      title: t('Rejected'),
      value: analyticsData.rejected_reservations,
      percentage: analyticsData.rejected_percentage,
      icon: XCircle,
      color: 'danger',
      bgColor: 'light-danger'
    }
  ] : []

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h4' className='mb-4'>
                <BarChart2 size={20} className='me-2 text-primary' />
                {t('Reservations Analytics')}
              </CardTitle>

              {isLoading ? (
                <div className='text-center py-5'>
                  <Spinner color='primary' size='lg' />
                  <p className='mt-3'>{t('Loading analytics...')}</p>
                </div>
              ) : !analyticsData ? (
                <Alert color='info' className='text-center'>
                  <BarChart2 size={24} className='mb-2' />
                  <h6>{t('No Analytics Data')}</h6>
                  <p className='mb-0'>{t('No analytics data available for this doctor.')}</p>
                </Alert>
              ) : (
                <Fragment>
                  {/* Statistics Cards */}
                  <Row className='mb-4'>
                    {statsCards.map((stat, index) => (
                      <Col md={4} key={index}>
                        <Card className={`bg-${stat.bgColor} border-0`}>
                          <CardBody className='text-center'>
                            <div className={`avatar avatar-lg bg-${stat.color} rounded-circle mx-auto mb-3`}>
                              <stat.icon size={24} className='text-white' />
                            </div>
                            <h3 className={`text-${stat.color} fw-bold mb-1`}>
                              {stat.value}
                            </h3>
                            <p className='mb-0 text-muted'>
                              {stat.title}
                            </p>
                            {stat.percentage && (
                              <Badge color={stat.color} className='mt-2'>
                                {stat.percentage.toFixed(1)}%
                              </Badge>
                            )}
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Chart Section */}
                  <Row>
                    <Col lg={8} md={12}>
                      <Card>
                        <CardBody>
                          <CardTitle tag='h5' className='mb-4'>
                            <TrendingUp size={18} className='me-2 text-primary' />
                            {t('Reservations Distribution')}
                          </CardTitle>
                          <div style={{ height: '400px', position: 'relative' }}>
                            {chartData && (
                              <Doughnut 
                                data={chartData} 
                                options={chartOptions}
                              />
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    
                    <Col lg={4} md={12}>
                      <Card className='h-100'>
                        <CardBody>
                          <CardTitle tag='h5' className='mb-4'>
                            {t('Summary')}
                          </CardTitle>
                          
                          <div className='mb-4'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                              <span className='fw-bold'>{t('Acceptance Rate')}</span>
                              <Badge color='success' pill>
                                {analyticsData.accepted_percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className='progress' style={{ height: '8px' }}>
                              <div 
                                className='progress-bar bg-success' 
                                style={{ width: `${analyticsData.accepted_percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className='mb-4'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                              <span className='fw-bold'>{t('Rejection Rate')}</span>
                              <Badge color='danger' pill>
                                {analyticsData.rejected_percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className='progress' style={{ height: '8px' }}>
                              <div 
                                className='progress-bar bg-danger' 
                                style={{ width: `${analyticsData.rejected_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Fragment>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Analytics
