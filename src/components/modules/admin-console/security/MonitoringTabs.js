import React from 'react';

const MonitoringTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <nav className="flex justify-center items-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-dark-panel">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`flex justify-center items-center gap-1.5 h-8 py-1 px-[14px] rounded-lg text-medium-14 dark:text-medium-14-white transition-[border,box-shadow,transform,color,opacity] ${activeTab === tab.id
                            ? 'border border-stroke-200 bg-white shadow-middle text-gray-900 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
                            : 'text-gray-600 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default MonitoringTabs;