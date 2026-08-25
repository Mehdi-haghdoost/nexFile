// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/hooks/auth/useAuth';
// import AdminLayout from '@/components/layouts/Admin/AdminLayout';
// import AdminConsoleContent from '@/components/layouts/Home/admin-console/AdminConsoleContent';
// import AllFoldersContent from '@/components/layouts/Home/all-folders/AllFoldersContent';
// import DeletedFilesContent from '@/components/layouts/Home/deleted-files/DeletedFilesContent';
// import FileRequestsContent from '@/components/layouts/Home/file-requests/FileRequestsContent';
// import FileManagementLayout from '@/components/layouts/Home/FileManagementLayout';
// import SendAndMonitorContent from '@/components/layouts/Home/send-and-monitor/SendAndMonitorContent';
// import SharedContent from '@/components/layouts/Home/shared/SharedContent';
// import SignaturesContent from '@/components/layouts/Home/signatures/SignaturesContent';

// const Home = () => {
//     // Local to this component. Reading the global auth store during render
//     // is unsafe on the server, where the store is shared across requests.
//     const { isLoading } = useAuth({ requireAuth: true });
//     const [activeSection, setActiveSection] = useState('all-folders');

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
//                     <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     const renderContent = () => {
//         switch (activeSection) {
//             case 'admin-console':
//                 return (
//                     <AdminLayout onSidebarChange={setActiveSection}>
//                         {({ activeSection: adminSection }) => (
//                             <AdminConsoleContent activeSection={adminSection} />
//                         )}
//                     </AdminLayout>
//                 );
//             case 'all-folders':
//                 return <AllFoldersContent />;
//             case 'signatures':
//                 return <SignaturesContent />;
//             case 'send-and-monitor':
//                 return <SendAndMonitorContent />;
//             case 'shared':
//                 return <SharedContent />;
//             case 'file-requests':
//                 return <FileRequestsContent />;
//             case 'deleted-files':
//                 return <DeletedFilesContent />;
//             default:
//                 return <AllFoldersContent />;
//         }
//     };

//     if (activeSection === 'admin-console') {
//         return renderContent();
//     }

//     return (
//         <FileManagementLayout
//             onSidebarChange={setActiveSection}
//             activeSection={activeSection}
//         >
//             {renderContent()}
//         </FileManagementLayout>
//     );
// };

// export default Home;

'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import useHomeSectionStore, { HOME_SECTIONS } from '@/store/ui/homeSectionStore';
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
    // Local to this component. Reading the global auth store during render
    // is unsafe on the server, where the store is shared across requests.
    const { isLoading } = useAuth({ requireAuth: true });

    const activeSection = useHomeSectionStore((state) => state.activeSection);
    const setActiveSection = useHomeSectionStore((state) => state.setActiveSection);

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
            case HOME_SECTIONS.ADMIN_CONSOLE:
                return (
                    <AdminLayout onSidebarChange={setActiveSection}>
                        {({ activeSection: adminSection }) => (
                            <AdminConsoleContent activeSection={adminSection} />
                        )}
                    </AdminLayout>
                );
            case HOME_SECTIONS.ALL_FOLDERS:
                return <AllFoldersContent />;
            case HOME_SECTIONS.SIGNATURES:
                return <SignaturesContent />;
            case HOME_SECTIONS.SEND_AND_MONITOR:
                return <SendAndMonitorContent />;
            case HOME_SECTIONS.SHARED:
                return <SharedContent />;
            case HOME_SECTIONS.FILE_REQUESTS:
                return <FileRequestsContent />;
            case HOME_SECTIONS.DELETED_FILES:
                return <DeletedFilesContent />;
            default:
                return <AllFoldersContent />;
        }
    };

    // The admin console brings its own layout, so it replaces the shell
    if (activeSection === HOME_SECTIONS.ADMIN_CONSOLE) {
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