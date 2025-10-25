import React from 'react';
import { InfoIcon } from '@/components/ui/icons';

const PlanInfo = () => {
    return (
        <div className="flex items-center gap-2 py-2.5 px-[14px] self-stretch rounded-lg border border-information-50 bg-[rgba(54,90,249,0.05)]">
            <div className="flex flex-1 items-start gap-2">
                <InfoIcon />
                <h3 className="text-regular-14-neutral-500">You are on Business plan</h3>
            </div>
        </div>
    );
};

export default PlanInfo;