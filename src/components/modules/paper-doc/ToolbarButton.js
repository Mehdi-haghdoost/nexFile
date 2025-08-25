import React from 'react'

const ToolbarButton = ({ icon: Icon, onClick, isActive = false }) => {

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const buttonClasses = `
    flex justify-center items-center py-1 px-[9px] gap-2.5 h-10 w-10 rounded-[5px] 
    cursor-pointer transition-all duration-200 hover:bg-blue-50
    ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}
  `.trim();

    return (
        <div className={buttonClasses} onClick={handleClick}>
            <Icon />
        </div>
    )
}

export default ToolbarButton