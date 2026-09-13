import FileIcon from '@/components/ui/FileIcon';
import { DownloadArrowIcon } from '@/components/ui/icons';
import { formatBytes } from '@/utils/transfers/formatBytes';

const PublicTransferFile = ({ file, isUnlocked }) => {
    return (
        <div className='flex items-center gap-3 p-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900'>
            <FileIcon extension={file.extension} />

            <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <p dir="auto" className='text-sm font-medium text-neutral-500 dark:text-white truncate'>
                    {file.name}
                </p>
                <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                    {formatBytes(file.size)}
                </p>
            </div>

            {/* An anchor rather than a button so the browser handles the download */}
            {isUnlocked && file.url ? (
                <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    title={`Download ${file.name}`}
                    aria-label={`Download ${file.name}`}
                    className='flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                >
                    <DownloadArrowIcon />
                </a>
            ) : (
                <div className='w-8 h-8 shrink-0' />
            )}
        </div>
    );
};

export default PublicTransferFile;