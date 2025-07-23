import AuthFooter from '@/components/modules/login-register/AuthFooter'
import styles from './resetSuccess.module.css'

const ResetSuccess = () => {
  return (
    <div className={`${styles.resetSuccess}  flex-col items-center shrink-0 h-full rounded-xl bg-white shadow-sm mx-3`}>
      <div className=' h-full bg-white '>
        <div className='w-[350px] h-[699px] '>
          <div className='resetSuccess_container flex w-[350px] flex-col items-center gap-10'>
            <div className='resetSuccess_logo_container flex items-center justify-center gap-3'>
              <div className='logomark flex w-[72px] h-[72px] p-1 flex-col items-center justify-center gap-[8px] rounded-[112px] border-2 border-white/70 bg-gradient-success'>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20.0002 3.33334C10.8168 3.33334 3.3335 10.8167 3.3335 20C3.3335 29.1833 10.8168 36.6667 20.0002 36.6667C29.1835 36.6667 36.6668 29.1833 36.6668 20C36.6668 10.8167 29.1835 3.33334 20.0002 3.33334ZM27.9668 16.1667L18.5168 25.6167C18.2835 25.85 17.9668 25.9833 17.6335 25.9833C17.3002 25.9833 16.9835 25.85 16.7502 25.6167L12.0335 20.9C11.5502 20.4167 11.5502 19.6167 12.0335 19.1333C12.5168 18.65 13.3168 18.65 13.8002 19.1333L17.6335 22.9667L26.2002 14.4C26.6835 13.9167 27.4835 13.9167 27.9668 14.4C28.4502 14.8833 28.4502 15.6667 27.9668 16.1667Z" fill="white" />
                </svg>
              </div>
            </div>
            <div className='resetSuccessForm_container flex flex-col items-center gap-12 self-stretch'>
              <div className='resetSuccessForm_header flex flex-col text-center items-center justify-center gap-2'>
                <div className='resetSuccessForm_title flex items-center gap-1.5'>
                  <h2 className='text-semibold-32'>Reset password Successfully</h2>
                </div>
                <h3 className='text-regular-14 text-center w-[300px]'>Your password has been reset successfully</h3>
              </div>

              <div className='resetSuccessForm_body flex flex-col items-center gap-6 self-stretch'>
                <div className='resetSuccessForm_button w-[350px] flex flex-col items-center self-stretch gap-6'>
                  <button className='btn-primary'>
                    Back to Login
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

export default ResetSuccess 