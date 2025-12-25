'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import AdminLayout from '@/components/layouts/Admin/AdminLayout';
import AdminConsoleContent from '@/components/layouts/Home/admin-console/AdminConsoleContent';
import AllFoldersContent from '@/components/layouts/Home/all-folders/AllFoldersContent';
import DeletedFilesContent from '@/components/layouts/Home/deleted-files/DeletedFilesContent';
import FileRequestsContent from '@/components/layouts/Home/file-requests/FileRequestsContent';
import FileManagementLayout from '@/components/layouts/Home/FileManagementLayout';
import SendAndMonitorContent from '@/components/layouts/Home/send-and-monitor/SendAndMonitorContent';
import SharedContent from '@/components/layouts/Home/shared/SharedContent';
import SignaturesContent from '@/components/layouts/Home/signatures/SignaturesContent';

const Home = () => {
    const { isLoading } = useAuth({ requireAuth: true });
    const [activeSection, setActiveSection] = useState('all-folders');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'admin-console':
                return (
                    <AdminLayout onSidebarChange={setActiveSection}>
                        {({ activeSection: adminSection }) => (
                            <AdminConsoleContent activeSection={adminSection} />
                        )}
                    </AdminLayout>
                );
            case 'all-folders':
                return <AllFoldersContent />;
            case 'signatures':
                return <SignaturesContent />;
            case 'send-and-monitor':
                return <SendAndMonitorContent />;
            case 'shared':
                return <SharedContent />;
            case 'file-requests':
                return <FileRequestsContent />;
            case 'deleted-files':
                return <DeletedFilesContent />;
            default:
                return <AllFoldersContent />;
        }
    };

    if (activeSection === 'admin-console') {
        return renderContent();
    }

    return (
        <FileManagementLayout
            onSidebarChange={setActiveSection}
            activeSection={activeSection}
        >
            {renderContent()}
        </FileManagementLayout>
    );
};

export default Home;