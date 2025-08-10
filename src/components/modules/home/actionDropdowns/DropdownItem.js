import React, { useState } from 'react'

const DropdownItem = ({ icon, title, onClick, hasSubmenu = false, submenuItems = [] }) => {


    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleClick = () => {
        if (hasSubmenu) {
            setIsSubMenuOpen(!isSubMenuOpen)
        } else {
            onClick && onclick();
        }
    }

    const handleMouseEnter = () => {
        if (hasSubmenu) {
            setIsSubMenuOpen(true);
        }
    }

    const handleMouseLeave = () => {
        if (hasSubmenu) {
            setIsSubMenuOpen(false);
        }
    }

    return (
        <div
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className='flex items-center w-full gap-3 p-2 self-stretch rounded transition-all duration-200 ease-in-out hover:bg-[#F6F6F7]'>
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
            {/* Submenu */}
            {hasSubmenu && isSubMenuOpen && submenuItems.length > 0 && (
                <div className='flex flex-col justify-center items-center gap-4 w-[285px] p-2 absolute left-[260px] -top-[30px] rounded border border-[#F2F2F3] bg-white boxShadow-dropdown'>
                    {submenuItems.map((subMenu, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                subMenu.action && subMenu.action();
                                setIsSubMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                            {subMenu.icon && <div>{subMenu.icon}</div>}
                            <span>{subMenu.title}</span>

                        </button>
                    ))}
                </div>
            )}
        </div>

    )
}

export default DropdownItem