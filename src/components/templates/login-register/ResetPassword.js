import AuthFooter from '@/components/modules/login-register/AuthFooter'

const ResetPassword = () => {
  return (
    <div className={`flex flex-col items-center dark:bg-gray-900 shrink-0 h-full rounded-xl bg-white dark:bg-gray-900 dark:bg-neutral-900 shadow-sm mx-3 pt-[80px]`}>
      <div className='h-full'>
        <div className='w-[350px] h-[699px]'>
          <div className='resetPassword_container flex w-[350px] flex-col items-center gap-10'>
            <div className='resetPassword_logo_container flex items-center justify-center gap-3'>
              <div className='logomark flex w-[40px] h-[40px] p-1 flex-col items-center justify-center gap-[8px] rounded-lg border border-white/70 bg-gradient-primary'>
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
              <h3 className='text-semibold-18 dark:text-semibold-18-white'>NexFile</h3>
            </div>
            <div className='resetPasswordForm_container flex flex-col items-center gap-12 self-stretch'>
              <div className='resetPasswordForm_header flex flex-col text-center items-center justify-center gap-2'>
                <div className='resetPasswordForm_title flex items-center gap-1.5'>
                  <h2 className='text-semibold-32 dark:text-semibold-32-white'>Create new password</h2>
                </div>
                <h3 className='text-regular-14 text-center w-[300px]'>Kindly create a new password by incorporating both letters and numbers.</h3>
              </div>

              <div className='resetPasswordForm_body flex flex-col items-center gap-6 self-stretch'>
                <div className='resetPasswordForm_input flex flex-col gap-4 self-stretch'>
                  <div className='resetPasswordForm_input_fields flex flex-col items-center gap-3'>
                    <div className='resetPasswordForm_input_textfield flex flex-col justify-center self-stretch gap-1'>
                      <h3 className='self-stretch text-regular-12-neutral-300 mb-0.5'>Password</h3>
                      <div className='resetPasswordForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="password"
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='••••••••'
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div className='resetPasswordForm_input_textfield flex flex-col justify-center self-stretch gap-1'>
                      <h3 className='self-stretch text-regular-12-neutral-300 mb-0.5'>Confirm Password</h3>
                      <div className='resetPasswordForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="password"
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='••••••••'
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='resetPasswordForm_button w-[350px] flex flex-col items-center self-stretch gap-6'>
                  <button className='btn-primary'>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}

export default ResetPassword