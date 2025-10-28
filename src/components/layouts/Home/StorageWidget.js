import styles from './sidebar.module.css';

const StorageWidget = () => {
  return (
    <div className="relative">
      {/* Divider */}
      <div className="absolute -top-1 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="225" height="11" viewBox="0 0 225 11" fill="none">
          <g filter="url(#filter0_d_272_30345)">
            <mask id="path-1-inside-1_272_30345" fill="white">
              <path d="M4 2H221V3H4V2Z" />
            </mask>
            <path d="M4 3H221V1H4V3Z" fill="url(#paint0_linear_272_30345)" mask="url(#path-1-inside-1_272_30345)" />
          </g>
          <g filter="url(#filter1_f_272_30345)">
            <mask id="path-3-inside-2_272_30345" fill="white">
              <path d="M35.9121 2H189.089V3H35.9121V2Z" />
            </mask>
            <path d="M35.9121 3.5H189.089V0.5H35.9121V3.5Z" fill="url(#paint1_linear_272_30345)" mask="url(#path-3-inside-2_272_30345)" />
          </g>
          <defs>
            <filter id="filter0_d_272_30345" x="0" y="2" width="225" height="9" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_272_30345" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_272_30345" result="shape" />
            </filter>
            <filter id="filter1_f_272_30345" x="33.9121" y="0" width="157.176" height="5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_272_30345" />
            </filter>
            <linearGradient id="paint0_linear_272_30345" x1="221" y1="2.5" x2="4" y2="2.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.5" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_272_30345" x1="189.089" y1="2.5" x2="35.9121" y2="2.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.5" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* StorageWidget */}
      <div className='flex flex-col justify-center items-center gap-3 self-stretch p-4 rounded-lg border border-stroke-500 bg-white shadow-custom dark:rounded-lg dark:border dark:border-white/0 dark:bg-[#1E1E23] dark:shadow-dark-storage'>
        <div className='flex justify-between items-center self-stretch'>
          <h3 className='text-semibold-14 text-center dark:text-medium-14-white'>Available Storage</h3>
          <h3 className='text-semibold-14 text-center dark:text-semibold-14-white'>50%</h3>
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
              <h3 className='text-medium-12 text-center dark:text-medium-12-white'>25GB used</h3>
              <h3 className='text-regular-12-neutral-400 text-center dark:text-regular-12-neutral-200'>of 50GB</h3>
            </div>
            <h3 className='text-regular-12-neutral-500 dark:text-regular-12-white'>See details</h3>
          </div>
        </div>
        <button className={`${styles.navbar_btn} border dark:!border-transparent dark:!bg-gradient-to-b dark:!from-[#4C3CC6] dark:!to-[#7E60F8]`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path d="M9.16666 1.33325L3.22896 8.45849C2.99643 8.73753 2.88016 8.87706 2.87838 8.99489C2.87683 9.09733 2.92248 9.19479 3.00217 9.25918C3.09383 9.33325 3.27545 9.33325 3.63868 9.33325H8.49999L7.83333 14.6666L13.771 7.54135C14.0036 7.2623 14.1198 7.12278 14.1216 7.00494C14.1232 6.90251 14.0775 6.80505 13.9978 6.74066C13.9062 6.66659 13.7245 6.66659 13.3613 6.66659H8.49999L9.16666 1.33325Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className='text-medium-14-white text-center'>Upgrade Plan</h3>
        </button>
      </div>
    </div>
  );
};

export default StorageWidget;