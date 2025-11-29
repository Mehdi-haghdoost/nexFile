import Sidebar from './Sidebar';
import Header from './Header';

const FileManagementLayout = ({ children, onSidebarChange, activeSection }) => {
    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white dark:bg-neutral-900'>
            <div className='flex w-full max-w-[1440px] relative'>
                
                <Sidebar
                    onSidebarChange={onSidebarChange}
                    activeSection={activeSection}
                />
                
                {/* Content اصلی */}
                <div className='flex flex-1 flex-col items-start flex-shrink-0 w-full border-t md:border-r md:border-l border-[#F2F2F3] dark:border-neutral-500 relative z-10'>
                    <Header />
                    
                    {/* محتوای صفحه */}
                    <main className='w-full flex-1 overflow-auto custom-scrollbar'>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FileManagementLayout;