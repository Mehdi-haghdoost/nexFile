import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingFeatureItem = ({ feature, isLast = false }) => {
    const { title, description, buttonText } = feature;

    return (
        <article className="w-full">
            <div className="flex justify-between items-center self-stretch pb-2">
                <div className="flex flex-1 flex-col justify-center items-start gap-1">
                    <h4 className="text-medium-14">{title}</h4>
                    <p className="text-regular-12-neutral-200 whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <button className="btn-secondary">
                    {buttonText}
                </button>
            </div>
            {!isLast && <VectorIcon className="self-stretch" />}
        </article>
    );
};

export default BillingFeatureItem;