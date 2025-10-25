import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingFeatureItem = ({ feature, isLast = false }) => {
    const { title, description, buttonText } = feature;

    return (
        <article className="w-full">
            <div className="flex justify-between items-center self-stretch pb-2">
                <div className="flex flex-1 flex-col justify-center items-start gap-1">
                    <h4 className="text-medium-14">{title}</h4>
                    <p className="text-regular-12-neutral-200">{description}</p>
                </div>
                <button className="flex justify-center items-center gap-2.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 hover:shadow-middle transition-all duration-200 hover:border-stroke-400">
                    {buttonText}
                </button>
            </div>
            {!isLast && <VectorIcon className="self-stretch" />}
        </article>
    );
};

export default BillingFeatureItem;