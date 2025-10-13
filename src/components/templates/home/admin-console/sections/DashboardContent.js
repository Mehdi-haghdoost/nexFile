import React from 'react';
import TeamUsageSection from '@/components/modules/admin-console/dashboard/TeamUsageSection';
import ToolsSection from '@/components/modules/admin-console/dashboard/ToolsSection';
import {
    DASHBOARD_TOOLS,
    DASHBOARD_ACTIONS,
    DEFAULT_LICENSE_DATA,
    DEFAULT_STORAGE_DATA,
    DASHBOARD_TEXTS,
} from '@/utils/constants/Dashboardconstants';

const DashboardContent = () => {
    // License data - در آینده از API یا Store می‌آید
    const licenseData = DEFAULT_LICENSE_DATA;

    // Storage data - در آینده از API یا Store می‌آید
    const storageData = DEFAULT_STORAGE_DATA;

    // Handle tool actions
    const handleToolAction = (action) => {
        switch (action) {
            case DASHBOARD_ACTIONS.OPEN_REPLAY:
                console.log('Opening Replay...');
                // TODO: Navigate to Replay
                break;
            case DASHBOARD_ACTIONS.OPEN_SEND_FILES:
                console.log('Opening Send Files...');
                // TODO: Open Send Files modal
                break;
            case DASHBOARD_ACTIONS.OPEN_SHARE:
                console.log('Opening Share...');
                // TODO: Open Share modal
                break;
            case DASHBOARD_ACTIONS.OPEN_PDF_EDITOR:
                console.log('Opening PDF Editor...');
                // TODO: Navigate to PDF Editor
                break;
            case DASHBOARD_ACTIONS.OPEN_ANALYTICS:
                console.log('Opening Analytics...');
                // TODO: Navigate to Analytics
                break;
            case DASHBOARD_ACTIONS.OPEN_SIGNATURES:
                console.log('Opening Signatures...');
                // TODO: Navigate to Signatures
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    // Transform tools data to include onClick handlers
    const toolsWithHandlers = DASHBOARD_TOOLS.map((column) =>
        column.map((tool) => ({
            ...tool,
            onClick: () => handleToolAction(tool.action),
        }))
    );

    // Handlers
    const handleInviteMembers = () => {
        console.log('Invite members clicked');
        // TODO: Open invite modal
    };

    const handleManageStorage = () => {
        console.log('Manage storage clicked');
        // TODO: Navigate to storage management
    };

    return (
        <main className='flex flex-1 flex-col gap-6 py-6 px-8 w-full max-w-full bg-white'>
            <TeamUsageSection
                licenseData={licenseData}
                storageData={storageData}
                onInviteClick={handleInviteMembers}
                onManageStorageClick={handleManageStorage}
            />

            <ToolsSection
                tools={toolsWithHandlers}
                description={DASHBOARD_TEXTS.tools.description}
            />
        </main>
    );
};

export default DashboardContent;