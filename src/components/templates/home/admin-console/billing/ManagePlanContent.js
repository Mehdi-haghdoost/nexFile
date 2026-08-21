'use client';
import React, { useMemo } from 'react';
import PlanInfo from '@/components/modules/admin-console/billing/PlanInfo';
import BillingFeaturesList from '@/components/modules/admin-console/billing/BillingFeaturesList';
import BillingSummary from '@/components/modules/admin-console/billing/BillingSummary';
import { formatBytes } from '@/utils/Storageutils';
import { formatCurrency } from '@/utils/billingUtils';
import { BILLING_CYCLES } from '@/utils/constants/billingConstants';

const ManagePlanContent = ({ billing, isAdmin, onAction }) => {
    // Descriptions are derived from live usage rather than fixed copy
    const features = useMemo(() => {
        if (!billing) return [];

        const { plan, usage, cycle, paymentMethod } = billing;
        const isYearly = cycle === BILLING_CYCLES.YEARLY;

        return [
            {
                id: 'licenses',
                title: `${usage.seatLimit} licenses`,
                description: `Using ${usage.seatsUsed} of ${usage.seatLimit} licenses. Licensed members can sign, edit, share, and track files.`,
                buttonText: 'Manage licenses',
                disabled: !isAdmin
            },
            {
                id: 'cycle',
                title: isYearly ? 'Yearly billing' : 'Monthly billing',
                description: isYearly
                    ? `Billed ${formatCurrency(plan.priceYearly)} per year.`
                    : `Billed ${formatCurrency(plan.priceMonthly)} per month. Switch to yearly to pay less.`,
                buttonText: isYearly ? 'Switch to monthly' : 'Switch to yearly',
                disabled: !isAdmin
            },
            {
                id: 'payment',
                title: 'Payment method',
                description: paymentMethod
                    ? `${paymentMethod.brand} ending in ${paymentMethod.last4}, expires ${paymentMethod.expMonth}/${paymentMethod.expYear}.`
                    : 'No payment method on file. Add one before your trial ends.',
                buttonText: paymentMethod ? 'Update payment method' : 'Add payment method',
                disabled: !isAdmin
            },
            {
                id: 'storage',
                title: 'Usage storage',
                description: `Storage usage: ${formatBytes(usage.storageUsedBytes)} of ${usage.storageQuotaGB} GB.`,
                buttonText: 'Manage storage',
                disabled: !isAdmin
            }
        ];
    }, [billing, isAdmin]);

    return (
        <article className="w-full">
            <PlanInfo billing={billing} />

            <div className="flex flex-col lg:flex-row items-start gap-4 self-stretch mt-4 w-full">
                <BillingFeaturesList features={features} onAction={onAction} />
                <BillingSummary billing={billing} onViewInvoices={() => onAction?.('invoices')} />
            </div>
        </article>
    );
};

export default ManagePlanContent;