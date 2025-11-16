const MenuItem = ({ item, isCollapsed, isActive, className, onClick }) => (
    <li
        role="menuitem"
        className={className}
        onClick={onClick}
    >
        <item.icon />
        {!isCollapsed && (
            <h3 className={`
                text-medium-14 flex-1 whitespace-nowrap overflow-hidden transition-colors duration-300
                ${isActive 
                    ? 'dark:text-medium-14-white' 
                    : 'dark:text-regular-14-neutral-200 group-hover:dark:text-white'
                }
            `}>
                {item.label}
            </h3>
        )}
    </li>
);

export default MenuItem;