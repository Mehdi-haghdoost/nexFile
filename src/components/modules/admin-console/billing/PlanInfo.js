import React from 'react';
import { InfoIcon } from '@/components/ui/icons';
import { BILLING_STATUS } from '@/utils/constants/billingConstants';
import { formatBillingDate, daysUntil } from '@/utils/billingUtils';

const PlanInfo = ({ billing }) => {
    const planName = billing?.plan?.name || 'Free';
    const isTrialing = billing?.status === BILLING_STATUS.TRIALING;

    // During a trial the remaining days matter more than the plan name alone
    const message = isTrialing
        ? `You are on the ${planName} trial. ${daysUntil(billing.trialEndsAt)} days remaining, ending ${formatBillingDate(billing.trialEndsAt)}.`
        : `You are on the ${planName} plan`;

    return (
        <div className="flex items-start sm:items-center gap-2 py-2.5 px-3 sm:px-[14px] self-stretch rounded-lg border border-information-50 bg-[rgba(54,90,249,0.05)] dark:border-[#172669] dark:bg-[rgba(54,90,249,0.10)] w-full">
            <div className="flex flex-1 items-start gap-2 min-w-0">
                <InfoIcon className="flex-shrink-0 mt-0.5 sm:mt-0" />
                <h3 className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-300">{message}</h3>
            </div>
        </div>
    );
};

export default PlanInfo;