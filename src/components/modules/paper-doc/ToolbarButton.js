import React from 'react';

const ToolbarButton = ({ icon: Icon, label = '', onClick, isActive = false }) => {
    const handleClick = () => {
        onClick?.();
    };

    const buttonClasses = `
        flex justify-center items-center py-1 px-[9px] gap-2.5 h-10 w-10 rounded-[5px] 
        cursor-pointer transition-all duration-200
        ${isActive 
            ? 'bg-primary-500 dark:bg-primary-600' 
            : 'hover:bg-gray-100 dark:hover:bg-dark-overlay'
        }
    `.trim();

    return (
        <button
            type="button"
            onClick={handleClick}
            className={buttonClasses}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
        >
            <div className={isActive ? '[&_path]:!stroke-white' : ''}>
                <Icon />
            </div>
        </button>
    );
};

export default React.memo(ToolbarButton);