'use client';
import React, { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import useModalStore from '@/store/ui/modalStore';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { copyTextToClipboard } from '@/utils/clipboard';
import { downloadFile } from '@/utils/files/downloadFile';
import { getItemPermissions } from '@/utils/sharing/itemPermissions';
import {
  LaunchIcon,
  CopyLinkIcon,
  AccessLinkIcon,
  SettingsIcon,
  ExportIcon,
  RedTrashIcon,
} from '@/components/ui/icons';

const MENU_WIDTH = 192;
const VIEWPORT_MARGIN = 8;
const MENU_GAP = 4;

// Where an item opens inside the app
export const getOpenPath = (item) => {
  if (item.type === 'folder') return `/folder/${item.id}`;
  if (item.mimeType === 'application/paper') return `/paper-doc/${item.id}`;
  return `/file/${item.id}`;
};

// The in-app link, which opens only for people with access
export const getItemLink = (item) => `${item.type === 'folder' ? '/folder' : '/file'}/${item.id}`;

// Below the button when it fits, above it otherwise, and always inside the screen
export const getMenuPosition = (buttonRect, menuHeight, viewport) => {
  const below = buttonRect.bottom + MENU_GAP;
  const above = buttonRect.top - MENU_GAP - menuHeight;
  const fitsBelow = below + menuHeight <= viewport.height - VIEWPORT_MARGIN;

  const rawTop = fitsBelow || above < VIEWPORT_MARGIN ? below : above;
  const maxTop = Math.max(viewport.height - menuHeight - VIEWPORT_MARGIN, VIEWPORT_MARGIN);
  const top = Math.min(Math.max(rawTop, VIEWPORT_MARGIN), maxTop);

  const maxLeft = viewport.width - MENU_WIDTH - VIEWPORT_MARGIN;
  const left = Math.max(Math.min(buttonRect.right - MENU_WIDTH, maxLeft), VIEWPORT_MARGIN);

  return { top, left, placement: fitsBelow || above < VIEWPORT_MARGIN ? 'below' : 'above' };
};

// Turns a refused or broken response into an error carrying the server's message
const readResult = async (response, fallback) => {
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) throw new Error(data?.message || fallback);
  return data;
};

