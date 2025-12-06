import AdminSidebar from '@/components/templates/home/admin-console/AdminSidebar';
import AdminHeader from '@/components/templates/home/admin-console/AdminHeader';
import { useState } from 'react';
import { ADMIN_SECTIONS } from '@/utils/constants/adminConstants';

const AdminLayout = ({ children, onSidebarChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(ADMIN_SECTIONS.DASHBOARD);

    const handleCollapseToggle = () => setIsCollapsed(prev => !prev);
    const handleMobileMenuToggle = () => setIsMobileMenuOpen(prev => !prev);

    return (
        <div className='flex items-start bg-white dark:bg-neutral-900 min-h-screen w-full overflow-hidden'>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden'
                    onClick={handleMobileMenuToggle}
                />
            )}

            {/* Sidebar - Desktop: sticky, Mobile: drawer */}
            <div className={`
                fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-10
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <AdminSidebar
                    onBackToNexFile={onSidebarChange}
                    activeSection={activeSection}
                    onSectionSelect={(section) => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false); // Close mobile menu on selection
                    }}
                    isCollapsed={isCollapsed}
                    onCollapseToggle={handleCollapseToggle}
                />
            </div>

            {/* Main Content */}
            <div className='flex flex-1 flex-col items-start flex-shrink-0 w-full min-h-screen border-t border-r border-solid border-[#F2F2F3] dark:border-neutral-700'>
                <AdminHeader 
                    activeSection={activeSection}
                    onMobileMenuToggle={handleMobileMenuToggle}
                />
                <main className='flex-1 w-full overflow-auto custom-scrollbar'>
                    {typeof children === 'function' ? children({ activeSection }) : children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;