// import React from 'react';

// import {
//     CollapseSidebarIcon,
//     FileIcon,
//     HomeIcon,
// } from '@/components/ui/icons';

// import FolderItem from '@/components/modules/Modals/CreateFileModal/FolderItem';

// const PaperDocSidebar = ({
//     folders = [],
//     selectedFolder,
//     openedFolderId,
//     onFolderSelect,
//     onBackToHome,
//     onCollapseSidebar,
//     onCloseMobile,
//     isCollapsed = false,
// }) => {
//     const handleBackToHome = () => {
//         onBackToHome?.();
//     };

//     const handleCollapseSidebar = () => {
//         onCollapseSidebar?.();

//         if (
//             typeof window !== 'undefined' &&
//             window.innerWidth < 1024
//         ) {
//             onCloseMobile?.();
//         }
//     };

//     const sidebarClasses = `
//         flex flex-col items-start gap-8 flex-shrink-0
//         bg-white border-l border-r border-[#F2F2F3]
//         transition-[width,padding] duration-300 ease-in-out
//         overflow-hidden h-full
//         dark:bg-neutral-900 dark:border-neutral-800
//         ${isCollapsed ? 'w-12 p-2' : 'w-[267px] p-6'}
//     `.trim();

//     return (
//         <div className={sidebarClasses}>
//             <div
//                 className={`
//                     flex items-center h-[42px] gap-2 flex-shrink-0
//                     ${isCollapsed ? 'justify-center' : 'self-stretch'}
//                 `}
//             >
//                 {isCollapsed ? (
//                     <button
//                         onClick={handleCollapseSidebar}
//                         className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
//                     >
//                         <div className="rotate-180 transition-transform duration-300">
//                             <CollapseSidebarIcon />
//                         </div>
//                     </button>
//                 ) : (
//                     <>
//                         <button
//                             onClick={handleBackToHome}
//                             className="flex flex-1 items-center gap-2 text-start hover:opacity-70 transition-opacity"
//                         >
//                             <HomeIcon />

//                             <h2 className="text-medium-16 dark:text-medium-16-white flex-1">
//                                 Back to home
//                             </h2>
//                         </button>

//                         <button
//                             onClick={handleCollapseSidebar}
//                             className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
//                         >
//                             <CollapseSidebarIcon />
//                         </button>
//                     </>
//                 )}
//             </div>

//             <div
//                 className={`
//                     flex flex-col items-start gap-1
//                     self-stretch flex-1 overflow-y-auto custom-scrollbar
//                     transition-opacity duration-200
//                     ${isCollapsed
//                         ? 'opacity-0'
//                         : 'opacity-100 delay-150'
//                     }
//                 `}
//             >
//                 {folders.map((folder) => (
//                     <div
//                         key={folder.id}
//                         className="w-full"
//                     >
//                         <FolderItem
//                             folder={folder}
//                             isSelected={
//                                 selectedFolder?.id === folder.id
//                             }
//                             onSelect={onFolderSelect}
//                             showDivider={false}
//                             isExpanded={
//                                 openedFolderId === folder.id
//                             }
//                         />

//                         <div
//                             className={`
//                                 overflow-hidden transition-all duration-300 ease-in-out
//                                 ${
//                                     openedFolderId === folder.id
//                                         ? 'max-h-32 opacity-100'
//                                         : 'max-h-0 opacity-0'
//                                 }
//                             `}
//                         >
//                             <div className="flex flex-col items-start py-0 px-[19px] self-stretch">
//                                 <div
//                                     className="
//                                         flex items-center py-2 px-3 gap-2.5
//                                         w-[181px] self-stretch
//                                         rounded-lg
//                                     "
//                                 >
//                                     <FileIcon />

//                                     <div className="flex items-center gap-1.5 flex-1">
//                                         <h3 className="text-regular-14 dark:text-regular-12-neutral-200">
//                                             {folder.filesCount || 0} files
//                                         </h3>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PaperDocSidebar;

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CollapseSidebarIcon, FileIcon, HomeIcon } from '@/components/ui/icons';
import FolderItem from '@/components/modules/Modals/CreateFileModal/FolderItem';

