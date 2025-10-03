'use client'

import { useState } from 'react';
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

const MoreDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

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

    const handleItemClick = (path) => {
        if (path) {
            router.push(path);
            setIsOpen(false);
        }
    };

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
            
            <div className='flex flex-col items-start gap-2 py-1 px-1 absolute w-[298px] h-[524px] left-[48px] top-0 bg-white rounded-lg shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)] dropdown-animate'>
                {/* Header */}
                <div className='flex flex-col items-start gap-4 self-stretch py-2 px-3'>
                    <div className='flex items-center justify-between self-stretch'>
                        <h2 className='text-medium-16 text-[#181820]'>More</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12 4L4 12M4 4L12 12" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Items Container */}
                <div className='flex flex-col items-start self-stretch overflow-y-auto'>
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