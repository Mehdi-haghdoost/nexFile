import styles from './sidebar.module.css';

const Sidebar = () => {
  return (
    <div className='flex'>
      <nav className='flex flex-col items-center justify-between min-h-screen px-4 py-4 lg:px-6 lg:py-6 border border-gray-200 bg-white w-14 lg:w-16 relative'>
        <div className='flex flex-col items-start gap-6'>
          <div className={styles.logomark}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="18" viewBox="0 0 25 18" fill="none">
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
          <ul className='flex flex-col items-start gap-6'>
            <li className='flex flex-col items-center justify-center w-10 h-10 gap-1 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M6.66667 14.6667H13.3333M9.18141 2.80333L3.52949 7.19927C3.15168 7.49312 2.96278 7.64005 2.82669 7.82405C2.70614 7.98704 2.61633 8.17065 2.56169 8.36588C2.5 8.58627 2.5 8.82558 2.5 9.30421V15.3333C2.5 16.2667 2.5 16.7335 2.68166 17.09C2.84144 17.4036 3.09641 17.6585 3.41002 17.8183C3.76654 18 4.23325 18 5.16667 18H14.8333C15.7668 18 16.2335 18 16.59 17.8183C16.9036 17.6585 17.1586 17.4036 17.3183 17.09C17.5 16.7335 17.5 16.2667 17.5 15.3333V9.30421C17.5 8.82558 17.5 8.58627 17.4383 8.36588C17.3837 8.17065 17.2939 7.98704 17.1733 7.82405C17.0372 7.64005 16.8483 7.49312 16.4705 7.19927L10.8186 2.80333C10.5258 2.57562 10.3794 2.46177 10.2178 2.418C10.0752 2.37938 9.92484 2.37938 9.78221 2.418C9.62057 2.46177 9.47418 2.57562 9.18141 2.80333Z" stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className='text-medium-12-primary'>Home</h3>
            </li>
            <li className='flex flex-col items-center justify-center w-10 h-10 gap-1 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M4.16667 3.83337H7.5L10 6.33337H15.8333C16.2754 6.33337 16.6993 6.50897 17.0118 6.82153C17.3244 7.13409 17.5 7.55801 17.5 8.00004V14.6667C17.5 15.1087 17.3244 15.5327 17.0118 15.8452C16.6993 16.1578 16.2754 16.3334 15.8333 16.3334H4.16667C3.72464 16.3334 3.30072 16.1578 2.98816 15.8452C2.67559 15.5327 2.5 15.1087 2.5 14.6667V5.50004C2.5 5.05801 2.67559 4.63409 2.98816 4.32153C3.30072 4.00897 3.72464 3.83337 4.16667 3.83337Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className='text-regular-12 text-center'>Folder</h3>
            </li>
            <li className='flex flex-col items-center justify-center w-10 h-10 gap-1 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M10 5.50004C10.4602 5.50004 10.8333 5.12694 10.8333 4.66671C10.8333 4.20647 10.4602 3.83337 10 3.83337C9.53976 3.83337 9.16667 4.20647 9.16667 4.66671C9.16667 5.12694 9.53976 5.50004 10 5.50004Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 11.3334C10.4602 11.3334 10.8333 10.9603 10.8333 10.5C10.8333 10.0398 10.4602 9.66671 10 9.66671C9.53976 9.66671 9.16667 10.0398 9.16667 10.5C9.16667 10.9603 9.53976 11.3334 10 11.3334Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 17.1667C10.4602 17.1667 10.8333 16.7936 10.8333 16.3334C10.8333 15.8731 10.4602 15.5 10 15.5C9.53976 15.5 9.16667 15.8731 9.16667 16.3334C9.16667 16.7936 9.53976 17.1667 10 17.1667Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8333 5.50004C16.2936 5.50004 16.6667 5.12694 16.6667 4.66671C16.6667 4.20647 16.2936 3.83337 15.8333 3.83337C15.3731 3.83337 15 4.20647 15 4.66671C15 5.12694 15.3731 5.50004 15.8333 5.50004Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8333 11.3334C16.2936 11.3334 16.6667 10.9603 16.6667 10.5C16.6667 10.0398 16.2936 9.66671 15.8333 9.66671C15.3731 9.66671 15 10.0398 15 10.5C15 10.9603 15.3731 11.3334 15.8333 11.3334Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8333 17.1667C16.2936 17.1667 16.6667 16.7936 16.6667 16.3334C16.6667 15.8731 16.2936 15.5 15.8333 15.5C15.3731 15.5 15 15.8731 15 16.3334C15 16.7936 15.3731 17.1667 15.8333 17.1667Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.16667 5.50004C4.6269 5.50004 5 5.12694 5 4.66671C5 4.20647 4.6269 3.83337 4.16667 3.83337C3.70643 3.83337 3.33333 4.20647 3.33333 4.66671C3.33333 5.12694 3.70643 5.50004 4.16667 5.50004Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.16667 11.3334C4.6269 11.3334 5 10.9603 5 10.5C5 10.0398 4.6269 9.66671 4.16667 9.66671C3.70643 9.66671 3.33333 10.0398 3.33333 10.5C3.33333 10.9603 3.70643 11.3334 4.16667 11.3334Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.16667 17.1667C4.6269 17.1667 5 16.7936 5 16.3334C5 15.8731 4.6269 15.5 4.16667 15.5C3.70643 15.5 3.33333 15.8731 3.33333 16.3334C3.33333 16.7936 3.70643 17.1667 4.16667 17.1667Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className='text-regular-12 text-center'>More</h3>
            </li>
          </ul>
        </div>
        <div className='flex w-10 h-10 justify-center items-center flex-shrink-0 gap-2.5'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 3.33325V16.6666M12.5 8.33325L10.8333 9.99992L12.5 11.6666M3.33333 4.99992C3.33333 4.55789 3.50893 4.13397 3.82149 3.82141C4.13405 3.50885 4.55797 3.33325 5 3.33325H15C15.442 3.33325 15.8659 3.50885 16.1785 3.82141C16.4911 4.13397 16.6667 4.55789 16.6667 4.99992V14.9999C16.6667 15.4419 16.4911 15.8659 16.1785 16.1784C15.8659 16.491 15.442 16.6666 15 16.6666H5C4.55797 16.6666 4.13405 16.491 3.82149 16.1784C3.50893 15.8659 3.33333 15.4419 3.33333 14.9999V4.99992Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className='absolute w-0 h-10 right-0 top-[88px]'>
          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="40" viewBox="0 0 2 40" fill="none">
            <path d="M1 0L1 40" stroke="#4C3CC6" strokeWidth="1.5" />
          </svg>
        </div>
      </nav>
      <nav className='flex flex-col min-h-screen items-start w-60 lg:w-[267px]  px-4 py-4 lg:px-6 lg:py-6 flex-shrink-0 gap-6 lg:gap-8 border-r border-l border-gray-200 bg-white '>
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

        <div className='flex flex-col items-start self-stretch flex-1 gap-4'>
          {/* Navbar Main Menu */}
          <ul className='flex flex-col items-start self-stretch'>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch nav-item-active'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.6667 5.68004V2.65337C14.6667 1.71337 14.24 1.33337 13.18 1.33337H10.4867C9.42667 1.33337 9 1.71337 9 2.65337V5.67337C9 6.62004 9.42667 6.99337 10.4867 6.99337H13.18C14.24 7.00004 14.6667 6.62004 14.6667 5.68004Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.6667 13.18V10.4867C14.6667 9.42667 14.24 9 13.18 9H10.4867C9.42667 9 9 9.42667 9 10.4867V13.18C9 14.24 9.42667 14.6667 10.4867 14.6667H13.18C14.24 14.6667 14.6667 14.24 14.6667 13.18Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 5.68004V2.65337C7 1.71337 6.57334 1.33337 5.51334 1.33337H2.82C1.76 1.33337 1.33334 1.71337 1.33334 2.65337V5.67337C1.33334 6.62004 1.76 6.99337 2.82 6.99337H5.51334C6.57334 7.00004 7 6.62004 7 5.68004Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 13.18V10.4867C7 9.42667 6.57334 9 5.51334 9H2.82C1.76 9 1.33334 9.42667 1.33334 10.4867V13.18C1.33334 14.24 1.76 14.6667 2.82 14.6667H5.51334C6.57334 14.6667 7 14.24 7 13.18Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                All folder
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12.6667C4.222 11.3333 5.33333 10 5.33333 8.66667C5.33333 6.66667 4.66667 6.66667 4 6.66667C3.33333 6.66667 2.64533 7.39 2.66667 8.66667C2.68933 10.032 3.772 10.5847 4.33333 11.3333C5.33333 12.6667 6 13 6.66667 12C7.11133 11.3333 7.44467 10.778 7.66667 10.3333C8.33333 11.8887 9.222 12.6667 10.3333 12.6667H12M12 12.6667L10.6667 11.3333V3.33333C10.6667 2.586 11.2527 2 12 2C12.7473 2 13.3333 2.586 13.3333 3.33333V11.3333L12 12.6667ZM10.6667 4.66667H13.3333" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                Signatures
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.66666 12.6667H13.3333M2.66666 10L5.33333 6L8 7.33333L10.6667 4L13.3333 6.66667" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                Send and monitor
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H8.66667M10.6667 14.6667L14 11.3333M14 11.3333V14.3333M14 11.3333H11M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                Shared
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 8.33337V4.53337C13.3333 3.41327 13.3333 2.85322 13.1153 2.42539C12.9236 2.04907 12.6176 1.74311 12.2413 1.55136C11.8135 1.33337 11.2534 1.33337 10.1333 1.33337H5.86666C4.74656 1.33337 4.18651 1.33337 3.75868 1.55136C3.38236 1.74311 3.0764 2.04907 2.88465 2.42539C2.66666 2.85322 2.66666 3.41327 2.66666 4.53337V11.4667C2.66666 12.5868 2.66666 13.1469 2.88465 13.5747C3.0764 13.951 3.38236 14.257 3.75868 14.4487C4.18651 14.6667 4.74653 14.6667 5.86657 14.6667H8.33333M9.33333 7.33337H5.33333M6.66666 10H5.33333M10.6667 4.66671H5.33333M10 12.6667L12 14.6667M12 14.6667L14 12.6667M12 14.6667V10.6667" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                File requests
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2H10M2 4H14M12.6667 4L12.1991 11.0129C12.129 12.065 12.0939 12.5911 11.8667 12.99C11.6666 13.3412 11.3648 13.6235 11.0011 13.7998C10.588 14 10.0607 14 9.00623 14H6.99377C5.93927 14 5.41202 14 4.99889 13.7998C4.63517 13.6235 4.33339 13.3412 4.13332 12.99C3.90607 12.5911 3.871 12.065 3.80086 11.0129L3.33333 4" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                Deleted files
              </h3>
            </li>
            <li className='flex items-center  h-[38px] py-1 px-3 gap-2 self-stretch'>
              <div className='flex justify-center items-center h-4 w-4 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33333 4.66667C2.97971 4.66667 2.64057 4.52619 2.39052 4.27614C2.14048 4.02609 2 3.68696 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2C3.68696 2 4.02609 2.14048 4.27614 2.39052C4.52619 2.64057 4.66667 2.97971 4.66667 3.33333M3.33333 4.66667C3.68696 4.66667 4.02609 4.52619 4.27614 4.27614C4.52619 4.02609 4.66667 3.68696 4.66667 3.33333M3.33333 4.66667V11.3333M4.66667 3.33333H11.3333M11.3333 3.33333C11.3333 3.68696 11.4738 4.02609 11.7239 4.27614C11.9739 4.52619 12.313 4.66667 12.6667 4.66667M11.3333 3.33333C11.3333 2.97971 11.4738 2.64057 11.7239 2.39052C11.9739 2.14048 12.313 2 12.6667 2C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333C14 3.68696 13.8595 4.02609 13.6095 4.27614C13.3594 4.52619 13.0203 4.66667 12.6667 4.66667M12.6667 4.66667V11.3333M4.66667 12.6667C4.66667 13.0203 4.52619 13.3594 4.27614 13.6095C4.02609 13.8595 3.68696 14 3.33333 14C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667C2 12.313 2.14048 11.9739 2.39052 11.7239C2.64057 11.4738 2.97971 11.3333 3.33333 11.3333M4.66667 12.6667C4.66667 12.313 4.52619 11.9739 4.27614 11.7239C4.02609 11.4738 3.68696 11.3333 3.33333 11.3333M4.66667 12.6667H11.3333M11.3333 12.6667C11.3333 13.0203 11.4738 13.3594 11.7239 13.6095C11.9739 13.8595 12.313 14 12.6667 14C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667C14 12.313 13.8595 11.9739 13.6095 11.7239C13.3594 11.4738 13.0203 11.3333 12.6667 11.3333M11.3333 12.6667C11.3333 12.313 11.4738 11.9739 11.7239 11.7239C11.9739 11.4738 12.313 11.3333 12.6667 11.3333" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className='text-medium-14'>
                Admin console
              </h3>
            </li>
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" width="219" height="2" viewBox="0 0 219 2" fill="none">
            <path d="M0 1H219" stroke="#F2F2F3" />
          </svg>
          {/* Recently Opened */}
          <div className='flex flex-col items-start self-stretch'>
            <div className='flex items-start h-[38px] py-1 px-3 gap-3 self-stretch'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className='text-regular-12-upper'>Recently opened</h3>
            </div>
            <ul>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Landing Page</h3>
              </li>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Mobile Apps</h3>
              </li>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Dashboard</h3>
              </li>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Brief</h3>
              </li>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Winter Project</h3>
              </li>
              <li className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
                <div className='flex h-5 w-5 items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                    <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
                  </svg>
                </div>
                <h3 className='text-regular-14'>Happy New Year</h3>
              </li>
            </ul>
          </div>
        </div>

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
      </nav>
    </div>
  )
}

export default Sidebar