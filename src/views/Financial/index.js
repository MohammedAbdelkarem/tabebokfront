import { Fragment, useCallback, useEffect, useState } from "react"

import Breadcrumbs from '@components/breadcrumbs'
import Plans from "./plan"
import Addons from "./addons"
import LoadSpinner from "../../@core/components/spinner/loaders"
import { Alert } from "reactstrap"
import { useListMutation as fetchPlans } from "../../redux/rtkQuery/plan"
import { useListMutation as fetchAddons } from "../../redux/rtkQuery/addons"
const FinancialManagement = () => {
    const [fetchPlan, {data:plansData, isLoading:fetchingPlans}] = fetchPlans()    
    const [fetchAddon, {data:addonsData, isLoading:fetchingAddons}] = fetchAddons()
    useEffect(() => {
        fetchAddon()
        fetchPlan()
    }, [])
    const isLoading = fetchingPlans || fetchingAddons

    return (
        <Fragment>
        <Breadcrumbs title='Financial management' data={[{ title: 'Financial' }, { title: 'Plan' }]} />
        {
            isLoading ? <LoadSpinner /> : (
            <>
                <div style={{ padding: '0px 100px' }}>
                <Alert color='primary' className='mb-2 mt-2' style={{ width: '100%' }}>
                    <h2 className='alert-heading' style={{ fontSize: '19px' }}>Plans Management</h2>
                    <div className='alert-body'>description ...</div>
                </Alert>
                <Plans data={plansData?.data} />
                </div>

                {/* <div style={{ padding: '0px 100px' }}>
                <Alert color='primary' className='mb-2 mt-2' style={{ width: '100%' }}>
                    <h2 className='alert-heading' style={{ fontSize: '19px' }}>Addons Management</h2>
                    <div className='alert-body'>description ...</div>
                </Alert>
                <Addons data={addonsData?.data} />
                </div> */}
            </>
            )
        }
        </Fragment>
  )
}

export default FinancialManagement