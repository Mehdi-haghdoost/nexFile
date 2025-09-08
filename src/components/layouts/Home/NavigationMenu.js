// NavigationMenu.js
import { useState } from 'react';
import MenuItemComponent from './MenuItemComponent';
import { MENU_ITEMS } from './menuConfig';

const NavigationMenu = ({ onSidebarChange }) => {
  const [activeItem, setActiveItem] = useState('all-folders');

  const handleMenuClick = (key) => {
    setActiveItem(key);
    onSidebarChange(key);
  };

  return (
    <ul className='flex flex-col items-start self-stretch'>
      {MENU_ITEMS.map((item) => (
        <MenuItemComponent
          key={item.key}
          item={item}
          isActive={activeItem === item.key}
          onClick={handleMenuClick}
        />
      ))}
    </ul>
  );
};

export default NavigationMenu;