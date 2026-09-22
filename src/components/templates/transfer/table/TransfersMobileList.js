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

const TransfersMobileList = ({ transfers, deletingId, openMenuId, onRowClick, onToggleMenu }) => {
    return (
        <div className='flex sm:hidden flex-col gap-0 w-full border border-stroke-300 dark:border-neutral-700 rounded-lg overflow-hidden'>
            <div className='flex items-center justify-between py-2.5 px-3 bg-stroke-100 dark:bg-neutral-800 border-b border-stroke-200 dark:border-neutral-700'>
                <span className='text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Transfers</span>
                <span className='text-xs text-neutral-400 dark:text-neutral-400'>{transfers.length} items</span>
            </div>

            <div className='flex flex-col'>
                {transfers.map((transfer, index) => (
                    <div
                        key={transfer.id}
                        onClick={() => onRowClick(transfer)}
                        className={`flex flex-col gap-3 p-3 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-pointer ${getRowTone(transfer)} ${
                            index !== transfers.length - 1 ? 'border-b border-stroke-200 dark:border-neutral-700' : ''
                        }`}
                    >
                        <div className='flex items-start justify-between gap-2'>
                            <div className='flex items-center gap-2 flex-1 min-w-0'>
                                <FileIcon extension={getFirstFileExtension(transfer)} />
                                <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                                    <div className='flex items-center gap-1.5 min-w-0'>
                                        <p dir="auto" className='text-sm font-medium text-neutral-500 dark:text-neutral-200 truncate'>
                                            {transfer.groupName}
                                        </p>
                                        <TransferLockBadge transfer={transfer} size={12} />
                                    </div>
                                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>{transfer.filesCount} files</p>
                                </div>
                            </div>
                            <div className='shrink-0'>
                                <TransferActionButton
                                    transfer={transfer}
                                    size='sm'
                                    isDeleting={deletingId === transfer.id}
                                    isMenuOpen={openMenuId === transfer.id}
                                    onToggleMenu={onToggleMenu}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <div className='flex flex-col gap-0.5'>
                                <p className='text-xs text-neutral-300 dark:text-neutral-400'>Created</p>
                                <p className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{formatDateShort(transfer.createdAt)}</p>
                            </div>
                            <div className='flex flex-col gap-0.5'>
                                <p className='text-xs text-neutral-300 dark:text-neutral-400'>Expires</p>
                                <p className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{formatDateShort(transfer.expirationDate)}</p>
                            </div>
                            <TransferStat value={transfer.downloadCount} Icon={ClockIcon} />
                            <TransferStat value={transfer.viewCount} Icon={ViewIcon} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransfersMobileList;