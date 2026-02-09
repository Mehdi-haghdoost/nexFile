"use client";

import React, { useState, useRef, useEffect } from 'react';
import useSortStore from '@/store/ui/sortStore';
import { getSortLabel } from '@/utils/helpers/sortHelpers';

const SortDropdown = () => {
    const { sortBy, sortOrder, setSort } = useSortStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const sortOptions = [
        { value: 'name', label: 'Name', orders: ['asc', 'desc'], labels: ['A-Z', 'Z-A'] },
        { value: 'date', label: 'Date', orders: ['desc', 'asc'], labels: ['Newest', 'Oldest'] },
        { value: 'size', label: 'Size', orders: ['desc', 'asc'], labels: ['Largest', 'Smallest'] },
        { value: 'type', label: 'Type', orders: ['asc', 'desc'], labels: ['Folders', 'Files'] },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSortChange = (value, order) => {
        setSort(value, order);
        setIsOpen(false);
    };

    const currentLabel = getSortLabel(sortBy, sortOrder);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 py-4 pr-4 pl-3 justify-center items-center gap-1.5 whitespace-nowrap shadow-light bg-white rounded-lg border border-[#ECECEE] dark:border-dark-border dark:bg-dark-gradient dark:shadow-dark-panel"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E2E37] dark:text-white shrink-0">
                    <path d="M3 6h18M7 12h10m-7 6h4"/>
                </svg>
                <h3 className='text-sm font-medium dark:text-white hidden sm:block'>
                    Sort
                </h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-[#2E2E37] dark:text-white transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {/* Dropdown Menu - Fixed Height with Scroll */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl z-[100] overflow-hidden">
                    {/* ✅ Fixed height - shows exactly 4 items (2 sections) with scroll */}
                    <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                        {sortOptions.map((option) => (
                            <div key={option.value} className="border-b border-gray-100 dark:border-neutral-700 last:border-b-0">
                                {/* Section Header - Compact */}
                                <div className="px-3 py-1 bg-gray-50 dark:bg-neutral-900/50">
                                    <p className="text-[9px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        {option.label}
                                    </p>
                                </div>
                                {/* Options - Compact */}
                                {option.orders.map((order, index) => {
                                    const isActive = sortBy === option.value && sortOrder === order;
                                    return (
                                        <button
                                            key={`${option.value}-${order}`}
                                            onClick={() => handleSortChange(option.value, order)}
                                            className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-between ${
                                                isActive 
                                                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold' 
                                                    : 'text-gray-700 dark:text-neutral-300'
                                            }`}
                                        >
                                            <span className="truncate">{option.labels[index]}</span>
                                            {isActive && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-2">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortDropdown;