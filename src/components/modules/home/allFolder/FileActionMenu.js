'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { copyTextToClipboard } from '@/utils/clipboard';
import { useFolderActions } from '@/hooks/folders/useFolderActions';
import useModalStore from '@/store/ui/modalStore';
import {
    AccessLinkIcon,
    CopyIcon,
    CopyLinkIcon,
    LaunchIcon,
    MoreVerticalIcon,
    RedTrashIcon,
    RenameIcon,
    SettingsIcon,
} from '@/components/ui/icons';

const MENU_WIDTH = 190;
const VIEWPORT_MARGIN = 8;

// Action dropdown for a folder card, using fixed positioning so it
// escapes the grid's overflow.
const FolderActionMenu = ({ folder, onRename }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const router = useRouter();
    const { openModal } = useModalStore();
    const { deleteFolder, openMove, openCopy, busyId } = useFolderActions();

    const isBusy = busyId === folder.id;

    const updatePosition = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        // Clamped so a card at the right edge does not push the menu off screen
        const maxLeft = window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN;
        const left = Math.min(Math.max(rect.right - MENU_WIDTH, VIEWPORT_MARGIN), maxLeft);

        setCoords({ top: rect.bottom + 4, left });
    };

    useLayoutEffect(() => {
        if (isOpen) updatePosition();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (buttonRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
            setIsOpen(false);
        };
        const handleEscape = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        const handleReposition = () => updatePosition();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleReposition, true);
            window.removeEventListener('resize', handleReposition);
        };
    }, [isOpen]);

    const run = (fn) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(false);
        fn();
    };

    const handleCopyLink = async () => {
        const link = `${window.location.origin}/folder/${folder.id}`;
        const copied = await copyTextToClipboard(link);

        if (copied) {
            showSuccessToast('Link copied to clipboard');
        } else {
            showErrorToast('Could not copy the link');
        }
    };

    // Grouped so managing the folder is separated from sharing it, with delete alone at the end
    const actionGroups = [
        [
            { label: 'Open', onClick: () => router.push(`/folder/${folder.id}`), icon: <LaunchIcon /> },
            { label: 'Rename', onClick: () => onRename?.(), icon: <RenameIcon /> },
            { label: 'Move to', onClick: () => openMove(folder), icon: <CopyLinkIcon /> },
            { label: 'Make a copy', onClick: () => openCopy(folder), icon: <CopyIcon /> },
        ],
        [
            {
                label: 'Share',
                onClick: () => openModal('shareFolder', { fileName: folder.name, fileId: folder.id, fileType: 'folder' }),
                icon: <AccessLinkIcon />,
            },
            {
                label: 'Manage access',
                onClick: () => openModal('shareSettings', { fileName: folder.name, fileId: folder.id, fileType: 'folder' }),
                icon: <SettingsIcon />,
            },
            { label: 'Copy link', onClick: handleCopyLink, icon: <CopyLinkIcon /> },
        ],
        [
            { label: 'Delete', onClick: () => deleteFolder(folder), icon: <RedTrashIcon />, isDestructive: true },
        ],
    ];

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen((p) => !p);
                }}
                disabled={isBusy}
                aria-label={`Actions for ${folder.name}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`flex items-center justify-center rounded p-0.5 sm:p-1 transition-colors shrink-0 disabled:opacity-50
                    ${isOpen
                        ? 'bg-gray-200 dark:bg-neutral-600'
                        : 'hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
            >
                {isBusy ? (
                    <div className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-error-400 border-t-transparent' />
                ) : (
                    <MoreVerticalIcon height={14} />
                )}
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    style={{ top: coords.top, left: coords.left, width: MENU_WIDTH }}
                    className="fixed z-[9999] rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                >
                    {actionGroups.map((group, groupIndex) => (
                        <ul
                            key={groupIndex}
                            className={`py-1 ${groupIndex > 0 ? 'border-t border-stroke-200 dark:border-neutral-700' : ''}`}
                        >
                            {group.map((action) => (
                                <li key={action.label}>
                                    <button
                                        onClick={run(action.onClick)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800
                                            ${action.isDestructive ? 'text-error-400' : 'text-neutral-500 dark:text-white'}`}
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
                </div>
            )}
        </>
    );
};

export default FolderActionMenu;