// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'

// ** RTK Imports
import { authSlice } from './rtkQuery/auth'
import { aboutSlice } from './rtkQuery/statics-pages/about'
import { contactSlice } from './rtkQuery/statics-pages/contact'
import { tosSlice } from './rtkQuery/statics-pages/tos'
import { privacySlice } from './rtkQuery/statics-pages/privacy'
import { faqCategorySlice } from './rtkQuery/statics-pages/category'
import { faqSlice } from './rtkQuery/statics-pages/faq'
import { mediaSlice } from './rtkQuery/media'
import { storySlice } from './rtkQuery/content/story'
import { bannerSlice } from './rtkQuery/content/banner'
import { logSlice } from './rtkQuery/user/logs'
import { userSlice } from './rtkQuery/user/users'
import { settingsSlice } from './rtkQuery/settings'
import { adminSlice } from './rtkQuery/admin'
import { storeSlice } from './rtkQuery/stores'
import { productSlice } from './rtkQuery/product'
import { reportSlice } from './rtkQuery/report'
import { planSlice } from './rtkQuery/plan'
import { addonsSlice } from './rtkQuery/addons'
import { transactionSlice } from './rtkQuery/transaction'
import { notificationSlice } from './rtkQuery/notification'
import { clinicSlice } from './rtkQuery/clinic'
import { patientSlice } from './rtkQuery/patient'
import { categorySlice } from './rtkQuery/content/category'
import { subCategorySlice } from './rtkQuery/content/subCategory'
import { serviceSlice } from './rtkQuery/service'
import { reservationSlice } from './rtkQuery/reservation'
import { articleSlice } from './rtkQuery/articles'

const rootReducer = {
  [authSlice.reducerPath]:authSlice.reducer,
  [aboutSlice.reducerPath]:aboutSlice.reducer,
  [contactSlice.reducerPath]:contactSlice.reducer,
  [tosSlice.reducerPath]:tosSlice.reducer,
  [privacySlice.reducerPath]:privacySlice.reducer,
  [faqSlice.reducerPath]:faqSlice.reducer,
  [faqCategorySlice.reducerPath]:faqCategorySlice.reducer,
  [mediaSlice.reducerPath]:mediaSlice.reducer,
  [storySlice.reducerPath]:storySlice.reducer,
  [bannerSlice.reducerPath]:bannerSlice.reducer,
  [logSlice.reducerPath]:logSlice.reducer,
  [userSlice.reducerPath]:userSlice.reducer,
  [settingsSlice.reducerPath]:settingsSlice.reducer,
  [adminSlice.reducerPath]:adminSlice.reducer,
  [storeSlice.reducerPath]:storeSlice.reducer,
  [productSlice.reducerPath]:productSlice.reducer,
  [reportSlice.reducerPath]:reportSlice.reducer,
  [planSlice.reducerPath]:planSlice.reducer,
  [addonsSlice.reducerPath]:addonsSlice.reducer,
  [transactionSlice.reducerPath]:transactionSlice.reducer,
  [notificationSlice.reducerPath]:notificationSlice.reducer,
  [clinicSlice.reducerPath]:clinicSlice.reducer,
  [patientSlice.reducerPath]:patientSlice.reducer,
  [categorySlice.reducerPath]:categorySlice.reducer,
  [subCategorySlice.reducerPath]:subCategorySlice.reducer,
  [serviceSlice.reducerPath]:serviceSlice.reducer,
  [reservationSlice.reducerPath]:reservationSlice.reducer,
  [articleSlice.reducerPath]:articleSlice.reducer,
  auth,
  navbar,
  layout
}

export default rootReducer