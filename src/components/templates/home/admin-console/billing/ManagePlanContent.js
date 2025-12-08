import React from 'react';
import PlanInfo from '@/components/modules/admin-console/billing/PlanInfo';
import BillingFeaturesList from '@/components/modules/admin-console/billing/BillingFeaturesList';
import BillingSummary from '@/components/modules/admin-console/billing/BillingSummary';
import { BILLING_FEATURES } from '@/utils/constants/billingConstants';

const ManagePlanContent = () => {
    return (
        <article className="w-full">
            <PlanInfo />

            <div className="flex flex-col lg:flex-row items-start gap-4 self-stretch mt-4 w-full">
                <BillingFeaturesList features={BILLING_FEATURES} />
                <BillingSummary />
            </div>
        </article>
    );
};

export default ManagePlanContent;