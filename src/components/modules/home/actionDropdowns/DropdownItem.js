import React, { useState } from 'react'
import useModalStore from '@/store/ui/modalStore';

const DropdownItem = ({ icon, title, onClick, hasSubmenu = false, submenuItems = [], onModalOpen }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const { openModal } = useModalStore();
    
    const handleClick = () => {
        if (!hasSubmenu) {
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
                className='flex items-center w-full gap-2 sm:gap-3 p-2 self-stretch rounded transition-colors duration-200 hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
                onClick={handleClick}
            >
                <div className="shrink-0 flex items-center justify-center">
                    {icon}
                </div>
                <div className='flex flex-1 min-w-0 text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-200'>
                    <p className="truncate">{title}</p>
                </div>
                {hasSubmenu && (
                    <div className="shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6 12.5L10 8.5L6 4.5" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
                        </svg>
                    </div>
                )}
            </button>
            
            {/* Submenu */}
            {hasSubmenu && isSubMenuOpen && submenuItems && submenuItems.length > 0 && (
                <div 
                    className='
                        flex flex-col justify-center items-center gap-1
                        w-full sm:w-[240px] md:w-[260px] lg:w-[285px]
                        p-2 
                        absolute 
                        left-0 top-full
                        sm:left-[220px] sm:top-0
                        md:left-[240px]
                        lg:left-[260px]
                        rounded-lg border border-[#F2F2F3] 
                        bg-white dark:bg-neutral-600 
                        dark:border-neutral-700 
                        shadow-lg z-50
                    '
                    onMouseEnter={() => setIsSubMenuOpen(true)}
                    onMouseLeave={() => setIsSubMenuOpen(false)}
                >
                    {submenuItems.map((subMenu, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => handleSubmenuItemClick(subMenu)}
                                className="flex items-center gap-2 w-full p-2 text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-dark-overlay rounded transition-colors"
                            >
                                {subMenu.icon && <div className="shrink-0">{subMenu.icon}</div>}
                                <span className='truncate'>{subMenu.title}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default DropdownItem