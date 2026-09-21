"use client";

import { useState } from 'react';
import FileIcon from '@/components/ui/FileIcon';
import { ClockIcon, MoreVerticalIcon, TransferLockIcon, ViewIcon } from '@/components/ui/icons';
import TransferActionMenu from '@/components/modules/transfer/TransferActionMenu';

const TransfersTable = ({ transfers, onOpenDetails, onCopyLink, onOpenLink, onDelete, deletingId }) => {
  // Holds the open row's id plus the trigger rect the portalled menu positions from
  const [openMenu, setOpenMenu] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getFirstFileExtension = (transfer) => {
    if (transfer.files && transfer.files.length > 0) {
      return transfer.files[0].extension || 'file';
    }
    return 'file';
  };

  const toggleMenu = (event, transferId) => {
    // Rows are clickable, so the trigger must not also fire the row handler
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenu((prev) => (prev?.id === transferId ? null : { id: transferId, rect }));
  };

  const closeMenu = () => setOpenMenu(null);

  // Shared trigger so all three layouts open the same menu
  const renderActionButton = (transfer, size = 'md') => (
    <button
      className={`
        flex items-center justify-center shadow-custom border border-stroke-200 dark:border-neutral-600
        bg-white dark:bg-neutral-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-600
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        ${size === 'md' ? 'w-8 h-8 p-1 hover:scale-105 group-hover:shadow-middle' : 'w-7 h-7'}
      `}
      onClick={(event) => toggleMenu(event, transfer.id)}
      disabled={deletingId === transfer.id}
      aria-label={`Actions for ${transfer.groupName}`}
      aria-expanded={openMenu?.id === transfer.id}
    >
      {deletingId === transfer.id ? (
        <div className='w-3.5 h-3.5 border-2 border-error-400 border-t-transparent rounded-full animate-spin' />
      ) : (
        <MoreVerticalIcon height={size === 'md' ? 12 : 10} />
      )}
    </button>
  );

  // Recipients need a password for this one, so the sender should see it at a glance
  const renderLockBadge = (transfer, size = 14) => {
    if (!transfer.isPasswordEnabled) return null;

    return (
      <span
        title="Password protected"
        aria-label="Password protected"
        className='shrink-0 flex items-center'
      >
        <TransferLockIcon size={size} />
      </span>
    );
  };

  // Download and view counts share a layout across the compact views
  const renderStat = (value, Icon) => (
    <div className='flex items-center gap-1'>
      <Icon size={12} />
      <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{value}</span>
    </div>
  );

  // Expired transfers are dimmed so the status is readable without a badge column
  const getRowTone = (transfer) => (transfer.status === 'expired' ? 'opacity-60' : '');

  const openTransfer = transfers.find((item) => item.id === openMenu?.id);

  return (
    <div className='flex flex-col gap-4 self-stretch w-full overflow-x-hidden'>
      {/* Desktop Table - 1024px+ */}
      <div className='hidden lg:block w-full'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Group name</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Created</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Expiration</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Download</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Views</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Action</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                onClick={() => onOpenDetails?.(transfer)}
                className={`border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group ${getRowTone(transfer)}`}
              >
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-3'>
                    <FileIcon extension={getFirstFileExtension(transfer)} />
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <div className='flex items-center gap-1.5 min-w-0'>
                        <p dir="auto" className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300 truncate'>{transfer.groupName}</p>
                        {renderLockBadge(transfer)}
                      </div>
                      <p className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>{transfer.filesCount} files</p>
                    </div>
                  </div>
                </td>
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-neutral-400 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{formatDate(transfer.createdAt)}</p>
                </td>
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-neutral-400 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{formatDate(transfer.expirationDate)}</p>
                </td>
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{transfer.downloadCount}</span>
                    <span className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>downloads</span>
                  </div>
                </td>
                <td className='py-4 px-4'>
                  <span className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{transfer.viewCount}</span>
                </td>
                <td className='py-4 px-4'>
                  {renderActionButton(transfer, 'md')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Compact Table - 640px to 1024px */}
      <div className='hidden sm:block lg:hidden w-full'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Group</th>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Dates</th>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Stats</th>
              <th className='text-right py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Act</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                onClick={() => onOpenDetails?.(transfer)}
                className={`border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-pointer group ${getRowTone(transfer)}`}
              >
                <td className='py-3 px-3'>
                  <div className='flex items-center gap-2'>
                    <div className='shrink-0'>
                      <FileIcon extension={getFirstFileExtension(transfer)} />
                    </div>
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <div className='flex items-center gap-1 min-w-0'>
                        <p dir="auto" className='text-xs font-medium text-neutral-500 dark:text-neutral-200 truncate'>{transfer.groupName}</p>
                        {renderLockBadge(transfer, 12)}
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
                    {renderStat(transfer.downloadCount, ClockIcon)}
                    {renderStat(transfer.viewCount, ViewIcon)}
                  </div>
                </td>
                <td className='py-3 px-3 text-right'>
                  {renderActionButton(transfer, 'sm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - <640px */}
      <div className='flex sm:hidden flex-col gap-0 w-full border border-stroke-300 dark:border-neutral-700 rounded-lg overflow-hidden'>
        {/* Mobile Header */}
        <div className='flex items-center justify-between py-2.5 px-3 bg-stroke-100 dark:bg-neutral-800 border-b border-stroke-200 dark:border-neutral-700'>
          <span className='text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Transfers</span>
          <span className='text-xs text-neutral-400 dark:text-neutral-400'>{transfers.length} items</span>
        </div>

        {/* Mobile Cards */}
        <div className='flex flex-col'>
          {transfers.map((transfer, index) => (
            <div 
              key={transfer.id}
              onClick={() => onOpenDetails?.(transfer)}
              className={`flex flex-col gap-3 p-3 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-pointer ${getRowTone(transfer)} ${
                index !== transfers.length - 1 ? 'border-b border-stroke-200 dark:border-neutral-700' : ''
              }`}
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <FileIcon extension={getFirstFileExtension(transfer)} />
                  <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5 min-w-0'>
                      <p dir="auto" className='text-sm font-medium text-neutral-500 dark:text-neutral-200 truncate'>{transfer.groupName}</p>
                      {renderLockBadge(transfer, 12)}
                    </div>
                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>{transfer.filesCount} files</p>
                  </div>
                </div>
                <div className='shrink-0'>
                  {renderActionButton(transfer, 'sm')}
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
                {renderStat(transfer.downloadCount, ClockIcon)}
                {renderStat(transfer.viewCount, ViewIcon)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* One menu instance for all three layouts, rendered outside the table */}
      {openTransfer && (
        <TransferActionMenu
          transfer={openTransfer}
          anchorRect={openMenu.rect}
          onOpenDetails={onOpenDetails}
          onCopyLink={onCopyLink}
          onOpenLink={onOpenLink}
          onDelete={onDelete}
          onClose={closeMenu}
        />
      )}
    </div>
  );
};

export default TransfersTable;