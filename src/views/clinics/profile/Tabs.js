// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from 'reactstrap'

// ** Icons Imports
import {
  Bookmark, Edit2, File, Framer, Star,
  Clock, FileText, Award, Image,
  Calendar, MapPin, Users, BarChart2,
  Edit,
  Info
} from 'react-feather'
import { useTranslation } from 'react-i18next'

const Tabs = ({ activeTab, toggleTab }) => {
  const {t} = useTranslation()
  return (
    <Nav pills className='mb-2' style={{flexWrap: 'wrap'}}>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <Info size={18} className='me-50' />
          <span className='fw-bold'>{t('Overview')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
          <Calendar size={18} className='me-50' />
          <span className='fw-bold'>{t('Reservations')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
          <Star size={18} className='me-50' />
          <span className='fw-bold'>{t('Reviews & Ratings')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
          <FileText size={18} className='me-50' />
          <span className='fw-bold'>{t('Articles')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
          <BarChart2 size={18} className='me-50' />
          <span className='fw-bold'>{t('Analytics')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}>
          <Award size={18} className='me-50' />
          <span className='fw-bold'>{t('Licenses')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}>
          <Edit size={18} className='me-50' />
          <span className='fw-bold'>{t('Reports')}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '8'} onClick={() => toggleTab('8')}>
          <Clock size={18} className='me-50' />
          <span className='fw-bold'>{t('Shifts')}</span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
