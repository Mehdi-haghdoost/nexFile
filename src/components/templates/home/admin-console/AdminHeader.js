import { BellIcon, HelpCircleIcon, HistoryIcon } from '@/components/ui/icons';
import React from 'react';

const AdminHeader = ({ activeSection }) => {
    return (
        <div className='flex justify-between items-center h-[80px] py-5 px-8 flex-shrink-0 self-stretch bg-white border-b border-l border-stroke-200'>
            <h2 className='text-semibold-20'>{activeSection}</h2>
            <HeaderActions />
        </div>
    );
};

// Header Actions Component
const HeaderActions = () => (
    <div className='flex justify-center items-center gap-3'>
        <ActionButton icon={HistoryIcon} label="History" />
        <NotificationButton />
        <ActionButton icon={HelpCircleIcon} label="Help" />
        <UserProfile />
    </div>
);

// Action Button Component
const ActionButton = ({ icon: Icon, label }) => (
    <button 
        className='flex justify-center items-center gap-1.5 w-8 h-8 bg-white rounded-lg border border-stroke-300 shadow-light'
        aria-label={label}
    >
        <Icon />
    </button>
);

// Notification Button Component
const NotificationButton = () => (
    <div className='relative w-8 h-8'>
        <button className='btn-icon w-full h-full' aria-label="Notifications">
            <BellIcon />
            <span
                className='absolute top-[7px] right-[10px] w-[5px] h-[5px] bg-[#BC1828] rounded-full'
                aria-label="New notifications"
            />
        </button>
    </div>
);

// User Profile Component
const UserProfile = () => (
    <div className='flex items-center gap-3'>
        <img 
            src="images/nav_img.png" 
            className='h-[38px] w-[38px] rounded-[38px] bg-no-repeat bg-center bg-cover' 
            alt="User avatar" 
        />
        <div className='flex flex-col justify-center items-start w-[122px]'>
            <h3 className='text-medium-16'>Ridwan T.</h3>
            <p className='text-regular-12'>ridwant@gmail.com</p>
        </div>
    </div>
);

export default AdminHeader;