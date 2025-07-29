import Sidebar from './Sidebar'
import Header from './Header'
import ActionButtons from './ActionButtons'

import styles from './fileManagementLayout.module.css'


const FileManagementLayout = ({ children, onSidebarChange }) => {
    return (
        <div className='home-container'>
            <Sidebar onSidebarChange={onSidebarChange} />
            <div className='main-area'>
                <Header />
                <ActionButtons />
                {children}
            </div>
        </div>
    )
}

export default FileManagementLayout;