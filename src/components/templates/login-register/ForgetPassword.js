import AuthFooter from '@/components/modules/login-register/AuthFooter'
import styles from './forgetPassword.module.css'

const ForgetPassword = () => {
  return (
    <div className={`flex flex-col items-center dark:bg-gray-900 dark:bg-neutral-900 shrink-0 h-full rounded-xl bg-white shadow-sm mx-3 pt-[80px]`}>
      <div className='h-full'>
        <div className='w-[350px] h-[699px]'>
          <div className='forgetPassword_container flex w-[350px] flex-col items-center gap-10'>
            <div className='forgetPassword_logo_container flex items-center justify-center gap-3'>
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
            <div className='forgetPasswordForm_container flex flex-col items-center gap-12 self-stretch'>
              <div className='forgetPasswordForm_header flex flex-col text-center items-center justify-center gap-2'>
                <div className='forgetPasswordForm_title flex items-center gap-1.5'>
                  <h2 className='text-semibold-32 dark:text-semibold-32-white'>Forgot password</h2>
                </div>
                <h3 className='text-regular-14 w-[292px]'>Kindly provide your email address to initiate a password reset request.</h3>
              </div>

              <div className='forgetPasswordForm_body flex flex-col items-center gap-6 self-stretch'>
                <div className='forgetPasswordForm_input flex flex-col gap-4 self-stretch'>
                  <div className='forgetPasswordForm_input_fields flex flex-col items-center gap-3'>
                    <div className='forgetPasswordForm_input_textfield flex flex-col justify-center self-stretch gap-1'>
                      <h3 className='self-stretch text-regular-12-neutral-300 mb-0.5'>Email</h3>
                      <div className='forgetPasswordForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="text"
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white outline-0'
                          placeholder='ridwant@gmail.com'
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-center gap-2 ">
                    <input id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="link-checkbox" className="text-regular-12">
                      I agree to NexFile's <span className='text-regular-12-primary'>Terms of Service</span> and <span className='text-regular-12-primary'>Privacy Policy</span>
                    </label>
                  </div>
                </div>
                <div className='forgetPasswordForm_button w-[350px] flex flex-col items-center self-stretch gap-6'>
                  <button className='btn-primary'>
                    Next
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

export default ForgetPassword