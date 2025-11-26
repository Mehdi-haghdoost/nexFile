import AuthFooter from '@/components/modules/login-register/AuthFooter';
import styles from './resetSuccess.module.css';

const ResetSuccess = ({ goto }) => {
  return (
    <div className={`${styles.resetSuccess} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}>
      
      {/* Main Content Container */}
      <div className='w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6'>
        
        {/* Content Wrapper */}
        <div className='w-full max-w-[350px] flex flex-col gap-6 md:gap-8'>
          
          {/* Success Icon */}
          <div className='flex items-center justify-center'>
            <div className='flex w-16 h-16 md:w-[72px] md:h-[72px] p-1 flex-col items-center justify-center rounded-full border-2 border-white/70 bg-gradient-success shrink-0'>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20.0002 3.33334C10.8168 3.33334 3.3335 10.8167 3.3335 20C3.3335 29.1833 10.8168 36.6667 20.0002 36.6667C29.1835 36.6667 36.6668 29.1833 36.6668 20C36.6668 10.8167 29.1835 3.33334 20.0002 3.33334ZM27.9668 16.1667L18.5168 25.6167C18.2835 25.85 17.9668 25.9833 17.6335 25.9833C17.3002 25.9833 16.9835 25.85 16.7502 25.6167L12.0335 20.9C11.5502 20.4167 11.5502 19.6167 12.0335 19.1333C12.5168 18.65 13.3168 18.65 13.8002 19.1333L17.6335 22.9667L26.2002 14.4C26.6835 13.9167 27.4835 13.9167 27.9668 14.4C28.4502 14.8833 28.4502 15.6667 27.9668 16.1667Z" fill="white" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className='flex flex-col text-center items-center justify-center gap-2'>
            <h2 className='text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white'>
              Reset password Successfully
            </h2>
            <p className='text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0'>
              Your password has been reset successfully
            </p>
          </div>

          {/* Form Body */}
          <div className='flex flex-col items-center gap-6 w-full'>
            {/* Back to Login Button */}
            <button 
              onClick={() => goto('login')}
              className='btn-primary w-full'
            >
              Back to Login
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

export default ResetSuccess;