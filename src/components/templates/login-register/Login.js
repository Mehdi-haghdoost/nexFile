import AuthFooter from '@/components/modules/login-register/AuthFooter'
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
                <h2 className='text-semibold-32 dark:text-semibold-32-white'>Welcome to</h2>
                <h2 className='text-semibold-32 bg-gradient-primary bg-clip-text text-transparent '>NexFile</h2>
              </div>
              <h3 className='text-regular-14'>Enter your username and password to Login</h3>
            </div>
            <div className='loginFrom_body flex flex-col items-center gap-6 self-stretch'>

              <div className='loginForm_input flex flex-col  gap-4 self-stretch'>
                <div className='loginForm_input_fields flex flex-col items-center gap-3 '>
                  <div className='loginForm_input_textfield flex flex-col justify-center self-stretch gap-1'>
                    <h3 className='self-stretch text-regular-12-neutral-300'>Email</h3>
                    <div className='loginForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.10664 7.24668C8.03998 7.24001 7.95998 7.24001 7.88664 7.24668C6.29998 7.19334 5.03998 5.89334 5.03998 4.29334C5.03998 2.66001 6.35998 1.33334 7.99998 1.33334C9.63331 1.33334 10.96 2.66001 10.96 4.29334C10.9533 5.89334 9.69331 7.19334 8.10664 7.24668Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.77335 9.70666C3.16002 10.7867 3.16002 12.5467 4.77335 13.62C6.60669 14.8467 9.61335 14.8467 11.4467 13.62C13.06 12.54 13.06 10.78 11.4467 9.70666C9.62002 8.48666 6.61335 8.48666 4.77335 9.70666Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input
                        type="text"
                        className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white outline-0'
                        placeholder='ridwant@gmail.com'
                      />
                    </div>
                  </div>

                  <div className='loginForm_input_textfield flex flex-col items-center justify-center self-stretch gap-1 self-stretch  '>
                    <h3 className='self-stretch text-regular-12-neutral-300'>Password</h3>
                    <div className='.loginForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.3333 5.99996C11.3333 5.65874 11.2031 5.31753 10.9428 5.05719C10.6825 4.79684 10.3412 4.66667 10 4.66667M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 6.18245 6.01222 6.36205 6.03587 6.53802C6.07478 6.82745 6.09424 6.97217 6.08114 7.06373C6.0675 7.1591 6.05013 7.2105 6.00313 7.2946C5.958 7.37533 5.87847 7.45486 5.71942 7.61391L2.31242 11.0209C2.19712 11.1362 2.13947 11.1939 2.09824 11.2611C2.06169 11.3208 2.03475 11.3858 2.01842 11.4538C2 11.5306 2 11.6121 2 11.7752V12.9333C2 13.3067 2 13.4934 2.07266 13.636C2.13658 13.7614 2.23856 13.8634 2.36401 13.9273C2.50661 14 2.6933 14 3.06667 14H4.66667V12.6667H6V11.3333H7.33333L8.38609 10.2806C8.54514 10.1215 8.62467 10.042 8.7054 9.99687C8.7895 9.94987 8.8409 9.9325 8.93627 9.91886C9.02783 9.90576 9.17255 9.92522 9.46198 9.96413C9.63795 9.98778 9.81755 10 10 10Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input
                        type="text"
                        className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                        placeholder='••••••••'
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                </div>
                {/* {} */}
                <div className='loginForm_options flex items-center justify-between px-4 self-stretch'>
                  <div className='loginForm_rememberMe '>
                    <div className="flex items-center gap-2 ">
                      <input
                        id="link-checkbox"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 rounded-sm border-2 border-gray-500 bg-transparent text-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-transparent dark:focus:ring-primary-500"
                      />
                      <label htmlFor="link-checkbox" className="text-regular-14">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className='text-regular-12-primary'>Forgot password?</a>
                </div>
              </div>

              <div className='loginForm_button w-[350px] flex flex-col items-center self-stretch gap-6'>
                <button className='btn-primary'>
                  Login
                </button>
                <div className='loginForm_divider flex items-center justify-center self-stretch gap-5'>
                  <svg className='flex-1' xmlns="http://www.w3.org/2000/svg" width="120" height="1" viewBox="0 0 120 1" fill="none">
                    <path d="M0 0.5L119.5 0.50001" stroke="#E1E0E5" />
                  </svg>
                  <h3 className='text-regular-12'>Or login with</h3>
                  <svg className='flex-1' xmlns="http://www.w3.org/2000/svg" width="120" height="1" viewBox="0 0 120 1" fill="none">
                    <path d="M0.5 0.5H120" stroke="#E1E0E5" />
                  </svg>
                </div>
                <div className='soacialLogin_container flex items-center gap-[13px] self-stretch'>
                  <div className='flex h-[48px] py-3 pr-4 pl-3 justify-center items-center gap-2 flex-1 rounded-lg border border-stroke-500 bg-white dark:border-neutral-600 dark:bg-neutral-800'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                      <path d="M17.1258 9.17493C17.1258 8.52743 17.0722 8.05493 16.9561 7.56494H9.4115V10.4874H13.84C13.7508 11.2137 13.2686 12.3074 12.1972 13.0424L12.1822 13.1402L14.5676 14.9513L14.7329 14.9674C16.2507 13.5937 17.1258 11.5724 17.1258 9.17493Z" fill="#4285F4" />
                      <path d="M9.41098 16.875C11.5806 16.875 13.402 16.175 14.7324 14.9675L12.1967 13.0424C11.5181 13.5062 10.6074 13.8299 9.41098 13.8299C7.28601 13.8299 5.48246 12.4562 4.83954 10.5574L4.7453 10.5653L2.26486 12.4465L2.23242 12.5349C3.55383 15.1074 6.26811 16.875 9.41098 16.875Z" fill="#34A853" />
                      <path d="M4.84004 10.5575C4.6704 10.0675 4.57223 9.54245 4.57223 8.99997C4.57223 8.45744 4.6704 7.93246 4.83112 7.44247L4.82662 7.33811L2.31509 5.42664L2.23291 5.46494C1.6883 6.53245 1.37579 7.73123 1.37579 8.99997C1.37579 10.2687 1.6883 11.4674 2.23291 12.5349L4.84004 10.5575Z" fill="#FBBC05" />
                      <path d="M9.41103 4.16998C10.9199 4.16998 11.9378 4.80873 12.5182 5.34251L14.786 3.1725C13.3932 1.90375 11.5806 1.125 9.41103 1.125C6.26814 1.125 3.55384 2.89249 2.23242 5.46497L4.83063 7.44249C5.48248 5.54375 7.28604 4.16998 9.41103 4.16998Z" fill="#EB4335" />
                    </svg>
                    <a href="#" className='text-regular-14-neutral-500 dark:text-regular-14-white'>Google</a>
                  </div>

                  <div className='flex h-[48px] py-3 pr-4 pl-3 justify-center items-center gap-2 flex-1 rounded-lg border border-stroke-500 bg-white dark:border-neutral-600 dark:bg-neutral-800'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                      <path className="fill-neutral-500 dark:fill-white" d="M16.2106 13.8181C15.9497 14.4208 15.6409 14.9755 15.2832 15.4856C14.7955 16.1809 14.3962 16.6621 14.0885 16.9294C13.6115 17.3681 13.1004 17.5928 12.5531 17.6055C12.1602 17.6055 11.6863 17.4937 11.1348 17.2669C10.5814 17.0412 10.0729 16.9294 9.60788 16.9294C9.12021 16.9294 8.59719 17.0412 8.03776 17.2669C7.47747 17.4937 7.02611 17.6119 6.68101 17.6236C6.15618 17.646 5.63305 17.4149 5.11088 16.9294C4.77761 16.6387 4.36074 16.1404 3.86136 15.4344C3.32556 14.6806 2.88506 13.8064 2.53997 12.8098C2.17038 11.7333 1.98511 10.6908 1.98511 9.68164C1.98511 8.5256 2.23491 7.52854 2.73525 6.69301C3.12847 6.02188 3.6516 5.49247 4.30633 5.10382C4.96107 4.71518 5.66851 4.51713 6.43036 4.50446C6.84722 4.50446 7.39388 4.6334 8.07321 4.88682C8.75063 5.14109 9.18559 5.27003 9.37629 5.27003C9.51887 5.27003 10.0021 5.11926 10.8212 4.81867C11.5958 4.53991 12.2496 4.42449 12.7852 4.46996C14.2365 4.58708 15.3268 5.15919 16.0519 6.1899C14.754 6.97635 14.1119 8.07786 14.1247 9.49093C14.1364 10.5916 14.5357 11.5075 15.3204 12.2348C15.6761 12.5723 16.0732 12.8332 16.5151 13.0184C16.4193 13.2964 16.3181 13.5626 16.2106 13.8181ZM12.8821 0.72022C12.8821 1.58292 12.5669 2.38841 11.9387 3.13397C11.1806 4.0203 10.2636 4.53246 9.26918 4.45164C9.25651 4.34814 9.24916 4.23922 9.24916 4.12475C9.24916 3.29657 9.60969 2.41024 10.2499 1.68555C10.5696 1.31863 10.9761 1.01354 11.4691 0.770158C11.9611 0.530412 12.4264 0.397827 12.864 0.375122C12.8768 0.490451 12.8821 0.605787 12.8821 0.720209V0.72022Z" fill="#2E2E37" />
                    </svg>
                    <a href="#" className='text-regular-14-neutral-500 dark:text-regular-14-white'>Apple</a>
                  </div>
                </div>
              </div>
            </div>

            <h3 className='register_text text-regular-12'>
              Don’t have account?
              <a href='#' className='text-regular-12-primary ml-1'>Register</a>
            </h3>
          </div>
        </div>

      </div>
      <div className='absolute bottom-3.5 left-[35px] w-[500px]'>
        <AuthFooter />
      </div>
    </div>
  )
}

export default Login