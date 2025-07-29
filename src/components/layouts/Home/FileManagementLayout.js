import Sidebar from './Sidebar'
import Header from './Header'
import ActionButtons from './ActionButtons'

import styles from './fileManagementLayout.module.css'


const FileManagementLayout = ({ children, onSidebarChange }) => {
    return (
        <div className='flex jusify-center items-start w-full min-h-screen bg-white'>
            <div className='flex w-full max-w-[1440px]'>
                <Sidebar onSidebarChange={onSidebarChange} />
                <div className='flex flex-1 flex-col'>
                    <Header />
                    <ActionButtons />
                    {children}
                </div>
            </div>
        </div>
    )
}

export default FileManagementLayout;