import React, { useState } from 'react';
import { CONTENT_MANAGEMENT_TABS } from '@/utils/constants/ContentManagementConstant';

const ContentManagementTabs = ({ activeTab, onTabChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const activeTabObj = CONTENT_MANAGEMENT_TABS.find(tab => tab.id === activeTab);

    return (
        <>
            {/* Mobile Dropdown (< lg) */}
            <div className='lg:hidden w-full sm:w-auto relative'>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center justify-between w-full sm:w-auto sm:min-w-[200px] h-10 px-4 rounded-lg border border-stroke-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-middle hover:bg-gray-50 dark:hover:bg-neutral-700 active:scale-95 transition-all'
                >
                    <span className='text-sm font-medium text-neutral-500 dark:text-white'>
                        {activeTabObj?.label || 'Select filter'}
                    </span>
                    <svg 
                        className={`w-4 h-4 text-neutral-400 dark:text-neutral-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <>
                        <div 
                            className='fixed inset-0 z-10' 
                            onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className='absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-[250px] mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-stroke-200 dark:border-neutral-700 z-20 overflow-hidden'>
                            {CONTENT_MANAGEMENT_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        onTabChange(tab.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-neutral-400 font-medium'
                                            : 'text-neutral-500 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Desktop Tabs (≥ lg) */}
            <nav
                className='hidden lg:flex justify-center items-center gap-1 p-0.5 h-8 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 overflow-x-auto'
                role="tablist"
                aria-label="Content management filter tabs"
                style={{ 
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <style jsx>{`
                    nav::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div className='flex items-center gap-1 min-w-max'>
                    {CONTENT_MANAGEMENT_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`${tab.id}-panel`}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-lg transition-all duration-300 ease-out whitespace-nowrap flex-shrink-0 ${
                                activeTab === tab.id
                                    ? 'border border-stroke-200 bg-white shadow-middle dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
                                    : 'hover:bg-stroke-200 dark:hover:bg-transparent active:scale-95'
                            }`}
                        >
                            <span className='text-sm font-medium text-neutral-500 dark:text-white'>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default ContentManagementTabs;