// ** React Imports
import { Fragment, useEffect, useMemo, useState } from "react"

// ** Roles Components
import useHeaders from "@hooks/useHeaders"
import EmptyComponent from "../../../../components/empty"
import { useTranslation } from "react-i18next"
import LoadSpinner from "../../../../../@core/components/spinner/loaders"
import { useLocation } from "react-router-dom"
import { useGetMutation } from "../../../../../redux/rtkQuery/content/subCategory"

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
import SubCard from "./card"
import SidebarSubCategory from "./sidebar"
const SubCategories = () => {
  const state = useLocation()?.state
  const headers = useHeaders()
  const { t } = useTranslation()

  const [managementModal, setManagementModal] = useState(false)
  const [selected, setSelected] = useState(null)
  // ** Methods
  const [get, { isLoading, data }] = useGetMutation()
  const subCategories = data?.data || []
  useEffect(() => {
    if (state) {
        get({headers, id:state})
    }
  }, [state])
  
    const handleRemove = (item) => {
      setSelected(item)
      setModal(true)
    }
    const handleUpdate = (item) => {
      setSelected(item)
      setManagementModal(true)
    }
    const handleClose = () => {
      setSelected(null)
      setModal(false)
      setManagementModal(false)
    }
    // useMemo(() => {
    //   if (removeStatus === 'fulfilled') {
    //     SuccessAlert({
    //       title: t('Success'),
    //       body: removeData?.message,
    //       position: 'top-left'
    //     })
    //     handleClose()
    //   } else if (removeStatus === 'rejected') {
    //     ErrorAlert({
    //       title: t('Failed'),
    //       body: removeError?.data?.message,
    //       button: t('Done')
    //     })
    //     handleClose()
    //   }
    // }, [removeStatus])

  return (
    <Fragment>
      <Breadcrumbs title={t('SubCategories management')} data={[{ title: t('Content list'), link: '/content-pages' }, {title: t('SubCategories list')}]} />         
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <SubCard data={subCategories}
                   setManagementModal={setManagementModal}
                   handleClose={handleClose}
                   handleUpdate={handleUpdate}
                   selected={selected}
                   setSelected={setSelected}/>
          <div style={{ height: "20px", background: "transparent" }} />
        </>
      )}
     <SidebarSubCategory open={managementModal}
                         id={state}
                         toggleSidebar={setManagementModal}
                         selectedItem={selected}
                         handleClose={handleClose}
                         get={get}/>
      
    </Fragment>
  )
}

export default SubCategories
