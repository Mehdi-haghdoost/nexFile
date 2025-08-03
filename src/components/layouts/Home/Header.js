import styles from './header.module.css';

const Header = () => {
  return (
    <div className='flex items-center justify-between self-stretch py-5 px-8 border-b  border-stroke-200 bg-white'>
      <div className='flex items-center gap-2.5'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 14L11.6667 11.6667M13.3333 7.66667C13.3333 10.7963 10.7963 13.3333 7.66667 13.3333C4.53705 13.3333 2 10.7963 2 7.66667C2 4.53705 4.53705 2 7.66667 2C10.7963 2 13.3333 4.53705 13.3333 7.66667Z" stroke="#58585F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <input type="text" placeholder='What are you looking for?' className='text-regular-14-neutral-200 outline-0' />
      </div>
      <div className='flex items-center justify-center gap-3'>
        <button className='flex h-8 justify-center items-center gap-1.5 bg-white shadow-light py-[13px] pr-4 pl-3 border border-[#ECECEE] rounded-lg '>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 14V12.6667C2 11.9594 2.28095 11.2811 2.78105 10.781C3.28115 10.281 3.95942 10 4.66667 10H7.33333C7.97333 10 8.56 10.2253 9.02 10.6007M10.6667 2.08659C11.2403 2.23346 11.7487 2.56706 12.1118 3.0348C12.4748 3.50254 12.6719 4.07781 12.6719 4.66992C12.6719 5.26204 12.4748 5.83731 12.1118 6.30505C11.7487 6.77279 11.2403 7.10639 10.6667 7.25326M10.6667 12.6667H14.6667M12.6667 10.6667V14.6667M3.33333 4.66667C3.33333 5.37391 3.61428 6.05219 4.11438 6.55229C4.61448 7.05238 5.29276 7.33333 6 7.33333C6.70724 7.33333 7.38552 7.05238 7.88562 6.55229C8.38572 6.05219 8.66667 5.37391 8.66667 4.66667C8.66667 3.95942 8.38572 3.28115 7.88562 2.78105C7.38552 2.28095 6.70724 2 6 2C5.29276 2 4.61448 2.28095 4.11438 2.78105C3.61428 3.28115 3.33333 3.95942 3.33333 4.66667Z" stroke="#2E2E37" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <h3 className='text-medium-14'>Invite members</h3>
        </button>
        <div className='w-8 h-8'>
          <button className='btn-icon relative'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className='w-4 h-4'>
              <path d="M9.3333 14H6.66664M12 5.33337C12 4.27251 11.5785 3.25509 10.8284 2.50495C10.0783 1.7548 9.06084 1.33337 7.99997 1.33337C6.93911 1.33337 5.92169 1.7548 5.17154 2.50495C4.4214 3.25509 3.99997 4.27251 3.99997 5.33337C3.99997 7.3935 3.48029 8.80401 2.89975 9.73698C2.41006 10.524 2.16521 10.9174 2.17419 11.0272C2.18413 11.1488 2.20988 11.1951 2.30782 11.2678C2.39628 11.3334 2.79503 11.3334 3.59254 11.3334H12.4074C13.2049 11.3334 13.6037 11.3334 13.6921 11.2678C13.7901 11.1951 13.8158 11.1488 13.8258 11.0272C13.8347 10.9174 13.5899 10.524 13.1002 9.73698C12.5197 8.80401 12 7.3935 12 5.33337Z" stroke="#2E2E37" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <svg className='absolute top-[29px] right-[87px]' xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
            <circle cx="2.5" cy="2.5" r="2.5" fill="#BC1828" />
          </svg>
        </div>
        <button className='btn-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_2402_3025)">
              <path d="M6.06004 6.00004C6.21678 5.55449 6.52614 5.17878 6.93334 4.93946C7.34055 4.70015 7.8193 4.61267 8.28483 4.69252C8.75035 4.77236 9.17259 5.01439 9.47676 5.37573C9.78093 5.73706 9.94741 6.19439 9.94671 6.66671C9.94671 8.00004 7.94671 8.66671 7.94671 8.66671M8.00004 11.3334H8.00671M14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8.00004C1.33337 4.31814 4.31814 1.33337 8.00004 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004Z" stroke="#2E2E37" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_2402_3025">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Header