import React from 'react';
import ActivityFilters from '@/components/modules/admin-console/security/ActivityFilters';
import ActivityActions from '@/components/modules/admin-console/security/ActivityActions';
import ActivityTable from '@/components/modules/admin-console/security/ActivityTable';

const ActivityContent = () => {
    return (
        <article className="w-full">
            {/* Filter Container */}
            <header className="flex justify-between items-center self-stretch mb-4">
                <ActivityFilters />
                <ActivityActions />
            </header>

            {/* Activity Log Table */}
            <ActivityTable />
        </article>
    );
};

export default ActivityContent;