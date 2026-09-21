import FileIcon from '@/components/ui/FileIcon';
import { formatBytes } from '@/utils/transfers/formatBytes';

const TransferDetailsFiles = ({ files = [] }) => {
    return (
        <div className='flex flex-col overflow-hidden rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-800'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>Files</h2>
                <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
            </div>

            <ul className='flex flex-col'>
                {files.map((file, index) => (
                    <li
                        key={`${file.name}-${index}`}
                        className={`
                            flex items-center gap-3 px-4 py-3
                            ${index !== files.length - 1 ? 'border-b border-stroke-200 dark:border-neutral-700' : ''}
                        `}
                    >
                        <FileIcon extension={file.extension} />
                        <p dir='auto' className='flex-1 min-w-0 truncate text-sm text-neutral-500 dark:text-neutral-200'>
                            {file.name}
                        </p>
                        <span className='shrink-0 text-xs text-neutral-300 dark:text-neutral-400'>
                            {formatBytes(file.size)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransferDetailsFiles;