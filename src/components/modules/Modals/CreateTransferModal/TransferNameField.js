"use client";

import React from 'react';
import { TRANSFER_MAX_NAME_LENGTH } from '@/utils/constants/transferConstants';

const TransferNameField = ({ value, onChange, placeholder, isEmail = false, disabled = false }) => {
    // Email recipients see the name in their message, so the hint says so for email transfers
    const hint = isEmail
        ? "Optional. Uses the first file's name if left empty. Recipients see this name in the email."
        : "Optional. Uses the first file's name if left empty.";

    return (
        <div className='flex flex-col gap-1.5 w-full'>
            <label htmlFor='transfer-name' className='text-xs font-medium text-neutral-500 dark:text-neutral-300'>
                Transfer name <span className='font-normal text-neutral-300 dark:text-neutral-400'>(optional)</span>
            </label>

            <input
                id='transfer-name'
                type='text'
                dir='auto'
                autoComplete='off'
                value={value}
                disabled={disabled}
                maxLength={TRANSFER_MAX_NAME_LENGTH}
                placeholder={placeholder}
                aria-describedby='transfer-name-hint'
                onChange={(event) => onChange(event.target.value)}
                className='w-full rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
            />

            <div className='flex items-start justify-between gap-3'>
                <p id='transfer-name-hint' className='text-xs text-neutral-300 dark:text-neutral-400'>
                    {hint}
                </p>

                {/* The count only matters once something is typed */}
                {value.length > 0 && (
                    <span className='shrink-0 text-[11px] text-neutral-300 dark:text-neutral-500'>
                        {value.length}/{TRANSFER_MAX_NAME_LENGTH}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TransferNameField;