import React from 'react';
import { adminMenuItems } from '@/utils/constants/adminConstants';
import SidebarHeader from '@/components/modules/admin-console/adminSidebar/SidebarHeader';
import MenuItems from '@/components/modules/admin-console/adminSidebar/MenuItems';

const AdminSidebar = ({
    isCollapsed,
    onCollapseToggle,
    onBackToNexFile,
    activeSection,
    onSectionSelect
}) => {
    const sidebarClasses = `
        flex flex-col items-start gap-8 flex-shrink-0 bg-white dark:bg-neutral-900 dark:border-neutral-700 border-r border-solid border-[#F2F2F3] h-full
        transition-[width,padding] duration-300 ease-in-out sticky top-0 z-10
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

// Sidebar Title Component (همچنان داخلی)
const SidebarTitle = ({ isCollapsed }) => (
    <div
        className={`flex items-center gap-3 self-stretch h-[38px] py-1 px-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100'
            }`}
    >
        <h3 className='text-regular-12-upper dark:text-regular-12-neutral-200'>ADMIN CONSOLE</h3>
    </div>
);

export default AdminSidebar;