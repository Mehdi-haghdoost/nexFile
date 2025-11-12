'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MoreDropdownItem from './MoreDropdownItem';
import {
    KeepBoardIcon,
    ReplyIcon,
    KeepSendIcon,
    AutographIcon,
    KeepUpIcon,
    CaptureIcon,
    TransferIcon,
    PaperIcon,
    PasswordIcon
} from '@/components/ui/icons';

const MoreDropdown = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const dropdownRef = useRef(null);

    const moreMenuItems = [
        {
            id: 'keepboard',
            title: 'KeepBoard',
            description: 'Easily search, organize, and share',
            icon: <KeepBoardIcon />
        },
        {
            id: 'reply',
            title: 'Reply',
            description: 'Speed up video review and approval',
            icon: <ReplyIcon />
        },
        {
            id: 'keepsend',
            title: 'KeepSend',
            description: 'Send documents and track activity',
            icon: <KeepSendIcon />
        },
        {
            id: 'autograph',
            title: 'Autograph',
            description: 'Get secure eSignatures for any Doc',
            icon: <AutographIcon />
        },
        {
            id: 'keepup',
            title: 'KeepUp',
            description: 'Auto back up all devices',
            icon: <KeepUpIcon />
        },
        {
            id: 'capture',
            title: 'Capture',
            description: 'Record screens and video messages',
            icon: <CaptureIcon />
        },
        {
            id: 'transfer',
            title: 'Transfer',
            description: 'Send large files securely.',
            icon: <TransferIcon />,
            path: '/transfer'
        },
        {
            id: 'paper',
            title: 'Paper',
            description: 'Brainstorm in shared docs.',
            icon: <PaperIcon />
        },
        {
            id: 'password',
            title: 'Password',
            description: 'Sync passwords across devices.',
            icon: <PasswordIcon />
        }
    ];

    // بستن dropdown وقتی بیرون کلیک میشه
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (path) => {
        if (path) {
            router.push(path);
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
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
                className='flex flex-col items-start  gap-2 py-1 px-1 fixed w-[298px] h-[505px] left-[70px] top-[90px] bg-white rounded-lg shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)] dropdown-animate z-[9999] dark:bg-neutral-800 dark:border-neutral-700'
            >
                {/* Header */}
                <div className='flex flex-col items-start  self-stretch py-2 px-2'>
                    <div className='flex items-center justify-between self-stretch'>
                        <h2 className='text-medium-16 text-[#181820] dark:text-medium-16-white'>More</h2>
                        <button
                            onClick={handleClose}
                            className=' flex items-center justify-end hover:bg-gray-100 dark:hover:bg-transparent rounded transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12 4L4 12M4 4L12 12" 
                                stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                                className='dark:stroke-white/50'
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Items Container */}
                <div className='flex flex-col items-start self-stretch custom-scrollbar'>
                    {moreMenuItems.map((item) => (
                        <MoreDropdownItem
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            onClick={() => handleItemClick(item.path)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MoreDropdown;