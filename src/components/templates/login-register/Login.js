import styles from './login.module.css'

const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.login_shape}>
        <div className='login_container flex flex-col w-[350px] items-center gap-12'>
          <div className='logo_container flex items-center justify-center gap-3'>
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
            <h3 className='text-semibold-18'>NexFile</h3>
          </div>
          <div className='loginForm_container flex flex-col items-center gap-12 self-stretch'>
            <div className='loginForm_header flex flex-col items-center justify-center gap-2'>
              <div className='loginForm_title flex items-center gap-1.5'>
                <h2 className='text-semibold-32'>Welcome to</h2>
                <h2 className='text-semibold-32 bg-gradient-primary bg-clip-text text-transparent'>NexFile</h2>
              </div>
              <h3 className='text-regular-14'>Enter your username and password to Login</h3>
            </div>
            <div className='loginFrom_body flex flex-col items-start gap-6 self-stretch'>

              <div className='loginForm_input flex flex-col items-center gap-4 self-stretch'>
                <div className='loginForm_input_fields flex flex-col items-center gap-3 '>
                  <div className='loginForm_input_textfield flex flex-col justify-center self-stretch gap-1 w-[320px]'>
                    <h3 className='self-stretch text-regular-12-neutral-300'>Email</h3>
                    <div className='.loginForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white '>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.10664 7.24668C8.03998 7.24001 7.95998 7.24001 7.88664 7.24668C6.29998 7.19334 5.03998 5.89334 5.03998 4.29334C5.03998 2.66001 6.35998 1.33334 7.99998 1.33334C9.63331 1.33334 10.96 2.66001 10.96 4.29334C10.9533 5.89334 9.69331 7.19334 8.10664 7.24668Z" stroke="#A1A1A3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.77335 9.70666C3.16002 10.7867 3.16002 12.5467 4.77335 13.62C6.60669 14.8467 9.61335 14.8467 11.4467 13.62C13.06 12.54 13.06 10.78 11.4467 9.70666C9.62002 8.48666 6.61335 8.48666 4.77335 9.70666Z" stroke="#A1A1A3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <input
                        type="text"
                        className='input-styled placeholder-regular-14 outline-0'
                        placeholder='ridwant@gmail.com'
                      />
                    </div>
                  </div>

                  <div className='loginForm_input_textfield flex flex-col items-center justify-center self-stretch gap-1 self-stretch  '>
                    <h3 className='self-stretch text-regular-12-neutral-300'>Password</h3>
                    <div className='.loginForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white '>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.3333 5.99996C11.3333 5.65874 11.2031 5.31753 10.9428 5.05719C10.6825 4.79684 10.3412 4.66667 10 4.66667M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 6.18245 6.01222 6.36205 6.03587 6.53802C6.07478 6.82745 6.09424 6.97217 6.08114 7.06373C6.0675 7.1591 6.05013 7.2105 6.00313 7.2946C5.958 7.37533 5.87847 7.45486 5.71942 7.61391L2.31242 11.0209C2.19712 11.1362 2.13947 11.1939 2.09824 11.2611C2.06169 11.3208 2.03475 11.3858 2.01842 11.4538C2 11.5306 2 11.6121 2 11.7752V12.9333C2 13.3067 2 13.4934 2.07266 13.636C2.13658 13.7614 2.23856 13.8634 2.36401 13.9273C2.50661 14 2.6933 14 3.06667 14H4.66667V12.6667H6V11.3333H7.33333L8.38609 10.2806C8.54514 10.1215 8.62467 10.042 8.7054 9.99687C8.7895 9.94987 8.8409 9.9325 8.93627 9.91886C9.02783 9.90576 9.17255 9.92522 9.46198 9.96413C9.63795 9.98778 9.81755 10 10 10Z" stroke="#A1A1A3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <input
                        type="text"
                        className='input-styled placeholder-regular-14 outline-0'
                        placeholder='ridwant@gmail.com'
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>

                </div>
                {/* {} */}
                <div className='loginForm_options flex items-center justify-between self-stretch'>
                </div>
              </div>

              <div className='loginForm_button'></div>
            </div>

            <h3 className='register_text'></h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login