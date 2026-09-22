"use client";

import { useState } from 'react';
import TransferActionMenu from '@/components/modules/transfer/TransferActionMenu';
import TransfersDesktopTable from './table/TransfersDesktopTable';
import TransfersTabletTable from './table/TransfersTabletTable';
import TransfersMobileList from './table/TransfersMobileList';

const TransfersTable = ({
  transfers,
  isReceived = false,
  onOpenDetails,
  onCopyLink,
  onOpenLink,
  onDelete,
  deletingId,
}) => {
  // Holds the open row's id plus the trigger rect the portalled menu positions from
  const [openMenu, setOpenMenu] = useState(null);

  // A received transfer belongs to someone else, so its row opens the recipient view instead of details
  const handleRowClick = (transfer) => {
    const action = isReceived ? onOpenLink : onOpenDetails;
    action?.(transfer);
  };

  // Rows are clickable, so the trigger must not also fire the row handler
  const handleToggleMenu = (event, transferId) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenu((prev) => (prev?.id === transferId ? null : { id: transferId, rect }));
  };

  const closeMenu = () => setOpenMenu(null);

  const openTransfer = transfers.find((item) => item.id === openMenu?.id);

  const layoutProps = {
    transfers,
    deletingId,
    openMenuId: openMenu?.id,
    onRowClick: handleRowClick,
    onToggleMenu: handleToggleMenu,
  };

  return (
    <div className='flex flex-col gap-4 self-stretch w-full overflow-x-hidden'>
      <TransfersDesktopTable {...layoutProps} />
      <TransfersTabletTable {...layoutProps} />
      <TransfersMobileList {...layoutProps} />

      {/* One menu instance for all three layouts, rendered outside the table */}
      {openTransfer && (
        <TransferActionMenu
          transfer={openTransfer}
          anchorRect={openMenu.rect}
          onOpenDetails={isReceived ? null : onOpenDetails}
          onCopyLink={onCopyLink}
          onOpenLink={onOpenLink}
          onDelete={isReceived ? null : onDelete}
          onClose={closeMenu}
        />
      )}
    </div>
  );
};

export default TransfersTable;