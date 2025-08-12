import React, { useState } from 'react'
import useModalStore from '@/store/modalStore';

const DropdownItem = ({ icon, title, onClick, hasSubmenu = false, submenuItems = [], onModalOpen }) => {

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const { openModal } = useModalStore();


    const handleClick = () => {
        if (hasSubmenu) {
            setIsSubMenuOpen(!isSubMenuOpen)
        } else {
            onClick && onClick();
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

    const handleSubmenuItemClick = (subMenu) => {
        console.log('Submenu item clicked:', subMenu);

        if (subMenu.modal) {
            console.log('Opening modal:', subMenu.modal);
            openModal && openModal(subMenu.modal);
        } else if (subMenu.action) {
            console.log('Executing action for:', subMenu.title);
            subMenu.action();
        }
        setIsSubMenuOpen(false);
    }

    return (
        <div
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className='flex items-center w-full gap-3 p-2 self-stretch rounded transition-all duration-200 ease-in-out hover:bg-[#F6F6F7]'
                onClick={handleClick}
            >
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
            {hasSubmenu && isSubMenuOpen && submenuItems && submenuItems.length > 0 && (
                <div className='flex flex-col justify-center items-center gap-4 w-[285px] p-2 absolute left-[260px] -top-[30px] rounded border border-[#F2F2F3] bg-white shadow-lg z-50'>
                    {submenuItems.map((subMenu, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => handleSubmenuItemClick(subMenu)}
                                className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                                {subMenu.icon && <div>{subMenu.icon}</div>}
                                <span>{subMenu.title}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default DropdownItem