import AuthFooter from '@/components/modules/login-register/AuthFooter';
import styles from './forgetPassword.module.css';

const ForgetPassword = ({ goto }) => {
  return (
    <div className={`${styles.forgetPassword} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}>
      
      {/* Main Content Container */}
      <div className='w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6'>
        
        {/* Content Wrapper */}
        <div className='w-full max-w-[350px] flex flex-col gap-6 md:gap-8'>
          
          {/* Logo Section */}
          <div className='flex items-center justify-center gap-3'>
            <div className='flex w-10 h-10 p-1 flex-col items-center justify-center gap-2 rounded-lg border border-white/70 bg-gradient-primary shrink-0'>
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

          {/* Header */}
          <div className='flex flex-col text-center items-center justify-center gap-2'>
            <h2 className='text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white'>
              Forgot password
            </h2>
            <p className='text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0'>
              Kindly provide your email address to initiate a password reset request.
            </p>
          </div>

          {/* Form Body */}
          <div className='flex flex-col items-center gap-6 w-full'>
            
            {/* Input Fields */}
            <div className='flex flex-col gap-4 w-full'>
              
              {/* Email */}
              <div className='flex flex-col gap-1 w-full'>
                <label className='text-xs text-neutral-300 dark:text-neutral-200'>
                  Email
                </label>
                <div className='flex items-center w-full h-12 py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                  <input
                    type="email"
                    className='w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400'
                    placeholder='ridwant@gmail.com'
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 w-full">
                <input 
                  id="link-checkbox" 
                  type="checkbox" 
                  className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" 
                />
                <label htmlFor="link-checkbox" className="text-xs text-neutral-300 dark:text-neutral-200 leading-relaxed">
                  I agree to NexFile's{' '}
                  <span className='text-primary-500 cursor-pointer hover:underline'>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className='text-primary-500 cursor-pointer hover:underline'>
                    Privacy Policy
                  </span>
                </label>
              </div>
            </div>

            {/* Next Button */}
            <button className='btn-primary w-full'>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-auto w-full flex justify-center py-4 md:py-6'>
        <AuthFooter />
      </div>
    </div>
  );
}

export default ForgetPassword;