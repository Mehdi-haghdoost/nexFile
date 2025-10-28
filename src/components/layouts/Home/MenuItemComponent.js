import MenuIcon from './MenuIcon';

const MenuItemComponent = ({ item, isActive, onClick }) => {
  return (
    <li 
      className={`flex items-center h-[38px] py-1 px-3 gap-2 self-stretch cursor-pointer ${isActive ? 'nav-item-active' : ''}`}
      onClick={() => onClick(item.key)}
    >
      <div className='flex justify-center items-center h-4 w-4'>
        <MenuIcon iconType={item.icon} isActive={isActive} />
      </div>
      <h3 className={`
        text-medium-14 
        ${isActive ? 'dark:text-medium-14-white' : 'dark:text-regular-14-neutral-200'}
      `}>
        {item.display}
      </h3>
    </li>
  );
};

export default MenuItemComponent;