"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CopyLinkIcon, LinkIcon, RedTrashIcon, ViewIcon } from '@/components/ui/icons';

const MENU_WIDTH = 176;
const VIEWPORT_MARGIN = 8;
const TRIGGER_GAP = 4;

const TransferActionMenu = ({
    transfer,
    anchorRect,
    onOpenDetails,
    onCopyLink,
    onOpenLink,
    onDelete,
    onClose,
}) => {
    const menuRef = useRef(null);
    const [position, setPosition] = useState(null);

    // Measures after mount so the menu can flip up near the bottom of the viewport
    useLayoutEffect(() => {
        if (!anchorRect || !menuRef.current) return;

        const menuHeight = menuRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const shouldFlip = spaceBelow < menuHeight + TRIGGER_GAP + VIEWPORT_MARGIN;

        const top = shouldFlip
            ? anchorRect.top - menuHeight - TRIGGER_GAP
            : anchorRect.bottom + TRIGGER_GAP;

        // Right aligned to the trigger and clamped so it never leaves the screen
        const maxLeft = window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN;
        const left = Math.min(Math.max(anchorRect.right - MENU_WIDTH, VIEWPORT_MARGIN), maxLeft);

        setPosition({ top, left });
    }, [anchorRect]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };

        // Fixed positioning cannot follow a scrolling ancestor, so scrolling closes the menu
        const handleScroll = () => onClose?.();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [onClose]);

    const handleAction = (action) => {
        onClose?.();
        action?.(transfer);
    };

    const itemClasses = 'flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-neutral-500 dark:text-white hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay transition-colors';

    // Portalled to the body so the menu never affects the table's layout
    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: 'fixed',
                width: MENU_WIDTH,
                top: position?.top ?? -9999,
                left: position?.left ?? -9999,
                visibility: position ? 'visible' : 'hidden',
            }}
            className="z-[9999] overflow-hidden rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-dropdown dark:shadow-dark-dropdown"
        >
            <button onClick={() => handleAction(onOpenDetails)} className={itemClasses}>
                <ViewIcon />
                View details
            </button>

            <button onClick={() => handleAction(onCopyLink)} className={itemClasses}>
                <CopyLinkIcon />
                Copy link
            </button>

            <button onClick={() => handleAction(onOpenLink)} className={itemClasses}>
                <LinkIcon />
                Open link
            </button>

            <div className="h-px w-full bg-stroke-200 dark:bg-neutral-700" />

            <button onClick={() => handleAction(onDelete)} className={itemClasses}>
                <RedTrashIcon />
                Delete
            </button>
        </div>,
        document.body
    );
};

export default TransferActionMenu;