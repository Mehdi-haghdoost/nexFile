// "use client";
// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation';
// import { useFolders } from '@/hooks/files/createFileModal/useFolders';
// import useModalStore from '@/store/ui/modalStore';
// import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
// import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
// import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

// const PaperDocPage = () => {
//     const router = useRouter();
//     const params = useParams();
//     const { folders, isLoading } = useFolders();
//     const { openModal } = useModalStore();

//     // UI State
//     const [selectedFolder, setSelectedFolder] = useState(null);
//     const [openedFolderId, setOpenedFolderId] = useState(1);
//     const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//     const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//     // Document State
//     const [documentContent, setDocumentContent] = useState('');

//     const fileId = params.fileId;

//     useEffect(() => {
//         if (folders && folders.length > 0 && !selectedFolder) {
//             setSelectedFolder(folders[0]);
//         }
//     }, [folders, selectedFolder]);

//     // const handleFolderSelect = (folder) => {
//     //     setSelectedFolder(folder);
//     //     setOpenedFolderId(prevId => (prevId === folder.id ? null : folder.id));
//     //     // Auto close sidebar on mobile
//     //     setIsMobileSidebarOpen(false);
//     // };
//     const handleFolderSelect = (folder) => {
//         setSelectedFolder(folder);
//         setOpenedFolderId(prevId => (prevId === folder.id ? null : folder.id));
//         // Fix: اضافه کردن typeof check
//         if (typeof window !== 'undefined' && window.innerWidth < 1024) {
//             setIsMobileSidebarOpen(false);
//         }
//     };

//     const handleBackToHome = () => {
//         router.push('/home');
//     };

//     const handleCollapseSidebar = () => {
//         setIsSidebarCollapsed(prev => !prev);
//     };

//     const handleToggleMobileSidebar = () => {
//         setIsMobileSidebarOpen(prev => !prev);
//         // وقتی sidebar موبایل باز میشه، حتماً expanded باشه
//         if (!isMobileSidebarOpen) {
//             setIsSidebarCollapsed(false);
//         }
//     };

//     const handleCloseMobileSidebar = () => {
//         setIsMobileSidebarOpen(false);
//     };

//     const handleContentChange = (newContent) => {
//         setDocumentContent(newContent);
//     };

//     const handleShare = () => {
//         const shareData = {
//             documentTitle: 'Daily Task',
//             folderName: selectedFolder ? selectedFolder.name : ''
//         };
//         openModal('shareFolder', shareData);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <p className="text-regular-16">Loading document...</p>
//             </div>
//         );
//     }

//     return (
//         <div className='flex overflow-hidden h-screen'>
//             {/* Sidebar Overlay */}
//             {isMobileSidebarOpen && (
//                 <div
//                     className='fixed inset-0 bg-black/50 z-40 lg:hidden'
//                     onClick={handleCloseMobileSidebar}
//                 />
//             )}

//             {/* Sidebar */}
//             <div className={`
//                 fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
//                 transform transition-transform duration-300 ease-in-out
//                 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//             `}>
//                 <PaperDocSidebar
//                     folders={folders}
//                     selectedFolder={selectedFolder}
//                     openedFolderId={openedFolderId}
//                     onFolderSelect={handleFolderSelect}
//                     onBackToHome={handleBackToHome}
//                     onCollapseSidebar={handleCollapseSidebar}
//                     isCollapsed={isSidebarCollapsed}
//                     onCloseMobile={handleCloseMobileSidebar}
//                 />
//             </div>

//             <div className="flex flex-col flex-1">
//                 <DocumentEditorHeader
//                     selectedFolder={selectedFolder}
//                     onShareClick={handleShare}
//                     onToggleSidebar={handleToggleMobileSidebar}
//                 />
//                 <DocumentEditor
//                     content={documentContent}
//                     onContentChange={handleContentChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PaperDocPage;


"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import useModalStore from '@/store/ui/modalStore';

import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

const PaperDocPage = () => {
    const router = useRouter();
    const params = useParams();

    const { folders = [], isLoading } = useFolders();
    const { openModal } = useModalStore();

    const [mounted, setMounted] = useState(false);

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(null);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [documentContent, setDocumentContent] = useState('');

    const fileId = params?.fileId;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!folders?.length) return;

        if (!selectedFolder) {
            setSelectedFolder(folders[0]);
            setOpenedFolderId(folders[0]?.id || null);
        }
    }, [folders, selectedFolder]);

    const handleFolderSelect = (folder) => {
        if (!folder) return;

        setSelectedFolder(folder);

        setOpenedFolderId((prevId) =>
            prevId === folder.id ? null : folder.id
        );

        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsMobileSidebarOpen(false);
        }
    };

    const handleBackToHome = () => {
        router.push('/home');
    };

    const handleCollapseSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    const handleToggleMobileSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);

        if (!isMobileSidebarOpen) {
            setIsSidebarCollapsed(false);
        }
    };

    const handleCloseMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const handleContentChange = (newContent) => {
        setDocumentContent(newContent);
    };

    const handleShare = () => {
        openModal('shareFolder', {
            documentTitle: 'Daily Task',
            folderName: selectedFolder?.name || '',
            fileId,
        });
    };

    if (!mounted) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-regular-16">
                    Loading document...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={handleCloseMobileSidebar}
                />
            )}

            <div
                className={`
                    fixed inset-y-0 left-0 z-50
                    transform transition-transform duration-300 ease-in-out
                    lg:relative lg:z-0
                    ${
                        isMobileSidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                    }
                `}
            >
                <PaperDocSidebar
                    folders={folders}
                    selectedFolder={selectedFolder}
                    openedFolderId={openedFolderId}
                    onFolderSelect={handleFolderSelect}
                    onBackToHome={handleBackToHome}
                    onCollapseSidebar={handleCollapseSidebar}
                    onCloseMobile={handleCloseMobileSidebar}
                    isCollapsed={isSidebarCollapsed}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    onShareClick={handleShare}
                    onToggleSidebar={handleToggleMobileSidebar}
                />

                <DocumentEditor
                    content={documentContent}
                    onContentChange={handleContentChange}
                />
            </div>
        </div>
    );
};

export default PaperDocPage;
