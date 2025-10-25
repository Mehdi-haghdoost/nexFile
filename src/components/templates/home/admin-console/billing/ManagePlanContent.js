import React from 'react';
import PlanInfo from '@/components/modules/admin-console/billing/PlanInfo';
import BillingFeaturesList from '@/components/modules/admin-console/billing/BillingFeaturesList';
import { BILLING_FEATURES } from '@/utils/constants/billingConstants';

const ManagePlanContent = () => {
    return (
        <article className="w-full">
            <PlanInfo />
            
            <div className="flex items-start gap-4 self-stretch mt-4">
                <BillingFeaturesList features={BILLING_FEATURES} />
                
                {/* Summary Container - برای توسعه آینده */}
                <aside className="flex flex-col justify-center items-center gap-4 p-4 w-[300px] h-[348px] rounded-lg border border-stroke-200">
                    {/* محتوای summary از فیگما اضافه خواهد شد */}
                </aside>
            </div>
        </article>
    );
};

export default ManagePlanContent;