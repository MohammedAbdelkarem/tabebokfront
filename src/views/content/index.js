// ** React Imports
import { Fragment, useRef, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Demo Components
import Wizard from '@components/wizard'

// ** Custom Components
import BreadCrumbs from '@components/breadcrumbs'
import { GitPullRequest, Image, Trello } from 'react-feather'
import StoryManagement from './components/story'
import BannerManagement from './components/banner'
import CategoryManagement from './components/category'
import { useTranslation } from 'react-i18next'

const ContentPages = () => {
  // ** Ref
  const {t} = useTranslation()
  const ref = useRef(null)
  // ** State

  const steps = [
    {
      id: 'story',
      title: t('Story management'),
      icon: <Image size={18} />,
      content: <StoryManagement type='modern-vertical' />
    },
    {
      id: 'banner',
      title: t('Banner management'),
      icon: <Trello size={18} />,
      content: <BannerManagement type='modern-vertical' />
    },
    {
      id: 'category',
      title: t('Category management'),
      icon: <GitPullRequest size={18} />,
      content: <CategoryManagement type='modern-vertical' />
    }
  ]
  return (
    <Fragment>        
      <BreadCrumbs title='Managing content' data={[{ title: 'Managing content' }]} />
      <Row>
        <Col sm='12'>
            <div className='modern-vertical-wizard'>
                <Wizard
                    type='modern-vertical'
                    ref={ref}
                    steps={steps}
                    options={{ linear: false }}
                />
            </div>
        </Col>
      </Row>
    </Fragment>
  )
}
export default ContentPages
