import AdminSidebar from '@/components/templates/home/admin-console/AdminSidebar';
import styles from './adminLayout.module.css';
import AdminHeader from '@/components/templates/home/admin-console/AdminHeader';

const AdminLayout = ({ children, onSidebarChange }) => {
    return (
        <div className='admin-container'>
            <AdminSidebar onSidebarChange={onSidebarChange} />
            <div className='admin-main-area'>
                <AdminHeader />
                {children}
            </div>
        </div>
    )
}

export default AdminLayout