import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingSummary = () => {
    return (
        <aside className="flex flex-col justify-center items-center gap-4 p-4 w-[300px] h-[348px] rounded-lg border border-stroke-200">
            {/* Summary Text */}
            <header className="flex flex-col justify-center items-start gap-2 self-stretch">
                <h3 className="text-medium-14">Summary</h3>
                <p className="text-regular-12-neutral-200">
                    You are currently not incurring any charges.
                    The free trial period will conclude on
                    February 5, 2025.
                </p>
            </header>

            {/* Billing Details Container */}
            <section className="flex flex-col items-start gap-4 self-stretch">
                <VectorIcon className="w-full" />

                <h3 className="text-medium-12">Billed monthly</h3>

                <VectorIcon className="w-full" />

                {/* Plan Cost Container */}
                <div className="flex justify-between items-center self-stretch">
                    <h3 className="text-medium-12">Business plan</h3>
                    <p className="text-regular-12-neutral-200">$59,00</p>
                </div>

                {/* Tax Info Container */}
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex items-center gap-1">
                        <h3 className="text-medium-12">Value Added Tax</h3>
                        <p className="text-regular-12-neutral-200">•</p>
                        <p className="text-regular-12-neutral-200">10%</p>
                    </div>
                    <p className="text-regular-12-neutral-200">$5,90</p>
                </div>

                <VectorIcon className="w-full" />

                {/* Total Cost Container */}
                <div className="flex justify-between items-center self-stretch">
                    <h3 className="text-medium-12">Total</h3>
                    <p className="text-medium-14-success-500">$64,90</p>
                </div>

                <VectorIcon className="w-full" />
            </section>

            <button className="btn-secondary self-stretch">
                See all invoices
            </button>
        </aside>
    );
};

export default BillingSummary;