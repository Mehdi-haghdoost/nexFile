import AdminSidebar from '@/components/templates/home/admin-console/AdminSidebar';
import AdminHeader from '@/components/templates/home/admin-console/AdminHeader';
import { useState } from 'react';

// AdminLayout اکنون وضعیت Collapsed و همچنین وضعیت منوی فعال داخلی (Dashboard, Members, ...) را مدیریت می‌کند.
const AdminLayout = ({ children, onSidebarChange }) => {
    
    // 1. مدیریت وضعیت بسته بودن سایدبار
    const [isCollapsed, setIsCollapsed] = useState(false);
    const handleCollapseToggle = () => setIsCollapsed(prev => !prev);
    
    // 2. مدیریت وضعیت فعال داخلی (Dashboard, Members, Groups, ...)
    const [activeAdminSection, setActiveAdminSection] = useState('Dashboard');

    return (
        <div className='flex items-start bg-white min-h-screen w-full'>
            <AdminSidebar 
                onBackToNexFile={onSidebarChange} // برای بازگشت به 'all-folders' در Home.js
                activeSection={activeAdminSection}
                onSectionSelect={setActiveAdminSection}
                isCollapsed={isCollapsed}
                onCollapseToggle={handleCollapseToggle} 
            />
            
            {/* Main content area takes remaining width and has top/right/bottom border */}
            <div className={`flex flex-1 flex-col items-start flex-shrink-0 w-full min-h-screen border-t border-r border-solid border-[#F2F2F3]`}>
                <AdminHeader />
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
