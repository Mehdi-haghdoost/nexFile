import React, { useState } from 'react';
import { CONTENT_MANAGEMENT_MOCK_DATA } from '@/utils/constants/ContentManagementConstant';
import ContentManagementHeader from '@/components/templates/home/admin-console/contentManagement/ContentManagementHeader';
import ContentManagementList from '@/components/templates/home/admin-console/contentManagement/ContentManagementList';

const ContentManagementContent = () => {
    const [activeTab, setActiveTab] = useState('shared-folder');
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectItem = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === CONTENT_MANAGEMENT_MOCK_DATA.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(CONTENT_MANAGEMENT_MOCK_DATA.map(item => item.id));
        }
    };

    return (
        <main className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white overflow-hidden dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
            <section className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch min-w-0 w-full'>
                <ContentManagementHeader 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
                <ContentManagementList 
                    data={CONTENT_MANAGEMENT_MOCK_DATA}
                    selectedIds={selectedIds}
                    onSelectItem={handleSelectItem}
                    onSelectAll={handleSelectAll}
                />
            </section>
        </main>
    );
};

export default ContentManagementContent;