// Action dropdown for one row of the Shared list; the server checks every action again
const SharedActionMenu = ({ item, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: 'below' });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const buttonId = useId();

  const router = useRouter();
  const { openModal } = useModalStore();

  const isFolder = item.type === 'folder';
  const isPaper = item.mimeType === 'application/paper';
  const { isOwner, canEdit } = getItemPermissions(item);

  const updatePosition = () => {
    if (!buttonRef.current || !menuRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const height = menuRef.current.offsetHeight;
    setCoords(getMenuPosition(rect, height, { width: window.innerWidth, height: window.innerHeight }));
  };

  const menuItems = () => Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || []);

  // Placed once the menu has a height, then the first action takes focus
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    menuItems()[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (buttonRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen]);

  const closeMenu = ({ returnFocus = false } = {}) => {
    setIsOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // Arrow keys, Home and End move between actions; Escape closes and returns to the button
  const handleMenuKeyDown = (e) => {
    const options = menuItems();
    const index = options.indexOf(document.activeElement);

    const moves = {
      ArrowDown: () => options[(index + 1) % options.length],
      ArrowUp: () => options[(index - 1 + options.length) % options.length],
      Home: () => options[0],
      End: () => options[options.length - 1],
    };

    if (moves[e.key]) {
      e.preventDefault();
      moves[e.key]()?.focus();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeMenu({ returnFocus: true });
      return;
    }

    if (e.key === 'Tab') closeMenu();
  };

  // A button press with the arrow keys opens the menu too
  const handleButtonKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const run = (fn) => (e) => {
    e.stopPropagation();
    closeMenu({ returnFocus: true });
    fn();
  };

  const modalData = { fileName: item.name, fileId: item.id, fileType: isFolder ? 'folder' : 'file' };

  const handleOpen = () => router.push(getOpenPath(item));

  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(`${window.location.origin}${getItemLink(item)}`);

    if (copied) {
      showSuccessToast('Link copied to clipboard');
    } else {
      showErrorToast('Could not copy the link');
    }
  };

  const handleDownload = async () => {
    setIsBusy(true);
    try {
      await downloadFile(item);
      showSuccessToast('Download started!');
    } catch (error) {
      // A dead session already redirects to login inside fetchWithAuth
      if (error.message !== 'Session expired') showErrorToast(error.message || 'Failed to download file');
    } finally {
      setIsBusy(false);
    }
  };

  // Asks first, sends one sharing change, then reloads the list
  const changeSharing = async ({ confirm, body, success, fallback }) => {
    const confirmed = await showConfirmDialog(confirm);
    if (!confirmed) return;

    setIsBusy(true);
    try {
      const response = await api.delete(`/api/files/${item.id}/share`, {
        body: JSON.stringify({ itemType: modalData.fileType, ...body }),
      });
      await readResult(response, fallback);

      showSuccessToast(success);
      onChange?.();
    } catch (error) {
      if (error.message !== 'Session expired') showErrorToast(error.message || fallback);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLeave = () =>
    changeSharing({
      confirm: {
        title: `Leave "${item.name}"?`,
        text: "You'll lose access unless someone shares it with you again.",
        confirmButtonText: 'Leave',
        cancelButtonText: 'Cancel',
      },
      body: { leave: true },
      success: 'You no longer have access',
      fallback: 'Failed to leave this item',
    });

  const handleRemoveAccess = () =>
    changeSharing({
      confirm: {
        title: `Stop sharing "${item.name}"?`,
        text: 'Everyone you shared it with loses access.',
        confirmButtonText: 'Remove access',
        cancelButtonText: 'Cancel',
      },
      body: { all: true },
      success: 'Sharing removed',
      fallback: 'Failed to remove access',
    });

  // Opening, sharing and giving up access in separate groups; empty groups are dropped
  const actionGroups = [
    [
      { label: 'Open', onClick: handleOpen, icon: <LaunchIcon /> },
      { label: 'Copy link', onClick: handleCopyLink, icon: <CopyLinkIcon /> },
      !isFolder && !isPaper && { label: 'Download', onClick: handleDownload, icon: <ExportIcon /> },
    ].filter(Boolean),
    [
      // The share modal applies Control permissions; Manage access stays with the owner
      canEdit && { label: 'Share', onClick: () => openModal('shareFolder', modalData), icon: <AccessLinkIcon /> },
      isOwner && { label: 'Manage access', onClick: () => openModal('shareSettings', modalData), icon: <SettingsIcon /> },
    ].filter(Boolean),
    [
      isOwner
        ? { label: 'Remove access', onClick: handleRemoveAccess, icon: <RedTrashIcon />, isDestructive: true }
        : { label: 'Leave', onClick: handleLeave, icon: <RedTrashIcon />, isDestructive: true },
    ],
  ].filter((group) => group.length > 0);

  return (
    <>
      <button
        ref={buttonRef}
        id={buttonId}
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleButtonKeyDown}
        disabled={isBusy}
        aria-label={`Actions for ${item.name}`}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className={`flex items-center justify-center w-8 h-8 p-1 shadow-custom border rounded cursor-pointer transition-all active:scale-95 disabled:opacity-50
          ${isOpen
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
            : 'border-[#F2F2F3] bg-white hover:bg-gray-50 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
          }`}
      >
        {isBusy ? (
          <div className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
            <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className="dark:fill-[#737379]" />
            <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className="dark:fill-[#737379]" />
            <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className="dark:fill-[#737379]" />
          </svg>
        )}
      </button>

      {/* Drawn on the page body, so the layout's stacking cannot put the navbar above it */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role='menu'
          aria-labelledby={buttonId}
          onKeyDown={handleMenuKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{ top: coords.top, left: coords.left, width: MENU_WIDTH }}
          className={`fixed z-[10000] rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden
            animate-in fade-in-0 zoom-in-95 duration-150 ${coords.placement === 'above' ? 'origin-bottom-right' : 'origin-top-right'}`}
        >
          {actionGroups.map((group, groupIndex) => (
            <ul
              key={groupIndex}
              role='none'
              className={`py-1 ${groupIndex > 0 ? 'border-t border-stroke-200 dark:border-neutral-700' : ''}`}
            >
              {group.map((action) => (
                <li key={action.label} role='none'>
                  <button
                    type='button'
                    role='menuitem'
                    tabIndex={-1}
                    onClick={run(action.onClick)}
                    disabled={isBusy}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150 outline-none disabled:opacity-50
                      ${action.isDestructive
                        ? 'text-error-400 hover:bg-error-400/10 focus:bg-error-400/10'
                        : 'text-neutral-500 dark:text-white hover:bg-[#F6F6F7] focus:bg-[#F6F6F7] dark:hover:bg-dark-overlay dark:focus:bg-dark-overlay'
                      }`}
                  >
                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default SharedActionMenu;