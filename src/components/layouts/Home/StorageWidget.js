// StorageWidget.js
import styles from './sidebar.module.css';

const StorageWidget = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3 self-stretch p-4 rounded-lg border border-stroke-500 bg-white shadow-custom'>
      <div className='flex justify-between items-center self-stretch'>
        <h3 className='text-semibold-14 text-center'>Available Storage</h3>
        <h3 className='text-semibold-14 text-center'>50%</h3>
      </div>
      <div className='flex flex-col items-start gap-2 self-stretch'>
        <svg xmlns="http://www.w3.org/2000/svg" width="187" height="8" viewBox="0 0 187 8" fill="none">
          <rect width="187" height="8" rx="4" fill="#D9D9D9" />
          <rect width="93" height="8" rx="4" fill="url(#paint0_linear_104_12725)" />
          <defs>
            <linearGradient id="paint0_linear_104_12725" x1="0" y1="4" x2="93" y2="4" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4C3CC6" />
              <stop offset="1" stopColor="#7E60F8" />
            </linearGradient>
          </defs>
        </svg>
        <div className='flex justify-center items-start gap-0.5 self-stretch'>
          <div className='flex items-center gap-0.25 flex-1'>
            <h3 className='text-medium-12 text-center'>25GB used</h3>
            <h3 className='text-regular-12-neutral-400 text-center'>of 50GB</h3>
          </div>
          <h3 className='text-regular-12-neutral-500'>See details</h3>
        </div>
      </div>
      <button className={styles.navbar_btn}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M9.16666 1.33325L3.22896 8.45849C2.99643 8.73753 2.88016 8.87706 2.87838 8.99489C2.87683 9.09733 2.92248 9.19479 3.00217 9.25918C3.09383 9.33325 3.27545 9.33325 3.63868 9.33325H8.49999L7.83333 14.6666L13.771 7.54135C14.0036 7.2623 14.1198 7.12278 14.1216 7.00494C14.1232 6.90251 14.0775 6.80505 13.9978 6.74066C13.9062 6.66659 13.7245 6.66659 13.3613 6.66659H8.49999L9.16666 1.33325Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className='text-medium-14-white text-center'>Upgrade Plan</h3>
      </button>
    </div>
  );
};

export default StorageWidget;