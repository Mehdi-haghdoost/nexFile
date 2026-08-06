'use client';
import React from 'react';
import { ACTIVITY_CATEGORIES } from '@/utils/constants/securityConstants';

const ActivityFilters = ({ category, onCategoryChange }) => {
    return (
        <nav className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 h-9 sm:h-8 py-1.5 sm:py-1 px-3 rounded-lg border border-stroke-300 bg-white shadow-light dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap">Category:</span>
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="flex-1 min-w-0 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white bg-transparent outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-neutral-800 [&>option]:text-neutral-500 [&>option]:dark:text-white"
                >
                    {ACTIVITY_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
            </div>
        </nav>
    );
};

export default ActivityFilters;