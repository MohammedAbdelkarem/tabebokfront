// ** Redux Imports
import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './rtkQuery/auth'
import { aboutSlice } from './rtkQuery/statics-pages/about'
import { contactSlice } from './rtkQuery/statics-pages/contact'
import { privacySlice } from './rtkQuery/statics-pages/privacy'
import { tosSlice } from './rtkQuery/statics-pages/tos'
import { faqSlice } from './rtkQuery/statics-pages/faq'
import { faqCategorySlice } from './rtkQuery/statics-pages/category'
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

const store = configureStore({
  reducer: rootReducer,
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(
        authSlice.middleware,
        adminSlice.middleware,
        aboutSlice.middleware,
        contactSlice.middleware,
        tosSlice.middleware,
        privacySlice.middleware,
        faqSlice.middleware,
        faqCategorySlice.middleware,
        mediaSlice.middleware,
        storySlice.middleware,
        bannerSlice.middleware,
        logSlice.middleware,
        userSlice.middleware,
        settingsSlice.middleware,
        storeSlice.middleware,
        productSlice.middleware,
        reportSlice.middleware,
        planSlice.middleware,
        addonsSlice.middleware,
        transactionSlice.middleware,
        notificationSlice.middleware,
        clinicSlice.middleware,
        patientSlice.middleware,
        categorySlice.middleware,
        subCategorySlice.middleware,
        serviceSlice.middleware,
        reservationSlice.middleware,
        articleSlice.middleware
    )
  })

export { store }
