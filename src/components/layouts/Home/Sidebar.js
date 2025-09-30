import styles from './sidebar.module.css';
import SidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import RecentlyOpenedSection from './RecentlyOpenedSection';
import StorageWidget from './StorageWidget';
import Navbar from './Navbar';

const Sidebar = ({ onSidebarChange, activeSection }) => {
  return (
    <div className='flex'>
      <Navbar />

      <nav className='flex flex-col min-h-screen items-start w-60 lg:w-[267px] px-4 py-4 lg:px-6 lg:py-6 flex-shrink-0 gap-6 lg:gap-8 border-r border-l border-gray-200 bg-white'>
        <SidebarHeader />

        <div className='flex flex-col items-start self-stretch flex-1 gap-4'>
          <NavigationMenu
            onSidebarChange={onSidebarChange}
            activeSection={activeSection}
          />

          <svg xmlns="http://www.w3.org/2000/svg" width="219" height="2" viewBox="0 0 219 2" fill="none">
            <path d="M0 1H219" stroke="#F2F2F3" />
          </svg>

          <RecentlyOpenedSection />
        </div>

        <StorageWidget />
      </nav>
    </div>
  );
};

export default Sidebar;