import { useState } from 'react';
import { MEMBER_TABS } from '@/utils/constants/membersConstants';

const MembersTabs = () => {
    const [activeTab, setActiveTab] = useState('active');

    return (
        <nav
            className='flex justify-center items-center gap-1 p-0.5 h-8 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700'
            role="tablist"
            aria-label="Member filter tabs"
        >
            {MEMBER_TABS.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-lg transition-[border,box-shadow,opacity] duration-300 ease-out ${activeTab === tab.id
                            ? 'border border-stroke-200 bg-white shadow-middle dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
                            : 'rounded-[5px] hover:bg-stroke-200 dark:hover:bg-dark-gradient'
                        }`}
                >
                    <h3 className='text-regular-14-neutral-500 dark:text-regular-14-white'>{tab.label}</h3>
                </button>
            ))}
        </nav>
    );
};

export default MembersTabs;