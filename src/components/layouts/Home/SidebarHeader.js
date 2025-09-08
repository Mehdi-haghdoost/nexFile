import styles from './sidebar.module.css';

const SidebarHeader = () => {
  return (
    <div className='flex h-[42px] items-center gap-3 flex-shrink-0 self-stretch'>
      <div className={styles.navbar_img}>
      </div>
      <div className='flex flex-col justify-center items-start flex-1'>
        <p className='text-medium-16'>
          Ridwan T.
        </p>
        <p className='text-regular-12 '>
          ridwant@gmail.com
        </p>
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.66666 9.99996L7.99999 13.3333L11.3333 9.99996M4.66666 5.99996L7.99999 2.66663L11.3333 5.99996" stroke="#737379" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default SidebarHeader;