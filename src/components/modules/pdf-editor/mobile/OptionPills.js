'use client';
import React from 'react';

const OptionPills = ({ label, options, value, formatValue, onSelect }) => (
    <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium text-neutral-500 dark:text-white'>{label}</span>
        <div className='flex flex-wrap gap-2'>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        option === value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                >
                    {formatValue(option)}
                </button>
            ))}
        </div>
    </div>
);

export default OptionPills;