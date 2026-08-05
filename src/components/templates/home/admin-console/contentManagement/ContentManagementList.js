'use client';
import React from 'react';
import ContentManagementTableHeader from './ContentManagementTableHeader';
import ContentManagementRow from '@/components/modules/admin-console/contentManagement/ContentManagementRow';

const ContentManagementList = ({
    data,
    isLoading,
    error,
    activeTab,
    selectedIds,
    onSelectItem,
    onSelectAll,
    onSetArchived,
}) => {
    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    return (
        <section
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 overflow-hidden dark:border-neutral-700 w-full'
            aria-label="Content management list"
        >
            <ContentManagementTableHeader
                onSelectAll={onSelectAll}
                isAllSelected={isAllSelected}
            />

            {isLoading ? (
                <div className='flex items-center justify-center w-full py-16'>
                    <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
                </div>
            ) : error ? (
                <div className='flex flex-col items-center justify-center w-full py-16 gap-1 text-center px-4'>
                    <p className='text-sm text-red-500'>Failed to load content</p>
                    <p className='text-xs text-neutral-400'>{error}</p>
                </div>
            ) : data.length === 0 ? (
                <div className='flex items-center justify-center w-full py-16 px-4 text-center'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>
                        {activeTab === 'member-access'
                            ? 'Member access view is not available yet'
                            : 'No content found'}
                    </p>
                </div>
            ) : (
                <ul className="w-full">
                    {data.map((member) => (
                        <ContentManagementRow
                            key={member.id}
                            member={member}
                            isSelected={selectedIds.includes(member.id)}
                            onSelect={onSelectItem}
                            onSetArchived={onSetArchived}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ContentManagementList;