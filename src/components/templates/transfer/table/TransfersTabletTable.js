import FileIcon from '@/components/ui/FileIcon';
import { ClockIcon, ViewIcon } from '@/components/ui/icons';
import { formatDateShort } from '@/utils/transfers/formatDates';
import {
    TransferActionButton,
    TransferLockBadge,
    TransferStat,
    getFirstFileExtension,
    getRowTone,
} from './TransferRowParts';

const HEADERS = [
    { label: 'Group', align: 'text-left' },
    { label: 'Dates', align: 'text-left' },
    { label: 'Stats', align: 'text-left' },
    { label: 'Act', align: 'text-right' },
];

const TransfersTabletTable = ({ transfers, deletingId, openMenuId, onRowClick, onToggleMenu }) => {
    return (
        <div className='hidden sm:block lg:hidden w-full'>
            <table className='w-full border-collapse'>
                <thead>
                    <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
                        {HEADERS.map(({ label, align }) => (
                            <th key={label} className={`${align} py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300`}>
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer) => (
                        <tr
                            key={transfer.id}
                            onClick={() => onRowClick(transfer)}
                            className={`border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-pointer group ${getRowTone(transfer)}`}
                        >
                            <td className='py-3 px-3'>
                                <div className='flex items-center gap-2'>
                                    <div className='shrink-0'>
                                        <FileIcon extension={getFirstFileExtension(transfer)} />
                                    </div>
                                    <div className='flex flex-col gap-0.5 min-w-0'>
                                        <div className='flex items-center gap-1 min-w-0'>
                                            <p dir="auto" className='text-xs font-medium text-neutral-500 dark:text-neutral-200 truncate'>
                                                {transfer.groupName}
                                            </p>
                                            <TransferLockBadge transfer={transfer} size={12} />
                                        </div>
                                        <p className='text-xs text-neutral-300 dark:text-neutral-400'>{transfer.filesCount} files</p>
                                    </div>
                                </div>
                            </td>
                            <td className='py-3 px-3'>
                                <div className='flex flex-col gap-0.5'>
                                    <p className='text-xs text-neutral-400 dark:text-neutral-300'>{formatDateShort(transfer.createdAt)}</p>
                                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>→ {formatDateShort(transfer.expirationDate)}</p>
                                </div>
                            </td>
                            <td className='py-3 px-3'>
                                <div className='flex flex-col gap-1'>
                                    <TransferStat value={transfer.downloadCount} Icon={ClockIcon} />
                                    <TransferStat value={transfer.viewCount} Icon={ViewIcon} />
                                </div>
                            </td>
                            <td className='py-3 px-3 text-right'>
                                <TransferActionButton
                                    transfer={transfer}
                                    size='sm'
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

export default TransfersTabletTable;