import React from 'react';

const MonitoringTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <nav className="flex justify-center items-center gap-1 h-9 sm:h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-dark-panel w-full sm:w-auto overflow-x-auto" 
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
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex justify-center items-center gap-1.5 h-8 py-1 px-3 sm:px-[14px] rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                            activeTab === tab.id
                                ? 'border border-stroke-200 bg-white shadow-middle text-gray-900 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel dark:text-white'
                                : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white active:scale-95'
                        }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MonitoringTabs;