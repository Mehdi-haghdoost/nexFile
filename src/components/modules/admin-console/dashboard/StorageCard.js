import React from 'react';
import {
    formatBytes,
    calculateStoragePercentage,
    calculateRemainingGB,
} from '@/utils/Storageutils';

const StorageCard = ({ usedBytes, totalGB, onManageClick }) => {
    // Calculate values using utility functions
    const percentage = calculateStoragePercentage(usedBytes, totalGB);
    const remainingGB = calculateRemainingGB(usedBytes, totalGB);
    const formattedUsed = formatBytes(usedBytes);

    return (
        <article className='flex flex-col rounded-lg bg-white border border-stroke-300 min-w-0 dark:bg-neutral-900 dark:border-neutral-700'>
            {/* Storage Info */}
            <div className='flex flex-col gap-5 p-4'>
                {/* Storage Details */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-medium-14 dark:text-medium-14-white'>Storage</h3>
                    <p className='text-regular-12 dark:text-regular-12-neutral-300'>
                        Using {formattedUsed} out of {totalGB} GB
                    </p>
                </div>

                {/* Storage Progress Bar */}
                <div className='flex items-center gap-2'>
                    <div className='h-[10px] flex-1 rounded-[4.722px] bg-[#EDECF9] relative overflow-hidden dark:bg-neutral-500'>
                        {percentage > 0 && (
                            <div
                                className='absolute top-0 left-0 h-full bg-[radial-gradient(89.28%_89%_at_49.61%_50.4%,#7E60F8_0%,#4C3CC6_100%)]'
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Storage Footer */}
            <footer className='flex flex-wrap justify-between items-center py-3 px-4 gap-2 border-t border-stroke-300'>
                <h4 className='text-regular-14-neutral-500 dark:text-regular-14-white'>
                    {remainingGB.toFixed(1)} GB remaining
                </h4>
                <button
                    onClick={onManageClick}
                    className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-stroke-300 shadow-light bg-white text-medium-14 dark:text-medium-14-white text-sm whitespace-nowrap hover:bg-[#F6F6F7] transition-colors dark:shadow-dark-panel dark:bg-dark-gradient dark:border-dark-border'
                >
                    Manage storage
                </button>
            </footer>
        </article>
    );
};

export default StorageCard;