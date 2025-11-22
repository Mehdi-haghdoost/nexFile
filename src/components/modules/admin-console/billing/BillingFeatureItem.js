import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingFeatureItem = ({ feature, isLast = false }) => {
    const { title, description, buttonText } = feature;

    return (
        <article className="w-full">
            <div className="flex justify-between items-center self-stretch pb-2">
                <div className="flex flex-1 flex-col justify-center items-start gap-1">
                    <h4 className="text-medium-14 dark:text-medium-14-white">{title}</h4>
                    <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300 whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <button className="btn-secondary dark:bg-neutral-700 dark:border-neutral-600 dark:text-regular-14-white">
                    {buttonText}
                </button>
            </div>
            {!isLast && <VectorIcon  />}
        </article>
    );
};

export default BillingFeatureItem;