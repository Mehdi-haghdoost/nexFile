'use client';
import React, { useState } from 'react';
import ActivityFilters from '@/components/modules/admin-console/security/ActivityFilters';
import ActivityActions from '@/components/modules/admin-console/security/ActivityActions';
import ActivityTable from '@/components/modules/admin-console/security/ActivityTable';
import useActivity from '@/hooks/admin/useActivity';

const ActivityContent = () => {
    const [category, setCategory] = useState('all');
    const { activities, isLoading, error, isExporting, clearActivity, exportActivity } =
        useActivity(category);

    return (
        <article className="w-full">
            {/* Filters and actions */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch mb-4 w-full">
                <ActivityFilters category={category} onCategoryChange={setCategory} />
                <ActivityActions
                    onClear={clearActivity}
                    onExport={exportActivity}
                    isExporting={isExporting}
                    hasActivity={activities.length > 0}
                />
            </header>

            <ActivityTable activities={activities} isLoading={isLoading} error={error} />
        </article>
    );
};

export default ActivityContent;