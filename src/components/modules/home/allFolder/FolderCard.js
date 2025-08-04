'use client'
import { useState } from 'react';


const FolderCard = ({ folderName, onMenuClick }) => {

    const [showTooltip, setShowTooltip] = useState(false);

    const handleMenuClick = (e) => {
        e.stopPropagation() //جلوگیری کردم تا بر روی کارت ها کلیک نشه

        if (onMenuClick) {
            onMenuClick(folderName)
        }

        console.log(`Menu clicked for: ${folderName}`)
    }

    return (

        <div className='flex w-[181px] h-[38px] py-1 px-3 items-center gap-2 self-stretch rounded-lg border border-[#ECECEE] bg-[#FCFCFC]'>
            {/* Folder Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14.6667 7.33337V11.3334C14.6667 14 14 14.6667 11.3333 14.6667H4.66668C2.00001 14.6667 1.33334 14 1.33334 11.3334V4.66671C1.33334 2.00004 2.00001 1.33337 4.66668 1.33337H5.66668C6.66668 1.33337 6.88668 1.62671 7.26668 2.13337L8.26668 3.46671C8.52001 3.80004 8.66668 4.00004 9.33334 4.00004H11.3333C14 4.00004 14.6667 4.66671 14.6667 7.33337Z" stroke="#FFCA28" stroke-width="1.2" stroke-miterlimit="10" />
                <path d="M5.33334 1.33337H11.3333C12.6667 1.33337 13.3333 2.00004 13.3333 3.33337V4.25337" stroke="#FFCA28" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {/* Folder Name */}
            <h3 className='flex-1 text-regular-14-neutral-500 '>{folderName}</h3>
            {/* Menu Icon - Clickable  */}
            <div className='relative'>

                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"
                    className='cursor-pointer hover:bg-gray-200 rounded p-1 transition-colors'
                    onClick={handleMenuClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <path d="M9.43329 3.33301C9.43329 3.79009 9.05732 4.16681 8.60028 4.16699C8.14309 4.16699 7.7663 3.7902 7.7663 3.33301C7.76647 2.87596 8.1432 2.5 8.60028 2.5C9.05722 2.50018 9.43311 2.87607 9.43329 3.33301Z" fill="#2E2E37" stroke="#2E2E37" />
                    <path d="M9.43329 12.6664C9.43329 13.1235 9.05732 13.5002 8.60028 13.5004C8.14309 13.5004 7.7663 13.1236 7.7663 12.6664C7.76647 12.2093 8.1432 11.8334 8.60028 11.8334C9.05722 11.8336 9.43311 12.2094 9.43329 12.6664Z" fill="#2E2E37" stroke="#2E2E37" />
                    <path d="M9.43329 7.99963C9.43329 8.45672 9.05732 8.83344 8.60028 8.83362C8.14309 8.83362 7.7663 8.45682 7.7663 7.99963C7.76647 7.54259 8.1432 7.16663 8.60028 7.16663C9.05722 7.1668 9.43311 7.5427 9.43329 7.99963Z" fill="#2E2E37" stroke="#2E2E37" />
                </svg>

                {/* برای تست یک تولتیپ ایجاد کردم */}
                {showTooltip && (
                    <div className="absolute top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        More options
                    </div>
                )}
            </div>

        </div>

    )
}

export default FolderCard