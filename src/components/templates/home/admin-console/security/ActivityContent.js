import React from 'react';
import ActivityFilters from '@/components/modules/admin-console/security/ActivityFilters';
import ActivityActions from '@/components/modules/admin-console/security/ActivityActions';
import ActivityTable from '@/components/modules/admin-console/security/ActivityTable';

const ActivityContent = () => {
    return (
        <article className="w-full">
            {/* Filter Container */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch mb-4 w-full">
                <ActivityFilters />
                <ActivityActions />
            </header>

            {/* Activity Log Table */}
            <ActivityTable />
        </article>
    );
};

export default ActivityContent;