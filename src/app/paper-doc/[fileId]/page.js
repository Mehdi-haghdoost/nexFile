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


// "use client";

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useFolders } from '@/hooks/files/createFileModal/useFolders';
// import useModalStore from '@/store/ui/modalStore';

// import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
// import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
// import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

// const PaperDocPage = () => {
//     const router = useRouter();
//     const params = useParams();

//     const { folders = [], isLoading } = useFolders();
//     const { openModal } = useModalStore();

//     const [mounted, setMounted] = useState(false);

//     const [selectedFolder, setSelectedFolder] = useState(null);
//     const [openedFolderId, setOpenedFolderId] = useState(null);

//     const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//     const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//     const [documentContent, setDocumentContent] = useState('');

//     const fileId = params?.fileId;

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     useEffect(() => {
//         if (!folders?.length) return;

//         if (!selectedFolder) {
//             setSelectedFolder(folders[0]);
//             setOpenedFolderId(folders[0]?.id || null);
//         }
//     }, [folders, selectedFolder]);

//     const handleFolderSelect = (folder) => {
//         if (!folder) return;

//         setSelectedFolder(folder);

//         setOpenedFolderId((prevId) =>
//             prevId === folder.id ? null : folder.id
//         );

//         if (typeof window !== 'undefined' && window.innerWidth < 1024) {
//             setIsMobileSidebarOpen(false);
//         }
//     };

//     const handleBackToHome = () => {
//         router.push('/home');
//     };

//     const handleCollapseSidebar = () => {
//         setIsSidebarCollapsed((prev) => !prev);
//     };

//     const handleToggleMobileSidebar = () => {
//         setIsMobileSidebarOpen((prev) => !prev);

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
//         openModal('shareFolder', {
//             documentTitle: 'Daily Task',
//             folderName: selectedFolder?.name || '',
//             fileId,
//         });
//     };

//     if (!mounted) {
//         return null;
//     }

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <p className="text-regular-16">
//                     Loading document...
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen overflow-hidden">
//             {isMobileSidebarOpen && (
//                 <div
//                     className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//                     onClick={handleCloseMobileSidebar}
//                 />
//             )}

//             <div
//                 className={`
//                     fixed inset-y-0 left-0 z-50
//                     transform transition-transform duration-300 ease-in-out
//                     lg:relative lg:z-0
//                     ${
//                         isMobileSidebarOpen
//                             ? 'translate-x-0'
//                             : '-translate-x-full lg:translate-x-0'
//                     }
//                 `}
//             >
//                 <PaperDocSidebar
//                     folders={folders}
//                     selectedFolder={selectedFolder}
//                     openedFolderId={openedFolderId}
//                     onFolderSelect={handleFolderSelect}
//                     onBackToHome={handleBackToHome}
//                     onCollapseSidebar={handleCollapseSidebar}
//                     onCloseMobile={handleCloseMobileSidebar}
//                     isCollapsed={isSidebarCollapsed}
//                 />
//             </div>

//             <div className="flex flex-1 flex-col overflow-hidden">
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

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import useModalStore from '@/store/ui/modalStore';
import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

const PaperDocPage = () => {
    const router = useRouter();
    const params = useParams();
    const { folders = [], isLoading: foldersLoading } = useFolders();
    const { openModal } = useModalStore();

    const [mounted, setMounted] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Document state
    const [documentContent, setDocumentContent] = useState('');
    const [documentName, setDocumentName] = useState('Untitled');
    const [isFileLoading, setIsFileLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const fileId = params?.fileId;
    const autoSaveTimer = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Load file content
    useEffect(() => {
        if (!fileId) return;

        const loadFile = async () => {
            try {
                setIsFileLoading(true);
                const response = await fetch(`/api/files/paper/${fileId}`, {
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.success) {
                    setDocumentContent(data.file.content || '');
                    setDocumentName(data.file.name || 'Untitled');

                    // Set folder if file has one
                    if (data.file.folder && folders.length > 0) {
                        const folder = folders.find(f => f.id === data.file.folder);
                        if (folder) setSelectedFolder(folder);
                    }
                }
            } catch (error) {
                console.error('Error loading file:', error);
            } finally {
                setIsFileLoading(false);
            }
        };

        loadFile();
    }, [fileId]);

    // Auto-save on content change
    useEffect(() => {
        if (!fileId || isFileLoading || !mounted) return;

        if (autoSaveTimer.current) {
            clearTimeout(autoSaveTimer.current);
        }

        autoSaveTimer.current = setTimeout(async () => {
            await saveFile(documentContent, documentName);
        }, 2000); // auto-save after 2 seconds of no typing

        return () => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        };
    }, [documentContent, documentName]);

    const saveFile = async (content, name) => {
        if (!fileId) return;

        try {
            setIsSaving(true);
            const response = await fetch(`/api/files/paper/${fileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ content, name }),
            });

            const data = await response.json();
            if (data.success) {
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error('Error saving file:', error);
        } finally {
            setIsSaving(false);
        }
    };

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
        setOpenedFolderId(prev => prev === folder.id ? null : folder.id);
        if (window.innerWidth < 1024) setIsMobileSidebarOpen(false);
    };

    const handleBackToHome = () => router.push('/home');
    const handleCollapseSidebar = () => setIsSidebarCollapsed(prev => !prev);
    const handleToggleMobileSidebar = () => {
        setIsMobileSidebarOpen(prev => !prev);
        if (!isMobileSidebarOpen) setIsSidebarCollapsed(false);
    };
    const handleCloseMobileSidebar = () => setIsMobileSidebarOpen(false);

    // اضافه کن به handleShare بالاتر
    const handleNewDoc = async (folder) => {
        try {
            const response = await fetch('/api/files/paper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: 'Untitled Document',
                    folderId: folder?.id || null,
                }),
            });
            const data = await response.json();
            if (data.success) {
                router.push(`/paper-doc/${data.file.id}`);
            }
        } catch (error) {
            console.error('Error creating new doc:', error);
        }
    };


    const handleShare = () => openModal('shareFolder', {
        documentTitle: documentName,
        folderName: selectedFolder?.name || '',
        fileId,
    });

    if (!mounted) return null;

    if (isFileLoading || foldersLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
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

            <div className={`
                fixed inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                lg:relative lg:z-0
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <PaperDocSidebar
                    folders={folders}
                    selectedFolder={selectedFolder}
                    openedFolderId={openedFolderId}
                    onFolderSelect={handleFolderSelect}
                    onBackToHome={handleBackToHome}
                    onCollapseSidebar={handleCollapseSidebar}
                    onCloseMobile={handleCloseMobileSidebar}
                    isCollapsed={isSidebarCollapsed}
                    currentFileId={fileId}
                    onNewDoc={handleNewDoc}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    documentName={documentName}
                    onDocumentNameChange={setDocumentName}
                    onShareClick={handleShare}
                    onToggleSidebar={handleToggleMobileSidebar}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                />
                <DocumentEditor
                    content={documentContent}
                    onContentChange={setDocumentContent}
                />
            </div>
        </div>
    );
};

export default PaperDocPage;