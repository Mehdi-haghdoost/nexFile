'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TeamUsageSection from '@/components/modules/admin-console/dashboard/TeamUsageSection';
import ToolsSection from '@/components/modules/admin-console/dashboard/ToolsSection';
import useBilling from '@/hooks/admin/useBilling';
import useModalStore from '@/store/ui/modalStore';
import useHomeSectionStore, { HOME_SECTIONS } from '@/store/ui/homeSectionStore';
import {
    DASHBOARD_TOOLS,
    DASHBOARD_ACTIONS,
    DASHBOARD_TEXTS,
} from '@/utils/constants/Dashboardconstants';

const DashboardContent = () => {
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const setActiveSection = useHomeSectionStore((state) => state.setActiveSection);

    // Seat and storage figures come from the same source as the billing panel
    const { billing, isLoading } = useBilling();

    const handleToolAction = (action) => {
        switch (action) {
            case DASHBOARD_ACTIONS.OPEN_SEND_FILES:
                openModal('sendFile');
                break;
            case DASHBOARD_ACTIONS.OPEN_SHARE:
                openModal('shareFolder');
                break;
            case DASHBOARD_ACTIONS.OPEN_SIGNATURES:
                openModal('getSignatures');
                break;
            case DASHBOARD_ACTIONS.OPEN_FILE_REQUEST:
                openModal('fileRequest');
                break;
            case DASHBOARD_ACTIONS.OPEN_PDF_EDITOR:
                router.push('/pdf-editor');
                break;
            case DASHBOARD_ACTIONS.OPEN_TRANSFER:
                router.push('/transfer');
                break;
            default:
                break;
        }
    };

    const toolsWithHandlers = DASHBOARD_TOOLS.map((column) =>
        column.map((tool) => ({
            ...tool,
            onClick: () => handleToolAction(tool.action),
        }))
    );

    const handleInviteMembers = () => openModal('inviteMember');

    // Emptying the trash is the one storage action available, so the button
    // leaves the admin console for that section.
    const handleManageStorage = () => setActiveSection(HOME_SECTIONS.DELETED_FILES);

    return (
        <main className='flex flex-1 flex-col gap-6 py-6 px-8 w-full max-w-full bg-white dark:bg-neutral-900 dark:border-neutral-700'>
            <TeamUsageSection
                usage={billing?.usage}
                planName={billing?.plan?.name}
                isLoading={isLoading}
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