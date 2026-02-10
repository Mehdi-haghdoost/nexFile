"use client";

import { useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import { useFileActions } from '@/hooks/files/filesManagement/useFileActions';

const BulkActionsBar = ({ selectedFiles }) => {
    const { clearSelection } = useFilesStore();
    const [isLoading, setIsLoading] = useState(false);

    // Get first file for actions (we'll apply to all)
    const firstFile = selectedFiles[0];
    const { handleDelete, handleStar, handleMove, handleCopy, handleDownload } = useFileActions(firstFile);

    const selectedCount = selectedFiles.length;

    // ✅ Bulk Delete
    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedCount} file${selectedCount > 1 ? 's' : ''}?`)) return;
        
        setIsLoading(true);
        try {
            // TODO: Implement bulk delete API
            for (const file of selectedFiles) {
                await handleDelete();
            }
            clearSelection();
        } catch (error) {
            console.error('Bulk delete failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Bulk Star
    const handleBulkStar = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement bulk star API
            for (const file of selectedFiles) {
                await handleStar();
            }
            clearSelection();
        } catch (error) {
            console.error('Bulk star failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Bulk Move
    const handleBulkMove = () => {
        handleMove();
    };

    // ✅ Bulk Copy
    const handleBulkCopy = () => {
        handleCopy();
    };

    // ✅ Bulk Download
    const handleBulkDownload = async () => {
        setIsLoading(true);
        try {
            for (const file of selectedFiles) {
                await handleDownload();
            }
        } catch (error) {
            console.error('Bulk download failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700">
                {/* Selected Count */}
                <div className="flex items-center gap-2 pr-3 border-r border-gray-200 dark:border-neutral-700">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {selectedCount}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        selected
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Star */}
                    <button
                        onClick={handleBulkStar}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Star selected"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </button>

                    {/* Move */}
                    <button
                        onClick={handleBulkMove}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Move selected"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                    </button>

                    {/* Copy */}
                    <button
                        onClick={handleBulkCopy}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Copy selected"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>

                    {/* Download */}
                    <button
                        onClick={handleBulkDownload}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Download selected"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 dark:bg-neutral-700 mx-1"></div>

                    {/* Delete */}
                    <button
                        onClick={handleBulkDelete}
                        disabled={isLoading}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete selected"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>

                {/* Cancel */}
                <button
                    onClick={clearSelection}
                    className="ml-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default BulkActionsBar;