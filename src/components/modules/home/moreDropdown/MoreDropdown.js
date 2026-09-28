'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MoreDropdownItem from './MoreDropdownItem';
import { CloseIcon } from '@/components/ui/icons';
import { PRODUCTS } from '@/utils/constants/productConstants';

const MoreDropdown = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const dropdownRef = useRef(null);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    // Closes on an outside click or Escape, like the app's other dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') handleClose();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleItemClick = (path) => {
        if (!path) return;

        router.push(path);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .dropdown-animate {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>

            <div
                ref={dropdownRef}
                className='flex flex-col items-start gap-2 py-1 px-1 fixed w-[298px] h-[505px] left-[70px] top-[90px] bg-white rounded-lg shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)] dropdown-animate z-[9999] dark:bg-neutral-800 dark:border-neutral-700'
            >
                {/* Header */}
                <div className='flex flex-col items-start self-stretch py-2 px-2'>
                    <div className='flex items-center justify-between self-stretch'>
                        <h2 className='text-medium-16 text-[#181820] dark:text-medium-16-white'>More</h2>
                        <button
                            onClick={handleClose}
                            aria-label='Close'
                            className='flex items-center justify-end hover:bg-gray-100 dark:hover:bg-transparent rounded transition-colors'
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Items Container */}
                <div className='flex flex-col items-start self-stretch custom-scrollbar'>
                    {PRODUCTS.map(({ id, title, description, Icon, path }) => (
                        <MoreDropdownItem
                            key={id}
                            icon={<Icon />}
                            title={title}
                            description={description}
                            isAvailable={Boolean(path)}
                            onClick={() => handleItemClick(path)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MoreDropdown;