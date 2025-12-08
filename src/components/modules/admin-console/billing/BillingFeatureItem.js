import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingFeatureItem = ({ feature, isLast = false }) => {
    const { title, description, buttonText } = feature;

    return (
        <article className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch pb-2">
                <div className="flex flex-1 flex-col justify-center items-start gap-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white">{title}</h4>
                    <p className="text-xs text-neutral-300 dark:text-neutral-300 whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <button className="flex justify-center items-center gap-1.5 h-9 sm:h-8 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 hover:bg-gray-50 active:scale-95 transition-all dark:bg-neutral-700 dark:border-neutral-600 dark:text-white w-full sm:w-auto flex-shrink-0">
                    {buttonText}
                </button>
            </div>
            {!isLast && <VectorIcon className="w-full dark:stroke-neutral-600" />}
        </article>
    );
};

export default BillingFeatureItem;