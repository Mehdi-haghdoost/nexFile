import React from 'react';

const MonitoringTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <nav className="flex justify-center items-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`flex justify-center items-center gap-1.5 h-8 py-1 px-[14px] rounded-lg text-medium-14 transition-all ${
                        activeTab === tab.id
                            ? 'border border-stroke-200 bg-white shadow-middle text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
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