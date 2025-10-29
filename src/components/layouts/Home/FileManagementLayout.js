import Sidebar from './Sidebar'
import Header from './Header'

const FileManagementLayout = ({ children, onSidebarChange, activeSection }) => {
    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white relative '>
            <div className='flex w-full max-w-[1440px] relative'>
                <Sidebar
                    onSidebarChange={onSidebarChange}
                    activeSection={activeSection}
                />
                <div className='flex flex-1 flex-col items-start flex-shrink-0 border-t border-r border-l border-[#F2F2F3] dark:border-neutral-500 relative z-10'>
                    <Header />
                    {children}
                </div>
            </div>
        </div>
    )
}

export default FileManagementLayout;