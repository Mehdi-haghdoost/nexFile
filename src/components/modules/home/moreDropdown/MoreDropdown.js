import { forwardRef } from 'react';
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

const MoreDropdown = forwardRef((props, ref) => {
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
            icon: <TransferIcon />
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

    const handleItemClick = (itemId) => {
        console.log(`Clicked on ${itemId}`);
    };

    return (
        <div
            ref={ref}
            className='absolute left-[60px] top-0 w-[300px] p-2 flex flex-col justify-center items-center gap-2 rounded-lg border border-[#F2F2F3] bg-white z-50'
            style={{
                boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.12)',
                animation: 'fadeIn 0.2s ease-out forwards'
            }}
        >
            {moreMenuItems.map((item) => (
                <MoreDropdownItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    onClick={() => handleItemClick(item.id)}
                />
            ))}
        </div>
    );
});

MoreDropdown.displayName = 'MoreDropdown';

export default MoreDropdown;