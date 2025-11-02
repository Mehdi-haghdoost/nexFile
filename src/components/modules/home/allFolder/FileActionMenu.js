import useModalStore from '@/store/ui/modalStore';
import React, { useEffect, useRef, useState } from 'react';
import { FILE_ACTION_MENU_ITEMS } from '@/utils/constants/fileActionMenuConstants';

const FileActionMenu = ({ fileName, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { openModal } = useModalStore();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // بستن منو با کلیک بر روی مکانی خارج از آن
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // بستن منو با دکمه Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleShareClick = () => {
        openModal('shareFolder', { fileName });
        setIsOpen(false);
    };

    const handleItemClick = (item) => {
        if (item.action === 'handleShareClick') {
            handleShareClick();
        } else if (item.action) {
            item.action();
        }
        setIsOpen(false);
    };

    return (
        <div className="relative " ref={menuRef}>
            {/* Action Button */}
            <button
                onClick={toggleMenu}
                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors dark:border-dark-border dark:bg-dark-gradient'
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className="dark:fill-neutral-300" />
                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className="dark:fill-neutral-300" />
                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className="dark:fill-neutral-300" />
                </svg>
            </button>

            {/* Menu Dropdown */}
            {isOpen && (
                <div className="flex flex-col justify-center items-center w-[285px] shadow-dropdown border border-[#F2F2F3] bg-white p-2 gap-2 rounded-lg absolute -right-4 -bottom-[50px] z-[9999] dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-dark-dropdown">
                    {/* Header */}
                    <div className="flex items-center gap-2.5 px-2 py-1 self-stretch">
                        <p className="text-medium-14 dark:text-medium-14-white">Design File</p>
                    </div>

                    {/* Menu Items */}
                    {FILE_ACTION_MENU_ITEMS.map((item, index) => {
                        if (item.divider) {
                            return (
                                <svg key={index} xmlns="http://www.w3.org/2000/svg" width="285" height="2" viewBox="0 0 285 2" fill="none">
                                    <path d="M0.00195312 1H284.998" stroke="#F2F2F3" strokeWidth="1.2" />
                                </svg>
                            );
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item)}
                                className={`flex items-center w-full p-2 gap-3 bg-white/8 hover:bg-gray-50 transition-colors  hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay ${item.textColor || 'text-gray-700'
                                    }`}
                            >
                                <div className="w-4 h-4 mr-3 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="flex-1 text-regular-14 dark:text-regular-14-neutral-200ّ text-left">{item.title}</span>
                                {item.hasArrow && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path d="M6 12.5L10 8.5L6 4.5"
                                            stroke="#737379"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="dark:stroke-[#9F9FA3]"
                                        />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default FileActionMenu;