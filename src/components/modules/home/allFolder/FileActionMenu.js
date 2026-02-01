import React, { useEffect, useRef, useState } from 'react';
import { useFileActions } from '@/hooks/files/filesManagement/useFileActions';
import { getFileActionMenuItems } from '@/utils/constants/fileActionMenuConstants';

const FileActionMenu = ({ file }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sheetRef = useRef(null);

    const handlers = useFileActions(file);
    const menuItems = getFileActionMenuItems(file, handlers);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleItemClick = (item) => {
        if (item.action) {
            item.action();
        }
        setIsOpen(false);
    };

    const sections = [
        { title: 'Quick Actions', items: menuItems.slice(0, 9) },
        { title: 'File Management', items: menuItems.slice(9, 13) },
        { title: 'Other', items: menuItems.slice(14) }
    ];

    return (
        <>
            <button
                onClick={toggleMenu}
                className={`
                    group relative flex items-center justify-center 
                    w-8 h-8 rounded-lg border transition-all duration-200
                    ${isOpen
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-md scale-95'
                        : 'border-[#E8E8EA] bg-white dark:bg-neutral-800 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 hover:scale-105'
                    }
                `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`transition-all duration-300 ${isOpen ? 'rotate-90 [&>circle]:fill-primary-500' : '[&>circle]:fill-neutral-400 dark:[&>circle]:fill-neutral-500 group-hover:[&>circle]:fill-neutral-600 dark:group-hover:[&>circle]:fill-neutral-400'}`}
                >
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {isOpen && (
                <div
                    ref={sheetRef}
                    className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
                >
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
                    </div>

                    <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                                    <path d="M9.75 5.25L8.91334 3.57669C8.67255 3.0951 8.55215 2.8543 8.37253 2.67837C8.21368 2.5228 8.02224 2.40448 7.81206 2.33198C7.57437 2.25 7.30516 2.25 6.76672 2.25H3.9C3.05992 2.25 2.63988 2.25 2.31901 2.41349C2.03677 2.5573 1.8073 2.78677 1.66349 3.06901C1.5 3.38988 1.5 3.80992 1.5 4.65V5.25M1.5 5.25H12.9C14.1601 5.25 14.7902 5.25 15.2715 5.49524C15.6948 5.71095 16.039 6.05516 16.2548 6.47852C16.5 6.95982 16.5 7.58988 16.5 8.85V12.15C16.5 13.4101 16.5 14.0402 16.2548 14.5215C16.039 14.9448 15.6948 15.289 15.2715 15.5048C14.7902 15.75 14.1601 15.75 12.9 15.75H5.1C3.83988 15.75 3.20982 15.75 2.72852 15.5048C2.30516 15.289 1.96095 14.9448 1.74524 14.5215C1.5 14.0402 1.5 13.4101 1.5 12.15V5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {file?.originalName || file?.name || 'Unnamed'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">File options</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-600 dark:text-neutral-400" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
                        <div className="p-4 space-y-6">
                            {sections.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-3 px-2">
                                        {section.title}
                                    </h3>

                                    <div className="space-y-1">
                                        {section.items.map((item, index) => {
                                            if (item.divider) return null;

                                            const isDestructive = item.textColor?.includes('red');

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleItemClick(item)}
                                                    disabled={handlers.isLoading}
                                                    className={`
                                                        group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                                                        transition-all duration-200
                                                        ${isDestructive
                                                            ? 'hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-[0.98]'
                                                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-[0.98]'
                                                        }
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                    `}
                                                >
                                                    <div className={`
                                                        flex items-center justify-center w-11 h-11 rounded-xl transition-all
                                                        ${isDestructive
                                                            ? 'bg-red-50 dark:bg-red-500/10 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 group-hover:scale-110'
                                                            : 'bg-gray-100 dark:bg-neutral-800 group-hover:bg-gray-200 dark:group-hover:bg-neutral-700 group-hover:scale-110'
                                                        }
                                                    `}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className={`
                                                            text-base font-semibold
                                                            ${isDestructive
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : 'text-gray-900 dark:text-white'
                                                            }
                                                        `}>
                                                            {item.title}
                                                        </p>
                                                    </div>
                                                    {item.hasArrow && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                            className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                                        >
                                                            <path
                                                                d="M7.5 15L12.5 10L7.5 5"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FileActionMenu;