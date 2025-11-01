// ** Navigation imports
import articles from './articles'
import clinics from './clinics'
import content from './content'
import dashboards from './dashboards'
import plan from './plan'
import reservation from './reservation'
import service from './service'
import statics from './statics'
import users from './users'

// ** Merge & Export
export default [...dashboards, ...statics, ...content, ...users, ...clinics, ...articles,  ...reservation, ...plan, ...service]
