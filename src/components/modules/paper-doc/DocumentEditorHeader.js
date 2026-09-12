"use client";

import React, { useState } from 'react';
import { BellIcon, FilePlus01, FolderIcon, RedTrashIcon, SearchIcon, ShareIcon } from '@/components/ui/icons';

const DocumentEditorHeader = ({
    selectedFolder,
    documentName,
    onDocumentNameChange,
    onShareClick,
    onToggleSidebar,
    onNewDoc,
    onDeleteDoc,
    isCreatingDoc = false,
    isDeletingDoc = false,
    isSaving,
    lastSaved,
}) => {
    const [isEditingName, setIsEditingName] = useState(false);

    const formatLastSaved = (date) => {
        if (!date) return null;
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Saved just now';
        if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
        return `Saved ${Math.floor(diff / 3600)}h ago`;
    };

    // Creates a document in the folder currently selected in the sidebar
    const handleNewDoc = () => {
        if (isCreatingDoc) return;
        onNewDoc?.(selectedFolder);
    };

    // Deletes the document that is open right now
    const handleDeleteDoc = () => {
        if (isDeletingDoc) return;
        onDeleteDoc?.(null, selectedFolder, null);
    };

    return (
        <div className='flex items-center justify-between py-3 sm:py-4 md:py-[18px] px-3 sm:px-6 md:px-8 border-b border-[#F2F2F3] dark:border-neutral-800 bg-white dark:bg-neutral-900 self-stretch gap-2 sm:gap-3 '>
            {/* Left Section */}
            <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                {/* Hamburger Menu */}
                <button
                    onClick={onToggleSidebar}
                    className='lg:hidden p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors flex-shrink-0'
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6 text-neutral-500 dark:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Document Info */}
                <div className='flex flex-col justify-center items-start gap-0.5 min-w-0'>
                    {isEditingName ? (
                        <input
                            type="text"
                            value={documentName}
                            dir="auto"
                            onChange={(e) => onDocumentNameChange(e.target.value)}
                            onBlur={() => setIsEditingName(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                            autoFocus
                            className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white bg-transparent border-b border-primary-500 outline-none w-full'
                        />
                    ) : (
                        <h3
                            onClick={() => setIsEditingName(true)}
                            dir="auto"
                            className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate cursor-pointer hover:opacity-70'
                        >
                            {documentName || 'Untitled'}
                        </h3>
                    )}

                    <div className='flex items-center gap-2 min-w-0'>
                        <div className='flex items-center gap-1'>
                            <FolderIcon />
                            <span className='text-xs text-neutral-300 dark:text-neutral-400 truncate'>
                                {selectedFolder ? selectedFolder.name : 'No folder'}
                            </span>
                        </div>

                        {/* Save status */}
                        <span className='text-xs text-neutral-300 dark:text-neutral-500 flex-shrink-0'>
                            {isSaving ? 'Saving...' : lastSaved ? formatLastSaved(lastSaved) : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0'>
                <div className='flex items-center gap-2 sm:gap-3'>
                    <img
                        src="/images/nav_img.png"
                        className='hidden sm:block w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0'
                        alt="User avatar"
                    />
                    <button
                        onClick={onShareClick}
                        className='flex justify-center items-center gap-1.5 sm:gap-2.5 py-2 px-2 sm:py-[13px] sm:pr-4 sm:pl-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-primary hover:opacity-90 transition-opacity flex-shrink-0'
                    >
                        <ShareIcon />
                        <span className='hidden sm:inline text-xs sm:text-sm font-medium text-white'>Share</span>
                    </button>

                    {/* New doc - disabled while a creation request is running */}
                    <button
                        onClick={handleNewDoc}
                        disabled={isCreatingDoc || !selectedFolder}
                        title={selectedFolder ? `New document in ${selectedFolder.name}` : 'Select a folder first'}
                        className='hidden md:flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white dark:bg-dark-gradient dark:border-dark-border shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isCreatingDoc ? (
                            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FilePlus01 />
                        )}
                        <span className='text-sm font-medium text-neutral-500 dark:text-white'>New doc</span>
                    </button>
                </div>

                <svg className='hidden md:block' xmlns="http://www.w3.org/2000/svg" width="2" height="33" viewBox="0 0 2 33" fill="none">
                    <path d="M1 0.5V32.5" stroke="#F1F1F3" className='dark:stroke-[#212127]' />
                </svg>

                <div className='hidden sm:flex items-center gap-2 sm:gap-3'>
                    {/* Delete the open document */}
                    {onDeleteDoc && (
                        <button
                            onClick={handleDeleteDoc}
                            disabled={isDeletingDoc}
                            title="Delete document"
                            aria-label="Delete document"
                            className='flex w-7 h-7 sm:w-8 sm:h-8 justify-center items-center rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isDeletingDoc ? (
                                <div className="w-3.5 h-3.5 border-2 border-error-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <RedTrashIcon />
                            )}
                        </button>
                    )}

                    <button className='flex w-7 h-7 sm:w-8 sm:h-8 justify-center items-center rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0'>
                        <SearchIcon />
                    </button>
                    <div className='relative'>
                        <button className='flex w-7 h-7 sm:w-8 sm:h-8 justify-center items-center rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0'>
                            <BellIcon />
                        </button>
                        <svg className='absolute -top-0.5 -right-0.5' xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#BC1828" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorHeader;