'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { RedTrashIcon, SettingsIcon } from '@/components/ui/icons';
import { GROUP_PERMISSIONS } from '@/utils/constants/groupsConstants';

// Fixed-position action dropdown for a single group row
const GroupActionMenu = ({ group, onUpdateGroup, onDeleteGroup }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const MENU_WIDTH = 192;

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

    const run = (fn) => () => { fn(); setIsOpen(false); };

    // Offer the two permission levels this group isn't already on
    const permissionActions = Object.values(GROUP_PERMISSIONS)
        .filter((p) => p !== group.permission)
        .map((p) => ({
            label: `Set to ${p}`,
            onClick: () => onUpdateGroup(group.id, { permission: p }),
            icon: <SettingsIcon />,
        }));

    const actions = [
        ...permissionActions,
        { divider: true },
        { label: 'Delete group', onClick: () => onDeleteGroup(group.id), icon: <RedTrashIcon />, danger: true },
    ];

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen((p) => !p); }}
                aria-label={`Actions for ${group.name}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`flex items-center justify-center w-8 h-8 p-1 shadow-custom border rounded cursor-pointer hover:scale-105 active:scale-95 transition-all flex-shrink-0
                    ${isOpen
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                        : 'border-[#F2F2F3] dark:border-dark-border bg-white dark:bg-dark-gradient hover:bg-gray-50 dark:hover:bg-neutral-700'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none" aria-hidden="true">
                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className="dark:fill-[#737379]" />
                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className="dark:fill-[#737379]" />
                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className="dark:fill-[#737379]" />
                </svg>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    style={{ top: coords.top, left: coords.left, width: MENU_WIDTH }}
                    className="fixed z-[9999] rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
                >
                    <ul className="py-1">
                        {actions.map((action, i) =>
                            action.divider ? (
                                <li key={`divider-${i}`} className="my-1 h-px bg-stroke-100 dark:bg-neutral-800" />
                            ) : (
                                <li key={action.label}>
                                    <button
                                        onClick={run(action.onClick)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                                            ${action.danger
                                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                                                : 'text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{action.icon}</span>
                                        {action.label}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default GroupActionMenu;