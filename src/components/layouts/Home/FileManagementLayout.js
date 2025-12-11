import Sidebar from './Sidebar';
import Header from './Header';

const FileManagementLayout = ({ children, onSidebarChange, activeSection }) => {
    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white dark:bg-neutral-900 overflow-x-hidden'>
            <div className='flex w-full max-w-[1440px] overflow-x-hidden'>
                
                <div className='flex-shrink-0'>
                    <Sidebar
                        onSidebarChange={onSidebarChange}
                        activeSection={activeSection}
                    />
                </div>
                
                {/* Content اصلی */}
                <div className='flex flex-1 flex-col items-start min-w-0 border-t md:border-r md:border-l border-[#F2F2F3] dark:border-neutral-500 relative z-10'>
                    <Header />
                    
                    {/* محتوای صفحه */}
                    <main className='w-full flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar'>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FileManagementLayout;