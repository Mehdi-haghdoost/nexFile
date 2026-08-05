'use client';
import { useState } from 'react';
import GroupsHeader from "../groups/GroupsHeader";
import GroupsList from "../groups/GroupsList";
import useGroups from '@/hooks/admin/useGroups';

const GroupsContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const { groups, isLoading, error, refetch, updateGroup, deleteGroup } = useGroups();

    // Client-side search and permission filtering
    const filteredGroups = groups.filter((g) => {
        const matchesSearch = g.name?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (typeFilter === 'all') return true;
        if (typeFilter === 'manage') return g.permission === 'Manage access';
        if (typeFilter === 'edit') return g.permission === 'Edit';
        if (typeFilter === 'view') return g.permission === 'View only';
        return true;
    });

    return (
        <div className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
            <div className="flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full">
                <div className="flex justify-between items-center self-stretch w-full">
                    <GroupsHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        onGroupCreated={refetch}
                    />
                </div>

                <GroupsList
                    groups={filteredGroups}
                    isLoading={isLoading}
                    error={error}
                    onUpdateGroup={updateGroup}
                    onDeleteGroup={deleteGroup}
                />
            </div>
        </div>
    );
};

export default GroupsContent;