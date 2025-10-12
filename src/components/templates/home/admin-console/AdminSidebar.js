import { CollapseSidebarIcon, SelectorIcon } from '@/components/ui/icons';
import React from 'react';
import { adminMenuItems } from '@/utils/constants/adminConstants';

const AdminSidebar = ({ 
    isCollapsed, 
    onCollapseToggle, 
    onBackToNexFile, 
    activeSection, 
    onSectionSelect 
}) => {
    const sidebarClasses = `
        flex flex-col items-start gap-8 flex-shrink-0 bg-white border-r border-solid border-[#F2F2F3]
        transition-[width,padding] duration-300 ease-in-out h-full sticky top-0 z-10
        ${isCollapsed ? 'w-16 p-2' : 'w-[267px] p-6'}
    `.trim();

    return (
        <div className={sidebarClasses}>
            <SidebarHeader 
                isCollapsed={isCollapsed}
                onBackToNexFile={onBackToNexFile}
                onCollapseToggle={onCollapseToggle}
            />

            <nav className='flex flex-1 flex-col items-start gap-4 self-stretch'>
                <SidebarTitle isCollapsed={isCollapsed} />
                
                <MenuItems 
                    items={adminMenuItems}
                    activeSection={activeSection}
                    onSectionSelect={onSectionSelect}
                    isCollapsed={isCollapsed}
                />
            </nav>
        </div>
    );
};

// Sidebar Header Component
const SidebarHeader = ({ isCollapsed, onBackToNexFile, onCollapseToggle }) => (
    <div className={`flex items-center h-[42px] flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch gap-2'}`}>
        {!isCollapsed && (
            <button
                onClick={onBackToNexFile}
                className="flex items-center text-start gap-2 hover:opacity-70 transition-opacity flex-1"
                title="Back to NexFile"
            >
                <SelectorIcon />
                <h3 className='text-medium-16 flex-1 whitespace-nowrap'>Back to NexFile</h3>
            </button>
        )}

        <button
            onClick={onCollapseToggle}
            className="p-1 hover:bg-[#F2F2F3] rounded transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <CollapseSidebarIcon />
            </div>
        </button>
    </div>
);

// Sidebar Title Component
const SidebarTitle = ({ isCollapsed }) => (
    <div 
        className={`flex items-center gap-3 self-stretch h-[38px] py-1 px-3 transition-opacity duration-200 ${
            isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100'
        }`}
    >
        <h3 className='text-regular-12-upper'>ADMIN CONSOLE</h3>
    </div>
);

// Menu Items Component
const MenuItems = ({ items, activeSection, onSectionSelect, isCollapsed }) => {
    const baseItemClasses = 'flex items-center gap-2 self-stretch h-[38px] py-1 px-3 rounded-lg cursor-pointer transition-all duration-200';

    const getItemClasses = (itemId) => {
        const isActive = activeSection === itemId;
        const conditionalClasses = isActive
            ? 'border border-[#ECECEE] bg-[#F2F2F3] text-neutral-500' 
            : 'text-neutral-400 hover:border hover:border-[#E1E0E5] hover:bg-[#F6F6F7]';
        return `${baseItemClasses} ${conditionalClasses}`;
    };

    return (
        <ul role="menu" className='w-full flex flex-col items-start self-stretch gap-1'>
            {items.map((item) => (
                <MenuItem
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed}
                    className={getItemClasses(item.id)}
                    onClick={() => onSectionSelect(item.id)}
                />
            ))}
        </ul>
    );
};

// Menu Item Component
const MenuItem = ({ item, isCollapsed, className, onClick }) => (
    <li 
        role="menuitem"
        className={className}
        onClick={onClick}
    >
        <item.icon />
        {!isCollapsed && (
            <h3 className='text-medium-14 flex-1 whitespace-nowrap overflow-hidden'>
                {item.label}
            </h3>
        )}
    </li>
);

export default AdminSidebar;