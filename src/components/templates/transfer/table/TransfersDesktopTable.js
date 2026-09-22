import FileIcon from '@/components/ui/FileIcon';
import { formatDate } from '@/utils/transfers/formatDates';
import {
    TransferActionButton,
    TransferLockBadge,
    getFirstFileExtension,
    getRowTone,
} from './TransferRowParts';

const HEADERS = ['Group name', 'Created', 'Expiration', 'Download', 'Views', 'Action'];

const TransfersDesktopTable = ({ transfers, deletingId, openMenuId, onRowClick, onToggleMenu }) => {
    const mutedText = 'text-regular-14 text-neutral-400 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300';
    const strongText = 'text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300';

    return (
        <div className='hidden lg:block w-full'>
            <table className='w-full border-collapse'>
                <thead>
                    <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
                        {HEADERS.map((header) => (
                            <th key={header} className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer) => (
                        <tr
                            key={transfer.id}
                            onClick={() => onRowClick(transfer)}
                            className={`border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group ${getRowTone(transfer)}`}
                        >
                            <td className='py-4 px-4'>
                                <div className='flex items-center gap-3'>
                                    <FileIcon extension={getFirstFileExtension(transfer)} />
                                    <div className='flex flex-col gap-0.5 min-w-0'>
                                        <div className='flex items-center gap-1.5 min-w-0'>
                                            <p dir="auto" className={`${strongText} truncate`}>{transfer.groupName}</p>
                                            <TransferLockBadge transfer={transfer} />
                                        </div>
                                        <p className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>
                                            {transfer.filesCount} files
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className='py-4 px-4'>
                                <p className={mutedText}>{formatDate(transfer.createdAt)}</p>
                            </td>
                            <td className='py-4 px-4'>
                                <p className={mutedText}>{formatDate(transfer.expirationDate)}</p>
                            </td>
                            <td className='py-4 px-4'>
                                <div className='flex items-center gap-2'>
                                    <span className={strongText}>{transfer.downloadCount}</span>
                                    <span className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>
                                        downloads
                                    </span>
                                </div>
                            </td>
                            <td className='py-4 px-4'>
                                <span className={strongText}>{transfer.viewCount}</span>
                            </td>
                            <td className='py-4 px-4'>
                                <TransferActionButton
                                    transfer={transfer}
                                    size='md'
                                    isDeleting={deletingId === transfer.id}
                                    isMenuOpen={openMenuId === transfer.id}
                                    onToggleMenu={onToggleMenu}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransfersDesktopTable;