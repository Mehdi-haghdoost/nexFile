"use client";

import React from 'react';
import TransferSettingsControl from './TransferSettingsControl';

const DAY_MS = 24 * 60 * 60 * 1000;

const TransferModalFooter = ({ settings, isCreating, processedCount, filesCount, transferType, onCreate }) => {
    const isEmail = transferType === 'email';

    const expiryLabel = new Date(
        Date.now() + settings.expiresInDays * DAY_MS
    ).toLocaleDateString('en-US');

    // Every file is ready before the server starts emailing, so the label moves on at that point
    const busyLabel = isEmail && processedCount === filesCount
        ? 'Sending emails...'
        : `Preparing ${processedCount}/${filesCount}...`;

    return (
        <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-0 mt-2 sm:mt-4'>
            <div className='flex flex-1 items-center gap-2 sm:gap-3'>
                <TransferSettingsControl disabled={isCreating} {...settings} />

                <div className='flex flex-col items-start justify-center gap-0.5 min-w-0'>
                    <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate w-full'>
                        Expires on {expiryLabel}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-neutral-200 truncate w-full'>
                        {settings.isPasswordEnabled ? 'Password protected' : 'No password needed'}
                    </p>
                </div>
            </div>

            <button
                type='button'
                onClick={onCreate}
                disabled={isCreating}
                className='w-full sm:w-auto flex justify-center items-center gap-1 sm:gap-1.5 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
                {isCreating && (
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                )}
                {isCreating ? busyLabel : isEmail ? 'Send transfer' : 'Create transfer'}
            </button>
        </div>
    );
};

export default TransferModalFooter;