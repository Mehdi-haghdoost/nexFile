import { forwardRef } from 'react';
import MoreDropdownItem from './MoreDropdownItem';
import { KeepBoardIcon } from '@/components/ui/icons';

const MoreDropdown = forwardRef((props, ref) => {
    const moreMenuItems = [
        {
            id: 'keepboard',
            title: 'KeepBoard',
            description: 'Easily search, organize, and share',
            icon: (
                <KeepBoardIcon />
            )
        },
        {
            id: 'reply',
            title: 'Reply',
            description: 'Speed up video review and approval',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3.5 2V10L10 6L3.5 2Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'keepsend',
            title: 'KeepSend',
            description: 'Send documents and track activity',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 8.5V5.5L3.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 5.5L5.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 5V7.5C11 10 10 11 7.5 11H4.5C2 11 1 10 1 7.5V4.5C1 2 2 1 4.5 1H7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 5H9C7.5 5 7 4.5 7 3V1L11 5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'autograph',
            title: 'Autograph',
            description: 'Get secure eSignatures for any Doc',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1.5 9.5C3.1665 8.5 4 7.5 4 6.5C4 5 3.5 5 3 5C2.5 5 1.984 5.5425 2 6.5C2.017 7.524 2.829 7.9385 3.25 8.5C4 9.5 4.5 9.75 5 9C5.3335 8.5 5.5835 8.0835 5.75 7.75C6.25 8.9165 6.9165 9.5 7.75 9.5H9M9 9.5L8 8.5V2.5C8 1.9395 8.4395 1.5 9 1.5C9.5605 1.5 10 1.9395 10 2.5V8.5L9 9.5ZM8 3.5H10" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'keepup',
            title: 'KeepUp',
            description: 'Auto back up all devices',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3.25 9.5C2.00736 9.5 1 8.49264 1 7.25C1 6.07822 1.89575 5.11565 3.03987 5.00968C3.27391 3.58607 4.51012 2.5 6 2.5C7.48988 2.5 8.72609 3.58607 8.96013 5.00968C10.1042 5.11565 11 6.07822 11 7.25C11 8.49264 9.99264 9.5 8.75 9.5C6.55508 9.5 5.17165 9.5 3.25 9.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'capture',
            title: 'Capture',
            description: 'Record screens and video messages',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M11 4.46569C11 4.16278 11 4.01132 10.9401 3.94119C10.8881 3.88034 10.8102 3.84805 10.7304 3.85432C10.6384 3.86156 10.5313 3.96865 10.3172 4.18284L8.5 6L10.3172 7.81716C10.5313 8.03135 10.6384 8.13844 10.7304 8.14568C10.8102 8.15195 10.8881 8.11966 10.9401 8.05881C11 7.98868 11 7.83722 11 7.53431V4.46569Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 4.9C1 4.05992 1 3.63988 1.16349 3.31901C1.3073 3.03677 1.53677 2.8073 1.81901 2.66349C2.13988 2.5 2.55992 2.5 3.4 2.5H6.1C6.94008 2.5 7.36012 2.5 7.68099 2.66349C7.96323 2.8073 8.1927 3.03677 8.33651 3.31901C8.5 3.63988 8.5 4.05992 8.5 4.9V7.1C8.5 7.94008 8.5 8.36012 8.33651 8.68099C8.1927 8.96323 7.96323 9.1927 7.68099 9.33651C7.36012 9.5 6.94008 9.5 6.1 9.5H3.4C2.55992 9.5 2.13988 9.5 1.81901 9.33651C1.53677 9.1927 1.3073 8.96323 1.16349 8.68099C1 8.36012 1 7.94008 1 7.1V4.9Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'transfer',
            title: 'Transfer',
            description: 'Send large files securely.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clipPath="url(#clip0_212_17007)">
                        <path d="M6 7.50012L4.5 6.00012M6 7.50012C6.69842 7.2345 7.36844 6.89949 8 6.50012M6 7.50012V10.0001C6 10.0001 7.515 9.72512 8 9.00012C8.54 8.19012 8 6.50012 8 6.50012M4.5 6.00012C4.76607 5.30984 5.1011 4.64816 5.5 4.02512C6.08259 3.09362 6.89381 2.32665 7.8565 1.79717C8.81919 1.26769 9.90133 0.993309 11 1.00012C11 2.36012 10.61 4.75012 8 6.50012M4.5 6.00012H2C2 6.00012 2.275 4.48512 3 4.00012C3.81 3.46012 5.5 4.00012 5.5 4.00012M2.25 8.25012C1.5 8.88012 1.25 10.7501 1.25 10.7501C1.25 10.7501 3.12 10.5001 3.75 9.75012C4.105 9.33012 4.1 8.68512 3.705 8.29512C3.51065 8.10963 3.25465 8.00244 2.98611 7.99414C2.71758 7.98583 2.45544 8.07699 2.25 8.25012Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_212_17007">
                            <rect width="12" height="12" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )
        },
        {
            id: 'paper',
            title: 'Paper',
            description: 'Brainstorm in shared docs.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M7 1.5V3.5C7 3.63261 7.05268 3.75979 7.14645 3.85355C7.24021 3.94732 7.36739 4 7.5 4H9.5M7 1.5H3.5C3.23478 1.5 2.98043 1.60536 2.79289 1.79289C2.60536 1.98043 2.5 2.23478 2.5 2.5V9.5C2.5 9.76522 2.60536 10.0196 2.79289 10.2071C2.98043 10.3946 3.23478 10.5 3.5 10.5H8.5C8.76522 10.5 9.01957 10.3946 9.20711 10.2071C9.39464 10.0196 9.5 9.76522 9.5 9.5V4M7 1.5L9.5 4" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'password',
            title: 'Password',
            description: 'Sync passwords across devices.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M8.5 4.49997C8.49999 4.24406 8.40236 3.98815 8.20711 3.79289C8.01184 3.59763 7.75592 3.5 7.5 3.5M7.5 7.5C9.15685 7.5 10.5 6.15685 10.5 4.5C10.5 2.84315 9.15685 1.5 7.5 1.5C5.84315 1.5 4.5 2.84315 4.5 4.5C4.5 4.63684 4.50916 4.77154 4.52691 4.90352C4.55609 5.12059 4.57068 5.22913 4.56086 5.29779C4.55063 5.36933 4.5376 5.40787 4.50234 5.47095C4.4685 5.5315 4.40885 5.59114 4.28957 5.71043L1.73431 8.26569C1.64784 8.35216 1.6046 8.3954 1.57368 8.44586C1.54627 8.49059 1.52606 8.53937 1.51382 8.59038C1.5 8.64793 1.5 8.70908 1.5 8.83137V9.7C1.5 9.98003 1.5 10.12 1.5545 10.227C1.60243 10.3211 1.67892 10.3976 1.773 10.4455C1.87996 10.5 2.01997 10.5 2.3 10.5H3.5V9.5H4.5V8.5H5.5L6.28957 7.71043C6.40886 7.59114 6.4685 7.5315 6.52905 7.49766C6.59213 7.4624 6.63067 7.44937 6.70221 7.43914C6.77087 7.42932 6.87941 7.44391 7.09648 7.47309C7.22846 7.49084 7.36316 7.5 7.5 7.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    ];

    const handleItemClick = (itemId) => {
        console.log(`Clicked on ${itemId}`);
        // اینجا می‌تونی action مربوط به هر آیتم رو اضافه کنی
    };

    return (
        <div
            ref={ref}
            className='absolute left-[60px] top-0 w-[300px] p-2 flex flex-col justify-center items-center gap-2 rounded-lg border border-[#F2F2F3] bg-white z-50'
            style={{
                boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.12)'
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