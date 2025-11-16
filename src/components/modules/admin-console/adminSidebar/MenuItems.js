import MenuItem from './MenuItem';

const MenuItems = ({ items, activeSection, onSectionSelect, isCollapsed }) => {
    const baseItemClasses = 'flex items-center gap-2 self-stretch h-[38px] py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 ease-out group ';

    const getItemClasses = (itemId) => {
        const isActive = activeSection === itemId;
        
        if (isActive) {
            return `${baseItemClasses} border border-[#ECECEE] bg-[#F2F2F3] text-neutral-500 dark:border-dark-border dark:bg-dark-gradient dark:shadow-dark-panel`;
        } else {
            return `${baseItemClasses} text-neutral-400 hover:border hover:border-[#E1E0E5] hover:bg-[#F6F6F7] hover:scale-[1.02] hover:shadow-light dark:hover:bg-[rgba(255,255,255,0.03)] dark:hover:border-neutral-600 dark:hover:scale-[1.02] dark:hover:shadow-middle`;
        }
    };

    return (
        <ul role="menu" className='w-full flex flex-col items-start self-stretch gap-1'>
            {items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                    <MenuItem
                        key={item.id}
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={isActive}
                        className={getItemClasses(item.id)}
                        onClick={() => onSectionSelect(item.id)}
                    />
                );
            })}
        </ul>
    );
};

export default MenuItems;