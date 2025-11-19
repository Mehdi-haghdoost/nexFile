import React from 'react';
import { CONTENT_MANAGEMENT_TABS } from '@/utils/constants/ContentManagementConstant';

const ContentManagementTabs = ({ activeTab, onTabChange }) => {
    return (
        <nav
            className='flex justify-center items-center gap-1 p-0.5 h-8 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700'
            role="tablist"
            aria-label="Content management filter tabs"
        >
            {CONTENT_MANAGEMENT_TABS.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-lg transition-[border,box-shadow,opacity] whitespace-nowrap ${activeTab === tab.id
                        ? 'border border-stroke-200 bg-white shadow-middle dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
                        : 'rounded-[5px] hover:bg-stroke-200 dark:hover:bg-transparent'
                        }`}
                >
                    <span className='text-medium-14 dark:text-medium-14-white'>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default ContentManagementTabs;