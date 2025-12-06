const MenuItem = ({ item, isCollapsed, isActive, className, onClick }) => (
    <li
        role="menuitem"
        className={className}
        onClick={onClick}
    >
        <div className="flex-shrink-0">
            <item.icon />
        </div>
        {!isCollapsed && (
            <h3 className={`
                text-sm font-medium flex-1 whitespace-nowrap overflow-hidden transition-colors duration-300
                ${isActive 
                    ? 'text-neutral-500 dark:text-white' 
                    : 'text-neutral-400 dark:text-neutral-200 group-hover:text-neutral-600 group-hover:dark:text-white'
                }
            `}>
                {item.label}
            </h3>
        )}
    </li>
);

export default MenuItem;