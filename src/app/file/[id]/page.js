'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FileIcon from '@/components/ui/FileIcon';
import { useFileDetails } from '@/hooks/files/FileDetails/useFileDetails';
import { downloadFile } from '@/utils/files/downloadFile';
import { getRoleLabel } from '@/utils/sharing/itemPermissions';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Where a file opens inside the app, or null when it has no editor
const getEditorPath = (file) => {
    if (file.mimeType === 'application/paper') return `/paper-doc/${file.id}`;
    if (file.extension === 'pdf' || file.mimeType === 'application/pdf') return `/pdf-editor/${file.id}`;
    return null;
};

const describeType = (file) => {
    if (file.mimeType === 'application/paper') return 'Paper doc';
    return file.extension ? file.extension.toUpperCase() : file.mimeType || 'File';
};

const Centered = ({ children }) => (
    <main className='flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-800 p-4'>
        <div className='flex w-full max-w-md flex-col gap-5 rounded-2xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow-light dark:shadow-dark-panel'>
            {children}
        </div>
    </main>
);

const BackHome = () => (
    <Link href='/home' className='text-sm text-primary-500 hover:underline self-center'>
        Back to home
    </Link>
);

// The page an in-app file link opens; it works only for the owner and people the file is shared with
const FilePage = () => {
    const params = useParams();
    const router = useRouter();
    const { file, isLoading, isNotFound, error } = useFileDetails(params?.id);
    const [isDownloading, setIsDownloading] = useState(false);

    if (isLoading) {
        return (
            <Centered>
                <div className='flex flex-col items-center gap-3 py-6'>
                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500' />
                    <p className='text-sm text-neutral-300 dark:text-neutral-400'>Loading file...</p>
                </div>
            </Centered>
        );
    }

    if (isNotFound || error || !file) {
        return (
            <Centered>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <h1 className='text-base font-medium text-neutral-500 dark:text-white'>
                        {error ? 'Could not load this file' : 'File not found'}
                    </h1>
                    <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                        {error || "It may have been deleted, or it isn't shared with you."}
                    </p>
                </div>
                <BackHome />
            </Centered>
        );
    }

    const editorPath = getEditorPath(file);
    const isPaper = file.mimeType === 'application/paper';

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadFile(file);
            showSuccessToast('Download started!');
        } catch (err) {
            // A dead session already redirects to login inside fetchWithAuth
            if (err.message !== 'Session expired') {
                showErrorToast(err.message || 'Failed to download file');
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const details = [
        { label: 'Type', value: describeType(file) },
        // A paper doc has no stored size worth showing
        !isPaper && { label: 'Size', value: formatBytes(file.size) },
        { label: 'Owner', value: file.isOwner ? 'You' : file.owner?.name || 'Unknown' },
        { label: 'Last updated', value: formatDate(file.updatedAt) },
        { label: 'Your access', value: getRoleLabel(file.role) },
    ].filter(Boolean);

    return (
        <Centered>
            <div className='flex items-center gap-3 min-w-0'>
                <div className='shrink-0'>
                    <FileIcon extension={file.extension} />
                </div>
                <h1 dir='auto' className='text-base md:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                    {file.originalName || file.name}
                </h1>
            </div>

            <dl className='flex flex-col gap-2'>
                {details.map((detail) => (
                    <div key={detail.label} className='flex items-center justify-between gap-4 text-sm'>
                        <dt className='text-neutral-300 dark:text-neutral-400'>{detail.label}</dt>
                        <dd dir='auto' className='text-neutral-500 dark:text-white truncate'>{detail.value}</dd>
                    </div>
                ))}
            </dl>

            <div className='flex flex-col sm:flex-row gap-2'>
                {editorPath && (
                    <button
                        onClick={() => router.push(editorPath)}
                        className='flex flex-1 justify-center items-center h-9 px-4 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-sm font-medium text-white hover:opacity-90 transition-opacity'
                    >
                        Open
                    </button>
                )}
                {/* Paper docs live in the app and have no stored file to download */}
                {!isPaper && (
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className='flex flex-1 justify-center items-center h-9 px-4 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                )}
            </div>

            <BackHome />
        </Centered>
    );
};

export default FilePage;