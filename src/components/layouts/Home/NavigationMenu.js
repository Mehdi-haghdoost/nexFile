'use client';
import { useState } from 'react';
import MenuItemComponent from './MenuItemComponent';
import { MENU_ITEMS } from './menuConfig';

const NavigationMenu = ({ onSidebarChange, activeSection }) => {
  const handleMenuClick = (key) => {
    onSidebarChange(key);
  };

  return (
    <ul className='flex flex-col items-start self-stretch'>
      {MENU_ITEMS.map((item) => (
        <MenuItemComponent
          key={item.key}
          item={item}
          isActive={(activeSection || 'all-folders') === item.key}
          onClick={handleMenuClick}
        />
      ))}
    </ul>
  );
};

export default NavigationMenu;