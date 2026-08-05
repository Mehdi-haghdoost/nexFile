'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import {
    LaunchIcon,
    CopyLinkIcon,
    AccessLinkIcon,
    SettingsIcon,
} from '@/components/ui/icons';

// Action dropdown for a folder card, using fixed positioning so it
// escapes the grid's overflow.
const FolderActionMenu = ({ folder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const router = useRouter();
    const { openModal } = useModalStore();
    const MENU_WIDTH = 176;

    const updatePosition = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH });
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
        fn();
        setIsOpen(false);
    };

    const handleOpen = () => {
        router.push(`/folder?id=${folder.id}`);
    };

    const handleShare = () => {
        openModal('shareFolder', {
            fileName: folder.name,
            fileId: folder.id,
            fileType: 'folder',
        });
    };

    const handleManageAccess = () => {
        openModal('shareSettings', {
            fileName: folder.name,
            fileId: folder.id,
            fileType: 'folder',
        });
    };

    const handleCopyLink = async () => {
        try {
            const link = `${window.location.origin}/folders/${folder.id}`;
            await navigator.clipboard.writeText(link);
            showSuccessToast('Link copied to clipboard!');
        } catch {
            showErrorToast('Failed to copy link');
        }
    };

    const actions = [
        { label: 'Open', onClick: handleOpen, icon: <LaunchIcon /> },
        { label: 'Share', onClick: handleShare, icon: <AccessLinkIcon /> },
        { label: 'Manage access', onClick: handleManageAccess, icon: <SettingsIcon /> },
        { label: 'Copy link', onClick: handleCopyLink, icon: <CopyLinkIcon /> },
    ];

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((p) => !p);
                }}
                aria-label={`Actions for ${folder.name}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`flex items-center justify-center rounded p-0.5 sm:p-1 transition-colors shrink-0
                    ${isOpen
                        ? 'bg-gray-200 dark:bg-neutral-600'
                        : 'hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 17 16" fill="none" className='sm:w-[17px] sm:h-4'>
                    <path d="M9.43329 3.33301C9.43329 3.79009 9.05732 4.16681 8.60028 4.16699C8.14309 4.16699 7.7663 3.7902 7.7663 3.33301C7.76647 2.87596 8.1432 2.5 8.60028 2.5C9.05722 2.50018 9.43311 2.87607 9.43329 3.33301Z" fill="#2E2E37" stroke="#2E2E37" className="dark:fill-white dark:stroke-white" />
                    <path d="M9.43329 12.6664C9.43329 13.1235 9.05732 13.5002 8.60028 13.5004C8.14309 13.5004 7.7663 13.1236 7.7663 12.6664C7.76647 12.2093 8.1432 11.8334 8.60028 11.8334C9.05722 11.8336 9.43311 12.2094 9.43329 12.6664Z" fill="#2E2E37" stroke="#2E2E37" className="dark:fill-white dark:stroke-white" />
                    <path d="M9.43329 7.99963C9.43329 8.45672 9.05732 8.83344 8.60028 8.83362C8.14309 8.83362 7.7663 8.45682 7.7663 7.99963C7.76647 7.54259 8.1432 7.16663 8.60028 7.16663C9.05722 7.1668 9.43311 7.5427 9.43329 7.99963Z" fill="#2E2E37" stroke="#2E2E37" className="dark:fill-white dark:stroke-white" />
                </svg>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    style={{ top: coords.top, left: coords.left, width: MENU_WIDTH }}
                    className="fixed z-[9999] rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className="py-1">
                        {actions.map((action) => (
                            <li key={action.label}>
                                <button
                                    onClick={run(action.onClick)}
                                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                                >
                                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                        {action.icon}
                                    </span>
                                    {action.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default FolderActionMenu;