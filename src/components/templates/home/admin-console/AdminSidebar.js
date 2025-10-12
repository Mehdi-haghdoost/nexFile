import { BillingIcon, CollapseSidebarIcon, ContentIcon, GroupIcon, MembersIcon, OverviewsIcon, SecurityIcon, SelectorIcon, SettingsIcon } from '@/components/ui/icons'
import React from 'react'


const adminMenuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: OverviewsIcon },
    { id: 'Members', label: 'Members', icon: MembersIcon },
    { id: 'Groups', label: 'Groups', icon: GroupIcon },
    { id: 'Content', label: 'Content', icon: ContentIcon },
    { id: 'Security', label: 'Security', icon: SecurityIcon },
    { id: 'Billing', label: 'Billing', icon: BillingIcon },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
];

const AdminSidebar = ({ isCollapsed, onCollapseToggle, onBackToNexFile, activeSection, onSectionSelect }) => {
    

    const sidebarClasses = `
        flex flex-col items-start gap-8 flex-shrink-0 bg-white border-r border-solid border-[#F2F2F3]
        transition-[width,padding] duration-300 ease-in-out h-full sticky top-0 z-10
        ${isCollapsed ? 'w-16 p-2' : 'w-[267px] p-6'}
    `.trim();


    const baseItemClasses = 'flex items-center gap-2 self-stretch h-[38px] py-1 px-3 rounded-lg cursor-pointer transition-all duration-200';

    return (

        <div className={sidebarClasses}>
            {/* Navbar Header (Back to NexFile/Collapse Button) */}
            <div className={`flex items-center h-[42px] flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch gap-2'}`}>
                
                {/* Back to NexFile Button - Visible only when expanded */}
                {!isCollapsed ? (
                    <button
                        onClick={onBackToNexFile}
                        className="flex items-center text-start gap-2 hover:opacity-70 transition-opacity flex-1"
                        title="Back to NexFile"
                    >

                        <SelectorIcon />
                        <h3 className='text-medium-16 flex-1 whitespace-nowrap'>Back to NexFile</h3>
                    </button>
                ) : (
                    null
                )}

                {/* Collapse Button */}
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
            <nav className='flex flex-1 flex-col items-start gap-4 self-stretch'>
                
                <div 
                    className={`flex items-center gap-3 self-stretch h-[38px] py-1 px-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100'}`}
                >
                    <h3 className='text-regular-12-upper'>ADMIN CONSOLE</h3>
                </div>

                {/* Menu Items Container */}
                <ul role="menu" className='w-full flex flex-col items-start self-stretch gap-1'>
                    {adminMenuItems.map((item) => {
                        
                        const conditionalClasses = activeSection === item.id 
                            ? 'border border-[#ECECEE] bg-[#F2F2F3] text-neutral-500' 
                            : 'text-neutral-400 hover:border hover:border-[#E1E0E5] hover:bg-[#F6F6F7]';
                            
                        return (
                            <li 
                                key={item.id}
                                role="menuitem"
                                className={`${baseItemClasses} ${conditionalClasses}`}
                                onClick={() => onSectionSelect(item.id)}
                            >
                                <item.icon />
                                
                                {/* Label - Hidden when collapsed */}
                                {!isCollapsed && (
                                    <h3 className='text-medium-14 flex-1 whitespace-nowrap overflow-hidden'>
                                        {item.label}
                                    </h3>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default AdminSidebar
