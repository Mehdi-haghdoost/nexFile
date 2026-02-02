"use client";

import React from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast } from '@/lib/toast';

const InfoModal = () => {
    const { modals, closeModal } = useModalStore();

    console.log('📊 All modals:', modals);
    console.log('📊 itemInfo modal:', modals?.itemInfo);

    const { isOpen, data } = modals.itemInfo || {};

    console.log('📊 InfoModal state:', { isOpen, data });

    const handleClose = () => {
        closeModal('itemInfo');
    };

    const handleCopyUrl = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            showSuccessToast('URL copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMimeTypeLabel = (mimeType) => {
        if (!mimeType) return 'Unknown';
        const types = {
            'text/plain': 'Text Document',
            'application/pdf': 'PDF Document',
            'image/jpeg': 'JPEG Image',
            'image/png': 'PNG Image',
            'image/gif': 'GIF Image',
            'application/zip': 'ZIP Archive',
            'application/vnd.nexfile.document': 'NexFile Document',
        };
        return types[mimeType] || mimeType;
    };

    if (!data) return null;

    const isFolder = !data.mimeType;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='560px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                            {isFolder ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                                    <path d="M9.75 5.25L8.91334 3.57669C8.67255 3.0951 8.55215 2.8543 8.37253 2.67837C8.21368 2.5228 8.02224 2.40448 7.81206 2.33198C7.57437 2.25 7.30516 2.25 6.76672 2.25H3.9C3.05992 2.25 2.63988 2.25 2.31901 2.41349C2.03677 2.5573 1.8073 2.78677 1.66349 3.06901C1.5 3.38988 1.5 3.80992 1.5 4.65V5.25M1.5 5.25H12.9C14.1601 5.25 14.7902 5.25 15.2715 5.49524C15.6948 5.71095 16.039 6.05516 16.2548 6.47852C16.5 6.95982 16.5 7.58988 16.5 8.85V12.15C16.5 13.4101 16.5 14.0402 16.2548 14.5215C16.039 14.9448 15.6948 15.289 15.2715 15.5048C14.7902 15.75 14.1601 15.75 12.9 15.75H5.1C3.83988 15.75 3.20982 15.75 2.72852 15.5048C2.30516 15.289 1.96095 14.9448 1.74524 14.5215C1.5 14.0402 1.5 13.4101 1.5 12.15V5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                    <path d="M11.6667 1.66675H5.00004C4.55801 1.66675 4.13409 1.84234 3.82153 2.1549C3.50897 2.46746 3.33337 2.89139 3.33337 3.33341V16.6667C3.33337 17.1088 3.50897 17.5327 3.82153 17.8453C4.13409 18.1578 4.55801 18.3334 5.00004 18.3334H15C15.4421 18.3334 15.866 18.1578 16.1786 17.8453C16.4911 17.5327 16.6667 17.1088 16.6667 16.6667V6.66675L11.6667 1.66675Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.6667 1.66675V6.66675H16.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isFolder ? 'Folder Info' : 'File Info'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5 truncate max-w-[300px]">
                                {data.name || data.originalName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* File/Folder Specific Info */}
                    {isFolder ? (
                        <>
                            {/* Folder Name */}
                            <InfoRow label="Name" value={data.name} />

                            {/* Description */}
                            {data.description && (
                                <InfoRow label="Description" value={data.description} />
                            )}

                            {/* Color */}
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">Color</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-700 shadow-sm"
                                        style={{ backgroundColor: data.color }}
                                    />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {data.color}
                                    </span>
                                </div>
                            </div>

                            {/* Contents */}
                            <InfoRow
                                label="Contents"
                                value={`${data.filesCount || 0} files, ${data.subFoldersCount || 0} folders`}
                            />

                            {/* Total Size */}
                            <InfoRow label="Total Size" value={formatBytes(data.totalSize)} />

                            {/* Last Activity */}
                            <InfoRow label="Last Activity" value={formatDate(data.lastActivity)} />

                            {/* Shared With */}
                            <InfoRow
                                label="Shared With"
                                value={data.sharedWith?.length > 0 ? `${data.sharedWith.length} users` : 'Not shared'}
                            />

                            {/* Status */}
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">Status</span>
                                <div className="flex items-center gap-2">
                                    {data.isStarred && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
                                            ⭐ Starred
                                        </span>
                                    )}
                                    {data.isArchived && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs font-medium rounded">
                                            📦 Archived
                                        </span>
                                    )}
                                    {!data.isStarred && !data.isArchived && (
                                        <span className="text-sm text-gray-500 dark:text-neutral-400">—</span>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* File Name */}
                            <InfoRow label="Name" value={data.originalName || data.name} />

                            {/* Type */}
                            <InfoRow label="Type" value={getMimeTypeLabel(data.mimeType)} />

                            {/* Size */}
                            <InfoRow label="Size" value={formatBytes(data.size)} />

                            {/* Extension */}
                            {data.extension && (
                                <InfoRow label="Extension" value={`.${data.extension.toUpperCase()}`} />
                            )}

                            {/* Downloads */}
                            <InfoRow label="Downloads" value={data.downloadCount || 0} />

                            {/* Last Downloaded */}
                            {data.lastDownloadedAt && (
                                <InfoRow label="Last Downloaded" value={formatDate(data.lastDownloadedAt)} />
                            )}

                            {/* Status */}
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">Status</span>
                                <div className="flex items-center gap-2">
                                    {data.isStarred && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
                                            ⭐ Starred
                                        </span>
                                    )}
                                    {data.isPublic && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                                            🌐 Public
                                        </span>
                                    )}
                                    {!data.isStarred && !data.isPublic && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs font-medium rounded">
                                            🔒 Private
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Shared With */}
                            <InfoRow
                                label="Shared With"
                                value={data.sharedWith?.length > 0 ? `${data.sharedWith.length} users` : 'Not shared'}
                            />

                            {/* URL */}
                            {data.secureUrl && (
                                <div className="py-3 px-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">URL</span>
                                        <button
                                            onClick={() => handleCopyUrl(data.secureUrl)}
                                            className="text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-neutral-500 break-all">
                                        {data.secureUrl}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Common Info */}
                    <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
                        <InfoRow label="Created" value={formatDate(data.createdAt)} />
                        <InfoRow label="Modified" value={formatDate(data.updatedAt)} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all font-medium shadow-lg shadow-primary-500/30"
                    >
                        Close
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

// Helper Component
const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
        <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white text-right ml-4">{value}</span>
    </div>
);

export default InfoModal;