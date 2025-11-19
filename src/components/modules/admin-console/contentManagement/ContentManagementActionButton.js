import React from 'react';

const ContentManagementActionButton = ({ memberId }) => {
    const handleClick = () => {
        console.log('Open menu for member:', memberId);
    };

    return (
        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
            <button
                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
                aria-label="Member actions menu"
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="12"
                    viewBox="0 0 4 12"
                    fill="none"
                    aria-hidden="true"
                >
                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z"
                        fill="#2E2E37"
                        className='dark:fill-[#737379]'
                    />
                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z"
                        fill="#2E2E37"
                        className='dark:fill-[#737379]'
                    />
                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z"
                        fill="#2E2E37"
                        className='dark:fill-[#737379]'
                    />
                </svg>
            </button>
        </div>
    );
};

export default ContentManagementActionButton;