const PaperDocSidebar = ({
    folders = [],
    selectedFolder,
    openedFolderId,
    onFolderSelect,
    onBackToHome,
    onCollapseSidebar,
    onCloseMobile,
    isCollapsed = false,
    currentFileId,
    onNewDoc,
}) => {
    const router = useRouter();
    const [folderFiles, setFolderFiles] = useState({});
    const [loadingFolders, setLoadingFolders] = useState({});

    // Load paper files for a folder when it's opened
    useEffect(() => {
        if (!openedFolderId) return;
        loadFolderFiles(openedFolderId);
    }, [openedFolderId]);

    const loadFolderFiles = async (folderId) => {
        if (folderFiles[folderId]) return; // already loaded

        setLoadingFolders(prev => ({ ...prev, [folderId]: true }));
        try {
            const response = await fetch(
                `/api/files/paper?folderId=${folderId}`,
                { credentials: 'include' }
            );
            const data = await response.json();
            if (data.success) {
                setFolderFiles(prev => ({ ...prev, [folderId]: data.files }));
            }
        } catch (error) {
            console.error('Error loading folder files:', error);
        } finally {
            setLoadingFolders(prev => ({ ...prev, [folderId]: false }));
        }
    };

    const handleBackToHome = () => onBackToHome?.();

    const handleCollapseSidebar = () => {
        onCollapseSidebar?.();
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            onCloseMobile?.();
        }
    };

    const sidebarClasses = `
        flex flex-col items-start gap-8 flex-shrink-0
        bg-white border-l border-r border-[#F2F2F3]
        transition-[width,padding] duration-300 ease-in-out
        overflow-hidden h-full
        dark:bg-neutral-900 dark:border-neutral-800
        ${isCollapsed ? 'w-12 p-2' : 'w-[267px] p-6'}
    `.trim();

    return (
        <div className={sidebarClasses}>
            {/* Header */}
            <div className={`flex items-center h-[42px] gap-2 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch'}`}>
                {isCollapsed ? (
                    <button
                        onClick={handleCollapseSidebar}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <div className="rotate-180 transition-transform duration-300">
                            <CollapseSidebarIcon />
                        </div>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleBackToHome}
                            className="flex flex-1 items-center gap-2 text-start hover:opacity-70 transition-opacity"
                        >
                            <HomeIcon />
                            <h2 className="text-medium-16 dark:text-medium-16-white flex-1">Back to home</h2>
                        </button>
                        <button
                            onClick={handleCollapseSidebar}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <CollapseSidebarIcon />
                        </button>
                    </>
                )}
            </div>

            {/* Folders List */}
            <div className={`
                flex flex-col items-start gap-1 self-stretch flex-1 overflow-y-auto custom-scrollbar
                transition-opacity duration-200
                ${isCollapsed ? 'opacity-0' : 'opacity-100 delay-150'}
            `}>
                {folders.map((folder) => (
                    <div key={folder.id} className="w-full">
                        <FolderItem
                            folder={folder}
                            isSelected={selectedFolder?.id === folder.id}
                            onSelect={onFolderSelect}
                            showDivider={false}
                            isExpanded={openedFolderId === folder.id}
                        />

                        {/* Paper files in folder */}
                        <div className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${openedFolderId === folder.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                            <div className="flex flex-col items-start py-1 px-[19px] self-stretch gap-1">
                                {loadingFolders[folder.id] ? (
                                    <div className="flex justify-center w-full py-2">
                                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        {(folderFiles[folder.id] || []).map((file) => (
                                            <button
                                                key={file.id}
                                                onClick={() => router.push(`/paper-doc/${file.id}`)}
                                                className={`flex items-center py-2 px-3 gap-2 w-full rounded-lg cursor-pointer transition-colors ${
                                                    currentFileId === file.id
                                                        ? 'bg-primary-50 dark:bg-primary-900/20'
                                                        : 'hover:bg-gray-50 dark:hover:bg-dark-overlay'
                                                }`}
                                            >
                                                <FileIcon />
                                                <span className="text-regular-14 dark:text-regular-12-neutral-200 truncate flex-1 text-left">
                                                    {file.name}
                                                </span>
                                            </button>
                                        ))}

                                        {/* New Doc button */}
                                        {onNewDoc && (
                                            <button
                                                onClick={() => onNewDoc(folder)}
                                                className="flex items-center py-2 px-3 gap-2 w-full rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                            >
                                                <span className="text-lg leading-none">+</span>
                                                <span className="text-xs">New document</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaperDocSidebar;