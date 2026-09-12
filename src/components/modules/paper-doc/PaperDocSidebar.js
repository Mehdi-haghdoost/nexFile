"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronDownIcon,
    CollapseSidebarIcon,
    FileIcon,
    HistoryIcon,
    HomeIcon,
    OverviewIcon,
    RedTrashIcon,
} from '@/components/ui/icons';
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
    onDeleteDoc,
    isCreatingDoc = false,
    deletingFileId = null,
    filesVersion = 0,
    deletedDocs = [],
    isLoadingDeleted = false,
    busyDeletedId = null,
    onLoadDeleted,
    onRestoreDoc,
    onDestroyDoc,
}) => {
    const router = useRouter();
    const [folderFiles, setFolderFiles] = useState({});
    const [loadingFolders, setLoadingFolders] = useState({});
    const [isDeletedOpen, setIsDeletedOpen] = useState(false);

    // Tracks the last version we fetched with, so a create or delete forces a refetch
    const loadedVersion = useRef(filesVersion);

    useEffect(() => {
        if (!openedFolderId) return;

        const shouldForce = loadedVersion.current !== filesVersion;
        loadedVersion.current = filesVersion;
        loadFolderFiles(openedFolderId, shouldForce);
    }, [openedFolderId, filesVersion]);

    // Refreshes the deleted list whenever it is open and a document changes state
    useEffect(() => {
        if (!isDeletedOpen) return;
        onLoadDeleted?.();
    }, [isDeletedOpen, filesVersion]);

    const loadFolderFiles = async (folderId, force = false) => {
        // Cached lists are reused unless a refresh was explicitly requested
        if (!force && folderFiles[folderId]) return;

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

    // Picks the document to open next when the deleted one is currently on screen
    const handleDelete = (file, folder, list) => {
        const fallback = list.find((item) => item.id !== file.id);
        onDeleteDoc?.(file, folder, file.id === currentFileId ? fallback?.id || null : null);
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
                                        {(folderFiles[folder.id] || []).map((file, index, list) => (
                                            <div
                                                key={file.id}
                                                className={`group flex items-center w-full rounded-lg transition-colors ${
                                                    currentFileId === file.id
                                                        ? 'bg-primary-50 dark:bg-primary-900/20'
                                                        : 'hover:bg-gray-50 dark:hover:bg-dark-overlay'
                                                }`}
                                            >
                                                {/* Open the document */}
                                                <button
                                                    onClick={() => router.push(`/paper-doc/${file.id}`)}
                                                    className="flex items-center py-2 pl-3 pr-1 gap-2 flex-1 min-w-0 cursor-pointer"
                                                >
                                                    <FileIcon />
                                                    <span
                                                        dir="auto"
                                                        className="text-regular-14 dark:text-regular-12-neutral-200 truncate flex-1 text-left"
                                                    >
                                                        {file.name}
                                                    </span>
                                                </button>

                                                {/* Delete stays hidden until hover on desktop, always visible on touch */}
                                                {onDeleteDoc && (
                                                    <button
                                                        onClick={() => handleDelete(file, folder, list)}
                                                        disabled={deletingFileId === file.id}
                                                        title="Delete document"
                                                        aria-label={`Delete ${file.name}`}
                                                        className="flex items-center justify-center w-8 h-8 mr-1 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {deletingFileId === file.id ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-error-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <RedTrashIcon />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* New Doc button */}
                                        {onNewDoc && (
                                            <button
                                                onClick={() => onNewDoc(folder)}
                                                disabled={isCreatingDoc}
                                                className="flex items-center py-2 px-3 gap-2 w-full rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="text-lg leading-none">+</span>
                                                <span className="text-xs">
                                                    {isCreatingDoc ? 'Creating...' : 'New document'}
                                                </span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Deleted documents - restore or remove for good */}
            {!isCollapsed && onLoadDeleted && (
                <div className="flex flex-col self-stretch flex-shrink-0 border-t border-[#F2F2F3] dark:border-neutral-800 pt-3 -mt-4">
                    <button
                        onClick={() => setIsDeletedOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-2 py-2 w-full rounded-lg hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay transition-colors"
                    >
                        <RedTrashIcon />
                        <span className="text-xs font-medium text-neutral-500 dark:text-white flex-1 text-left">
                            Deleted documents
                        </span>
                        {isDeletedOpen ? <ChevronDownIcon /> : <OverviewIcon />}
                    </button>

                    <div className={`
                        overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out
                        ${isDeletedOpen ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                        <div className="flex flex-col items-start py-1 px-1 gap-1">
                            {isLoadingDeleted ? (
                                <div className="flex justify-center w-full py-3">
                                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : deletedDocs.length === 0 ? (
                                <p className="px-2 py-3 text-xs text-neutral-300 dark:text-neutral-400">
                                    Nothing deleted yet
                                </p>
                            ) : (
                                deletedDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center w-full gap-1 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-dark-overlay transition-colors"
                                    >
                                        <span
                                            dir="auto"
                                            title={doc.name}
                                            className="text-xs text-neutral-300 dark:text-neutral-400 truncate flex-1 text-left line-through"
                                        >
                                            {doc.name || 'Untitled'}
                                        </span>

                                        {busyDeletedId === doc.id ? (
                                            <div className="w-3.5 h-3.5 mx-2 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => onRestoreDoc?.(doc)}
                                                    title="Restore document"
                                                    aria-label={`Restore ${doc.name}`}
                                                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                                                >
                                                    <HistoryIcon />
                                                </button>

                                                <button
                                                    onClick={() => onDestroyDoc?.(doc)}
                                                    title="Delete forever"
                                                    aria-label={`Delete ${doc.name} forever`}
                                                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                                                >
                                                    <RedTrashIcon />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaperDocSidebar;