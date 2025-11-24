import styles from '../styles/page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.landing}>
      <div className={`${styles.landing_background}`}>
        {/* Header با دکمه‌ها */}
        <div className='w-full flex items-start justify-between mb-6 gap-8'>
          <h1 className={styles.landing_title}>File Management Dashboard</h1>
          
          {/* دکمه‌های Call to Action */}
          <div className='flex gap-3 flex-shrink-0 pt-1'>
            <Link href="/login-register">
              <button className='group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300 overflow-hidden text-sm'>
                <span className='relative z-10'>Get Started</span>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </button>
            </Link>
            <Link href="/login-register">
              <button className='group relative px-6 py-2.5 rounded-xl border-2 border-white/80 text-white font-semibold backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 shadow-lg text-sm'>
                <span className='relative z-10 flex items-center gap-2'>
                  Sign In
                  <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>

        <div className='flex flex-col items-start gap-5 flex-1'>
          {/* Logo Section */}
          <div className='logomark_container inline-flex py-6 item-center justify-center gap-3'>
            <div className={styles.logomark}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 25 18" fill="none">
                <path d="M16.3184 1.31818C20.5608 1.31828 23.9999 4.75741 24 8.99982C24 13.07 20.8342 16.4012 16.8311 16.6649L16.583 16.6815H7.0459C3.70714 16.6815 1.00009 13.9753 1 10.6365C1 7.29772 3.70709 4.59064 7.0459 4.59064C7.83163 4.59069 8.58124 4.74057 9.26855 5.01251L9.64941 5.1629L9.87207 4.82013C11.2426 2.7112 13.618 1.31818 16.3184 1.31818Z" fill="url(#paint0_linear_11_357)" stroke="url(#paint1_linear_11_357)" />
                <defs>
                  <linearGradient id="paint0_linear_11_357" x1="12.5" y1="5" x2="12.5" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#B7ABEB" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_11_357" x1="12.5" y1="0.818176" x2="12.5" y2="17.1818" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className={styles.logomark_title}>NexFile</h2>
          </div>
          
          {/* Screens Badge */}
          <div className={styles.landing_screens}>
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 65 65" fill="none">
              <rect x="0.566498" y="0.533264" width="64" height="64" rx="32" fill="white" />
              <path d="M20.045 20.3778C20.045 16.9482 22.8252 14.1679 26.2549 14.1679H32.4647V26.5876H26.2549C22.8252 26.5876 20.045 23.8074 20.045 20.3778Z" fill="#F24E1E" />
              <path d="M44.8843 20.3778C44.8843 16.9482 42.1041 14.1679 38.6745 14.1679H32.4646V26.5876H38.6745C42.1041 26.5876 44.8843 23.8074 44.8843 20.3778Z" fill="#FF7262" />
              <path d="M20.045 32.7976C20.045 29.368 22.8252 26.5878 26.2548 26.5878H32.4647V39.0075H26.2548C22.8252 39.0075 20.045 36.2272 20.045 32.7976Z" fill="#A259FF" />
              <circle cx="38.6735" cy="32.7976" r="6.20985" fill="#1ABCFE" />
              <path d="M20.045 45.2172C20.045 41.7876 22.8252 39.0073 26.2548 39.0073H32.4647V45.2172C32.4647 48.6468 29.6844 51.427 26.2548 51.427C22.8252 51.427 20.045 48.6468 20.045 45.2172Z" fill="#0ACF83" />
            </svg>
            <div className='flex flex-col items-center justify-center'>
              <p className='text-white text-center text-[26px] font-semibold leading-normal tracking-[-0.9px]'>150+</p>
              <p className='text-white text-center text-[14px] not-italic font-normal leading-normal'>Screens</p>
            </div>
          </div>
          
          {/* Features Footer */}
          <div className={styles.landing_footer}>
            <div>
              <div className={styles.landing_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 31 30" fill="none">
                  <path d="M15.6665 2.55566C8.80961 2.55566 3.22205 8.14322 3.22205 15.0001C3.22205 21.857 8.80961 27.4445 15.6665 27.4445C22.5234 27.4445 28.1109 21.857 28.1109 15.0001C28.1109 8.14322 22.5234 2.55566 15.6665 2.55566ZM21.6149 12.1379L14.5589 19.1939C14.3847 19.3681 14.1483 19.4677 13.8994 19.4677C13.6505 19.4677 13.4141 19.3681 13.2398 19.1939L9.71805 15.6721C9.35716 15.3112 9.35716 14.7139 9.71805 14.353C10.0789 13.9921 10.6763 13.9921 11.0372 14.353L13.8994 17.2152L20.2958 10.8188C20.6567 10.4579 21.2541 10.4579 21.6149 10.8188C21.9758 11.1797 21.9758 11.7646 21.6149 12.1379Z" fill="white" />
                </svg>
              </div>
              <p className='text-white text-[14px] font-medium not-italic leading-[150%] tracking-[-0.4px]'>Auto Layout</p>
            </div>
            <div>
              <div className={styles.landing_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 31 30" fill="none">
                  <path d="M15.6665 2.55566C8.80961 2.55566 3.22205 8.14322 3.22205 15.0001C3.22205 21.857 8.80961 27.4445 15.6665 27.4445C22.5234 27.4445 28.1109 21.857 28.1109 15.0001C28.1109 8.14322 22.5234 2.55566 15.6665 2.55566ZM21.6149 12.1379L14.5589 19.1939C14.3847 19.3681 14.1483 19.4677 13.8994 19.4677C13.6505 19.4677 13.4141 19.3681 13.2398 19.1939L9.71805 15.6721C9.35716 15.3112 9.35716 14.7139 9.71805 14.353C10.0789 13.9921 10.6763 13.9921 11.0372 14.353L13.8994 17.2152L20.2958 10.8188C20.6567 10.4579 21.2541 10.4579 21.6149 10.8188C21.9758 11.1797 21.9758 11.7646 21.6149 12.1379Z" fill="white" />
                </svg>
              </div>
              <p className='text-white text-[14px] font-medium not-italic leading-[150%] tracking-[-0.4px]'>Reuse Component</p>
            </div>
            <div>
              <div className={styles.landing_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 31 30" fill="none">
                  <path d="M15.6665 2.55566C8.80961 2.55566 3.22205 8.14322 3.22205 15.0001C3.22205 21.857 8.80961 27.4445 15.6665 27.4445C22.5234 27.4445 28.1109 21.857 28.1109 15.0001C28.1109 8.14322 22.5234 2.55566 15.6665 2.55566ZM21.6149 12.1379L14.5589 19.1939C14.3847 19.3681 14.1483 19.4677 13.8994 19.4677C13.6505 19.4677 13.4141 19.3681 13.2398 19.1939L9.71805 15.6721C9.35716 15.3112 9.35716 14.7139 9.71805 14.353C10.0789 13.9921 10.6763 13.9921 11.0372 14.353L13.8994 17.2152L20.2958 10.8188C20.6567 10.4579 21.2541 10.4579 21.6149 10.8188C21.9758 11.1797 21.9758 11.7646 21.6149 12.1379Z" fill="white" />
                </svg>
              </div>
              <p className='text-white text-[14px] font-medium not-italic leading-[150%] tracking-[-0.4px]'>Styleguide Included</p>
            </div>
            <div>
              <div className={styles.landing_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 31 30" fill="none">
                  <path d="M15.6665 2.55566C8.80961 2.55566 3.22205 8.14322 3.22205 15.0001C3.22205 21.857 8.80961 27.4445 15.6665 27.4445C22.5234 27.4445 28.1109 21.857 28.1109 15.0001C28.1109 8.14322 22.5234 2.55566 15.6665 2.55566ZM21.6149 12.1379L14.5589 19.1939C14.3847 19.3681 14.1483 19.4677 13.8994 19.4677C13.6505 19.4677 13.4141 19.3681 13.2398 19.1939L9.71805 15.6721C9.35716 15.3112 9.35716 14.7139 9.71805 14.353C10.0789 13.9921 10.6763 13.9921 11.0372 14.353L13.8994 17.2152L20.2958 10.8188C20.6567 10.4579 21.2541 10.4579 21.6149 10.8188C21.9758 11.1797 21.9758 11.7646 21.6149 12.1379Z" fill="white" />
                </svg>
              </div>
              <p className='text-white text-[14px] font-medium not-italic leading-[150%] tracking-[-0.4px]'>Easy Customizable</p>
            </div>
            <div>
              <div className={styles.landing_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 31 30" fill="none">
                  <path d="M15.6665 2.55566C8.80961 2.55566 3.22205 8.14322 3.22205 15.0001C3.22205 21.857 8.80961 27.4445 15.6665 27.4445C22.5234 27.4445 28.1109 21.857 28.1109 15.0001C28.1109 8.14322 22.5234 2.55566 15.6665 2.55566ZM21.6149 12.1379L14.5589 19.1939C14.3847 19.3681 14.1483 19.4677 13.8994 19.4677C13.6505 19.4677 13.4141 19.3681 13.2398 19.1939L9.71805 15.6721C9.35716 15.3112 9.35716 14.7139 9.71805 14.353C10.0789 13.9921 10.6763 13.9921 11.0372 14.353L13.8994 17.2152L20.2958 10.8188C20.6567 10.4579 21.2541 10.4579 21.6149 10.8188C21.9758 11.1797 21.9758 11.7646 21.6149 12.1379Z" fill="white" />
                </svg>
              </div>
              <p className='text-white text-[14px] font-medium not-italic leading-[150%] tracking-[-0.4px]'>Light & Dark Theme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}