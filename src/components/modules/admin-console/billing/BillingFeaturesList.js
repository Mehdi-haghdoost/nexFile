import React from 'react';
import BillingFeatureItem from './BillingFeatureItem';

const BillingFeaturesList = ({ features }) => {
    return (
        <section className="flex flex-1 flex-col justify-center items-center p-4 gap-4 rounded-lg border border-stroke-200">
            {features.map((feature, index) => (
                <BillingFeatureItem
                    key={feature.id}
                    feature={feature}
                    isLast={index === features.length - 1}
                />
            ))}
        </section>
    );
};

export default BillingFeaturesList;