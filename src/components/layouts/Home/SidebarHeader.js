'use client';
import useAuthStore from '@/store/auth/authStore';
import styles from './sidebar.module.css';

const SidebarHeader = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className='flex h-[42px] items-center gap-3 flex-shrink-0 self-stretch animate-pulse'>
        <div className='w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-full' />
        <div className='flex flex-col justify-center items-start flex-1 gap-2'>
          <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded' />
          <div className='h-3 w-32 bg-gray-200 dark:bg-neutral-700 rounded' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-[42px] items-center gap-3 flex-shrink-0 self-stretch'>
      <div className={styles.navbar_img}>
        {user?.image ? (
          <img 
            src={user.image} 
            alt={user.name} 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-white font-semibold text-sm rounded-full">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className='flex flex-col justify-center items-start flex-1'>
        <p className='text-medium-16 dark:text-medium-16-neutral-500 truncate max-w-[150px]'>
          {user?.name || 'User'}
        </p>
        <p className='text-regular-12 dark:text-regular-12-neutral-300 truncate max-w-[150px]'>
          {user?.email || 'user@example.com'}
        </p>
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path 
            d="M4.66666 9.99996L7.99999 13.3333L11.3333 9.99996M4.66666 5.99996L7.99999 2.66663L11.3333 5.99996" 
            className="stroke-[#737379] dark:stroke-[#9F9FA3]"
            strokeWidth="1.2"
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    </div>
  );
};

export default SidebarHeader;