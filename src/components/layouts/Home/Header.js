import { BellIcon, QuestionIcon } from '@/components/ui/icons';
import styles from './header.module.css';

const Header = () => {
  return (
    <div className='flex items-center justify-between self-stretch py-4 px-4 md:py-5 md:px-8 border-b border-stroke-200 bg-white dark:bg-neutral-900 dark:border-neutral-800'>
      
      {/* جستجو */}
      <div className='flex items-center gap-2.5 flex-1 max-w-md'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="header-search-icon shrink-0">
          <path d="M14 14L11.6667 11.6667M13.3333 7.66667C13.3333 10.7963 10.7963 13.3333 7.66667 13.3333C4.53705 13.3333 2 10.7963 2 7.66667C2 4.53705 4.53705 2 7.66667 2C10.7963 2 13.3333 4.53705 13.3333 7.66667Z" stroke="#58585F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input 
          type="text" 
          placeholder='What are you looking for?' 
          className='hidden sm:block text-sm dark:bg-neutral-900 text-neutral-300 dark:text-neutral-400 outline-0 w-full' 
        />
      </div>

      {/* دکمه‌های سمت راست */}
      <div className='flex items-center justify-center gap-2 md:gap-3'>
        
        {/* دکمه دعوت - فقط دسکتاپ */}
        <button className='hidden lg:flex h-8 justify-center items-center gap-1.5 bg-white shadow-light py-3 pr-4 pl-3 border border-[#ECECEE] rounded-lg header-invite-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M2 14V12.6667C2 11.9594 2.28095 11.2811 2.78105 10.781C3.28115 10.281 3.95942 10 4.66667 10H7.33333C7.97333 10 8.56 10.2253 9.02 10.6007M10.6667 2.08659C11.2403 2.23346 11.7487 2.56706 12.1118 3.0348C12.4748 3.50254 12.6719 4.07781 12.6719 4.66992C12.6719 5.26204 12.4748 5.83731 12.1118 6.30505C11.7487 6.77279 11.2403 7.10639 10.6667 7.25326M10.6667 12.6667H14.6667M12.6667 10.6667V14.6667M3.33333 4.66667C3.33333 5.37391 3.61428 6.05219 4.11438 6.55229C4.61448 7.05238 5.29276 7.33333 6 7.33333C6.70724 7.33333 7.38552 7.05238 7.88562 6.55229C8.38572 6.05219 8.66667 5.37391 8.66667 4.66667C8.66667 3.95942 8.38572 3.28115 7.88562 2.78105C7.38552 2.28095 6.70724 2 6 2C5.29276 2 4.61448 2.28095 4.11438 2.78105C3.61428 3.28115 3.33333 3.95942 3.33333 4.66667Z" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className='text-sm font-medium dark:text-white whitespace-nowrap'>Invite members</h3>
        </button>

        {/* اعلان‌ها */}
        <div className='relative w-8 h-8'>
          <button className='btn-icon header-btn-icon w-full h-full'>
            <BellIcon />
          </button>
          <div className='absolute top-1 right-1 w-2 h-2 bg-[#BC1828] rounded-full' />
        </div>

        {/* راهنما */}
        <button className='btn-icon header-btn-icon'>
          <QuestionIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;