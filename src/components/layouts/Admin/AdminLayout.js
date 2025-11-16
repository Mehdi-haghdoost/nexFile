import AdminSidebar from '@/components/templates/home/admin-console/AdminSidebar';
import AdminHeader from '@/components/templates/home/admin-console/AdminHeader';
import { useState } from 'react';
import { ADMIN_SECTIONS } from '@/utils/constants/adminConstants';

const AdminLayout = ({ children, onSidebarChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState(ADMIN_SECTIONS.DASHBOARD);

    const handleCollapseToggle = () => setIsCollapsed(prev => !prev);

    return (
        <div className='flex items-start bg-white h-screen w-full'>
            <AdminSidebar 
                onBackToNexFile={onSidebarChange} 
                activeSection={activeSection}
                onSectionSelect={setActiveSection}
                isCollapsed={isCollapsed}
                onCollapseToggle={handleCollapseToggle} 
            />
            
            <div className='flex flex-1 flex-col items-start flex-shrink-0 w-full h-screen border-t border-r border-solid border-[#F2F2F3]'>
                <AdminHeader activeSection={activeSection} />
                <main className='flex-1 w-full overflow-auto'>
                    {typeof children === 'function' ? children({ activeSection }) : children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;