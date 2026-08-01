'use client';
import { useState } from 'react';
import MembersActions from '@/components/templates/home/admin-console/members/MembersActions';
import MembersHeader from '@/components/templates/home/admin-console/members/MembersHeader';
import MembersList from '@/components/templates/home/admin-console/members/MembersList';
import useMembers from '@/hooks/admin/useMembers';

const MembersContent = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const {
        organization,
        organizations,
        selectedOrgId,
        switchOrg,
        members,
        isLoading,
        error,
        updateMember,
        removeMember,
        cancelInvite,
    } = useMembers(activeTab);

    // Simple client-side filter over the active tab's rows
    const filteredMembers = members.filter((m) =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
            <MembersActions />

            <section className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full'>
                <MembersHeader
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    organization={organization}
                    organizations={organizations}
                    selectedOrgId={selectedOrgId}
                    onOrgChange={switchOrg}
                />
                <MembersList
                    members={filteredMembers}
                    isLoading={isLoading}
                    error={error}
                    activeTab={activeTab}
                    onUpdateMember={updateMember}
                    onRemoveMember={removeMember}
                    onCancelInvite={cancelInvite}
                />
            </section>
        </main>
    );
};

export default MembersContent;