'use client';
import React, { useState } from 'react';
import ContentManagementHeader from '@/components/templates/home/admin-console/contentManagement/ContentManagementHeader';
import ContentManagementList from '@/components/templates/home/admin-console/contentManagement/ContentManagementList';
import useContent from '@/hooks/admin/useContent';

const ContentManagementContent = () => {
    const [activeTab, setActiveTab] = useState('shared-folder');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    const { items, isLoading, error, setArchived } = useContent(activeTab);

    // Client-side search across folder and owner name
    const filteredItems = items.filter(
        (item) =>
            item.folder?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectItem = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredItems.map((item) => item.id));
        }
    };

    // Clear the selection when switching tabs, since rows change entirely
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedIds([]);
    };

    return (
        <main className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white overflow-hidden dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
            <section className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch min-w-0 w-full'>
                <ContentManagementHeader
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                <ContentManagementList
                    data={filteredItems}
                    isLoading={isLoading}
                    error={error}
                    activeTab={activeTab}
                    selectedIds={selectedIds}
                    onSelectItem={handleSelectItem}
                    onSelectAll={handleSelectAll}
                    onSetArchived={setArchived}
                />
            </section>
        </main>
    );
};

export default ContentManagementContent;