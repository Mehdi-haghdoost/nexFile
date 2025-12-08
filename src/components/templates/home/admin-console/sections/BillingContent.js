import React, { useState } from 'react';
import { BILLING_TABS } from '@/utils/constants/billingConstants';
import BillingTabs from '@/components/modules/admin-console/billing/BillingTabs';
import ManagePlanContent from '@/components/templates/home/admin-console/billing/ManagePlanContent';
import InformationContent from '@/components/templates/home/admin-console/billing/InformationContent';

const BillingContent = () => {
    const [activeTab, setActiveTab] = useState('manage-plan');

    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            <section className="flex flex-1 flex-col items-start gap-4 md:gap-5 w-full">
                <BillingTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={BILLING_TABS}
                />

                {activeTab === 'manage-plan' && <ManagePlanContent />}
                {activeTab === 'information' && <InformationContent />}
            </section>
        </main>
    );
};

export default BillingContent;