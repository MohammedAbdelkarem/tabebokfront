// ** Navigation imports
import articles from '../horizontal/articles'
import clinics from '../horizontal/clinics'
import content from '../horizontal/content'
import dashboards from '../horizontal/dashboards'
import plan from '../horizontal/plan'
import reservation from '../horizontal/reservation'
import service from '../horizontal/service'
import statics from '../horizontal/statics'
import users from '../horizontal/users'

// ** Merge & Export
export default [...dashboards, ...statics, ...content, ...users, ...clinics, ...articles, ...reservation, ...plan, ...service]
