import styles from './sidebar.module.css';

const SidebarHeader = () => {
  return (
    <div className='flex h-[42px] items-center gap-3 flex-shrink-0 self-stretch'>
      <div className={styles.navbar_img}>
      </div>
      <div className='flex flex-col justify-center items-start flex-1'>
        <p className='text-medium-16 dark:text-medium-16-neutral-500'>
          Ridwan T.
        </p>
        <p className='text-regular-12 dark:text-regular-12-neutral-300'>
          ridwant@gmail.com
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