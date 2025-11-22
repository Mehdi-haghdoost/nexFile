import React from 'react';
import { VectorIcon } from '@/components/ui/icons';

const BillingSummary = () => {
    return (
        <aside className="flex flex-col justify-center items-center gap-4 p-4 w-[300px] h-[370px] rounded-lg border border-stroke-200 dark:border-neutral-700 dark:bg-neutral-800/30">
            {/* Summary Text */}
            <header className="flex flex-col justify-center items-start gap-2 self-stretch">
                <h3 className="text-medium-14 dark:text-medium-14-white">Summary</h3>
                <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300">
                    You are currently not incurring any charges.
                    The free trial period will conclude on
                    February 5, 2025.
                </p>
            </header>

            {/* Billing Details Container */}
            <section className="flex flex-col items-start gap-4 self-stretch">
                <VectorIcon className="w-full dark:stroke-neutral-600" />

                <h3 className="text-medium-12 dark:text-medium-12-white">Billed monthly</h3>

                <VectorIcon className="w-full dark:stroke-neutral-600" />

                {/* Plan Cost Container */}
                <div className="flex justify-between items-center self-stretch">
                    <h3 className="text-medium-12 dark:text-medium-12-white">Business plan</h3>
                    <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300">$59,00</p>
                </div>

                {/* Tax Info Container */}
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex items-center gap-1">
                        <h3 className="text-medium-12 dark:text-medium-12-white">Value Added Tax</h3>
                        <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300">•</p>
                        <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300">10%</p>
                    </div>
                    <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-300">$5,90</p>
                </div>

                <VectorIcon className="w-full dark:stroke-neutral-600" />

                {/* Total Cost Container */}
                <div className="flex justify-between items-center self-stretch">
                    <h3 className="text-medium-12 dark:text-medium-12-white">Total</h3>
                    <p className="text-medium-14-success-500 dark:text-medium-14-success-400">$64,90</p>
                </div>

                <VectorIcon className="w-full dark:stroke-neutral-600" />
            </section>
            <button className="text-zinc-700 hover:text-green-600 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-4 shadow hover:shadow-green-600 duration-700 self-stretch text-medium-14 dark:text-regular-14-white dark:hover:text-green-400">
                See all invoices
            </button>
        </aside>
    );
};

export default BillingSummary;