"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, OverviewsIcon } from '@/components/ui/icons';
import { AVAILABLE_PRODUCTS } from '@/utils/constants/productConstants';

const TransferAppSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Trigger and panel share one container, so clicking the trigger toggles instead of reopening
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleNavigate = (path) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <div ref={containerRef} className='relative'>
            <button
                type='button'
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label='Switch app'
                aria-expanded={isOpen}
                className='flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
            >
                <OverviewsIcon />
            </button>

            {isOpen && (
                <div className='absolute left-0 top-full z-50 mt-2 w-[260px] overflow-hidden rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-1 shadow-dropdown dark:shadow-dark-dropdown'>
                    {/* Files come first, since that is where the rest of NexFile lives */}
                    <button
                        type='button'
                        onClick={() => handleNavigate('/home')}
                        className='flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
                    >
                        <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
                            <HomeIcon />
                        </span>
                        <span className='flex flex-col'>
                            <span className='text-medium-12 dark:text-medium-12-white'>Files</span>
                            <span className='text-[11px] text-neutral-300 dark:text-neutral-400'>
                                Folders, shared files and requests
                            </span>
                        </span>
                    </button>

                    <div className='my-1 h-px w-full bg-stroke-200 dark:bg-neutral-700' />

                    {AVAILABLE_PRODUCTS.map(({ id, title, description, Icon, path }) => {
                        const isCurrent = pathname.startsWith(path);

                        return (
                            <button
                                key={id}
                                type='button'
                                onClick={() => handleNavigate(path)}
                                disabled={isCurrent}
                                className={`
                                    flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors
                                    ${isCurrent
                                        ? 'bg-primary-50 dark:bg-primary-bg cursor-default'
                                        : 'hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
                                    }
                                `}
                            >
                                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-white/70 bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] p-1'>
                                    <Icon />
                                </span>
                                <span className='flex flex-col'>
                                    <span className='text-medium-12 dark:text-medium-12-white'>{title}</span>
                                    <span className='text-[11px] text-neutral-300 dark:text-neutral-400'>
                                        {isCurrent ? 'You are here' : description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TransferAppSwitcher;