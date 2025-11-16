import MenuIcon from './MenuIcon';

const MenuItemComponent = ({ item, isActive, onClick }) => {
  return (
    <li 
    className={`
        flex items-center h-[38px] py-1 px-3 gap-2 self-stretch cursor-pointer 
        rounded-lg transition-all duration-300 ease-out
        hover:bg-gray-50 hover:scale-[1.02] hover:shadow-light
        active:scale-[0.98]
        dark:hover:bg-[rgba(255,255,255,0.03)]
        group
        ${isActive ? 'nav-item-active' : ''}
    `}
    onClick={() => onClick(item.key)}
>
    <div className='flex justify-center items-center h-4 w-4 transition-transform duration-300 group-hover:scale-110'>
        <MenuIcon iconType={item.icon} isActive={isActive} />
    </div>
    <h3 className={`
        text-medium-14 transition-colors duration-300
        ${isActive 
            ? 'dark:text-medium-14-white' 
            : 'dark:text-regular-14-neutral-200 group-hover:dark:text-white'
        }
    `}>
        {item.display}
    </h3>
</li>
  );
};

export default MenuItemComponent;