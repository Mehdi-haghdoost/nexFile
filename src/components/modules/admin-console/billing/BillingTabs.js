import React from 'react';

const BillingTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <nav className="flex justify-center items-center p-0.5 h-8 gap-1 rounded-lg border border-stroke-300 bg-stroke-100">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex justify-center items-center gap-2.5 h-8 py-1 px-[14px] transition-all duration-200 ${
                        activeTab === tab.id
                            ? 'rounded-lg border border-stroke-200 bg-white shadow-middle text-medium-14'
                            : 'rounded-[5px] text-medium-14 text-neutral-300 hover:text-neutral-500'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default BillingTabs;