import React from 'react'

const DropdownItem = ({ icon, title, onClick, hasSubmenu = false }) => {
    return (
        <button className='flex items-center gap-3 p-2 self-stretch rounded'>
            <div>{icon}</div>
            <div className='flex flex-1 text-regular-14 '>
                <p>{title}</p>
            </div>
            {hasSubmenu && (
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M6 12.5L10 8.5L6 4.5" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
        </button>
    )
}

export default DropdownItem