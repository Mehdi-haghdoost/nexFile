'use client';
import React from 'react';
import { BILLING_TABS } from '@/utils/constants/billingConstants';
import BillingTabs from '@/components/modules/admin-console/billing/BillingTabs';
import ManagePlanContent from '@/components/templates/home/admin-console/billing/ManagePlanContent';
import InformationContent from '@/components/templates/home/admin-console/billing/InformationContent';
import useBilling from '@/hooks/admin/useBilling';
import useBillingStore from '@/store/features/billing/billingStore';
import { showErrorToast } from '@/lib/toast';

const BillingContent = () => {
    const { billing, isAdmin, isLoading, error } = useBilling();

    // Tab lives in the store so the choice survives navigating away and back
    const activeTab = useBillingStore((state) => state.activeTab);
    const setActiveTab = useBillingStore((state) => state.setActiveTab);

    // Actions land in the next phase; buttons stay visible but inert for now
    const handleAction = (actionId) => {
        showErrorToast(`"${actionId}" is not available yet`);
    };

    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            <section className="flex flex-1 flex-col items-start gap-4 md:gap-5 w-full">
                <BillingTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={BILLING_TABS}
                />

                {isLoading && (
                    <div className="flex items-center justify-center w-full py-12">
                        <div className="w-5 h-5 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                )}

                {!isLoading && error && (
                    <div className="w-full py-12 text-center text-xs sm:text-sm text-red-500">
                        {error}
                    </div>
                )}

                {!isLoading && !error && activeTab === 'manage-plan' && (
                    <ManagePlanContent
                        billing={billing}
                        isAdmin={isAdmin}
                        onAction={handleAction}
                    />
                )}

                {!isLoading && !error && activeTab === 'information' && (
                    <InformationContent billing={billing} isAdmin={isAdmin} />
                )}
            </section>
        </main>
    );
};

export default BillingContent;