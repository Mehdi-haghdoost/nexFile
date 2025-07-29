import styles from './sidebar.module.css';

const Sidebar = () => {
  return (
    <div className='flex'>
      <nav className='flex flex-col items-center justify-between h-screen px-4 py-4 lg:px-6 lg:py-6 border border-gray-200 bg-white w-14 lg:w-16 relative'>
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
                <path d="M6.66667 14.6667H13.3333M9.18141 2.80333L3.52949 7.19927C3.15168 7.49312 2.96278 7.64005 2.82669 7.82405C2.70614 7.98704 2.61633 8.17065 2.56169 8.36588C2.5 8.58627 2.5 8.82558 2.5 9.30421V15.3333C2.5 16.2667 2.5 16.7335 2.68166 17.09C2.84144 17.4036 3.09641 17.6585 3.41002 17.8183C3.76654 18 4.23325 18 5.16667 18H14.8333C15.7668 18 16.2335 18 16.59 17.8183C16.9036 17.6585 17.1586 17.4036 17.3183 17.09C17.5 16.7335 17.5 16.2667 17.5 15.3333V9.30421C17.5 8.82558 17.5 8.58627 17.4383 8.36588C17.3837 8.17065 17.2939 7.98704 17.1733 7.82405C17.0372 7.64005 16.8483 7.49312 16.4705 7.19927L10.8186 2.80333C10.5258 2.57562 10.3794 2.46177 10.2178 2.418C10.0752 2.37938 9.92484 2.37938 9.78221 2.418C9.62057 2.46177 9.47418 2.57562 9.18141 2.80333Z" stroke="#4C3CC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <h3 className='text-medium-12-primary'>Home</h3>
            </li>
            <li className='flex flex-col items-center justify-center w-10 h-10 gap-1 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M4.16667 3.83337H7.5L10 6.33337H15.8333C16.2754 6.33337 16.6993 6.50897 17.0118 6.82153C17.3244 7.13409 17.5 7.55801 17.5 8.00004V14.6667C17.5 15.1087 17.3244 15.5327 17.0118 15.8452C16.6993 16.1578 16.2754 16.3334 15.8333 16.3334H4.16667C3.72464 16.3334 3.30072 16.1578 2.98816 15.8452C2.67559 15.5327 2.5 15.1087 2.5 14.6667V5.50004C2.5 5.05801 2.67559 4.63409 2.98816 4.32153C3.30072 4.00897 3.72464 3.83337 4.16667 3.83337Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <h3 className='text-regular-12 text-center'>Folder</h3>
            </li>
            <li className='flex flex-col items-center justify-center w-10 h-10 gap-1 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M10 5.50004C10.4602 5.50004 10.8333 5.12694 10.8333 4.66671C10.8333 4.20647 10.4602 3.83337 10 3.83337C9.53976 3.83337 9.16667 4.20647 9.16667 4.66671C9.16667 5.12694 9.53976 5.50004 10 5.50004Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 11.3334C10.4602 11.3334 10.8333 10.9603 10.8333 10.5C10.8333 10.0398 10.4602 9.66671 10 9.66671C9.53976 9.66671 9.16667 10.0398 9.16667 10.5C9.16667 10.9603 9.53976 11.3334 10 11.3334Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 17.1667C10.4602 17.1667 10.8333 16.7936 10.8333 16.3334C10.8333 15.8731 10.4602 15.5 10 15.5C9.53976 15.5 9.16667 15.8731 9.16667 16.3334C9.16667 16.7936 9.53976 17.1667 10 17.1667Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8333 5.50004C16.2936 5.50004 16.6667 5.12694 16.6667 4.66671C16.6667 4.20647 16.2936 3.83337 15.8333 3.83337C15.3731 3.83337 15 4.20647 15 4.66671C15 5.12694 15.3731 5.50004 15.8333 5.50004Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8333 11.3334C16.2936 11.3334 16.6667 10.9603 16.6667 10.5C16.6667 10.0398 16.2936 9.66671 15.8333 9.66671C15.3731 9.66671 15 10.0398 15 10.5C15 10.9603 15.3731 11.3334 15.8333 11.3334Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8333 17.1667C16.2936 17.1667 16.6667 16.7936 16.6667 16.3334C16.6667 15.8731 16.2936 15.5 15.8333 15.5C15.3731 15.5 15 15.8731 15 16.3334C15 16.7936 15.3731 17.1667 15.8333 17.1667Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16667 5.50004C4.6269 5.50004 5 5.12694 5 4.66671C5 4.20647 4.6269 3.83337 4.16667 3.83337C3.70643 3.83337 3.33333 4.20647 3.33333 4.66671C3.33333 5.12694 3.70643 5.50004 4.16667 5.50004Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16667 11.3334C4.6269 11.3334 5 10.9603 5 10.5C5 10.0398 4.6269 9.66671 4.16667 9.66671C3.70643 9.66671 3.33333 10.0398 3.33333 10.5C3.33333 10.9603 3.70643 11.3334 4.16667 11.3334Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.16667 17.1667C4.6269 17.1667 5 16.7936 5 16.3334C5 15.8731 4.6269 15.5 4.16667 15.5C3.70643 15.5 3.33333 15.8731 3.33333 16.3334C3.33333 16.7936 3.70643 17.1667 4.16667 17.1667Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <h3 className='text-regular-12 text-center'>More</h3>
            </li>
          </ul>
        </div>
        <div className='flex w-10 h-10 justify-center items-center flex-shrink-0 gap-2.5'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 3.33325V16.6666M12.5 8.33325L10.8333 9.99992L12.5 11.6666M3.33333 4.99992C3.33333 4.55789 3.50893 4.13397 3.82149 3.82141C4.13405 3.50885 4.55797 3.33325 5 3.33325H15C15.442 3.33325 15.8659 3.50885 16.1785 3.82141C16.4911 4.13397 16.6667 4.55789 16.6667 4.99992V14.9999C16.6667 15.4419 16.4911 15.8659 16.1785 16.1784C15.8659 16.491 15.442 16.6666 15 16.6666H5C4.55797 16.6666 4.13405 16.491 3.82149 16.1784C3.50893 15.8659 3.33333 15.4419 3.33333 14.9999V4.99992Z" stroke="#737379" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div className='absolute w-0 h-10 right-0 top-[88px]'>
          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="40" viewBox="0 0 2 40" fill="none">
            <path d="M1 0L1 40" stroke="#4C3CC6" stroke-width="1.5" />
          </svg>
        </div>
      </nav>
      <nav className='flex flex-col h-screen items-start w-60 lg:w-[267px]  px-4 py-4 lg:px-6 lg:py-6 flex-shrink-0 gap-6 lg:gap-8 border-r border-l border-gray-200 bg-white '>
       <div className='flex h-[42px] items-center gap-3 flex-shrink-0 self-stretch'>1</div>
       <div className='flex flex-col items-start self-stretch flex-1 gap-4'>2</div>
       <div className='flex flex-col justify-center items-center gap-3 self-stretch p-4 rounded-lg border border-stroke-500 bg-white shadow-custom'>3</div>
      </nav>
    </div>
  )
}

export default Sidebar