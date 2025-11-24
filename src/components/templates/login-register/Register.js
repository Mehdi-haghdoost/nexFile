'use client';
import AuthFooter from '@/components/modules/login-register/AuthFooter';
import styles from './register.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Register = ({ goto }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to Terms of Service and Privacy Policy');
      return;
    }

    // اینجا می‌تونید API call برای ثبت‌نام اضافه کنید
    // بعد از ثبت‌نام موفق:
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.fullName);
    
    // انتقال به صفحه home
    router.push('/home');
  };

  return (
    <div className={`${styles.register} flex flex-col items-center dark:bg-gray-900 shrink-0 h-full rounded-xl bg-white shadow-sm mx-3`}>
      <div className='h-full'>
        <div className='w-[350px] h-[699px]'>
          <div className='register_container flex w-[350px] flex-col items-center gap-10'>
            <div className='register_logo_container flex items-center justify-center gap-3'>
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
            
            <div className='registerForm_container flex flex-col items-center gap-12 self-stretch'>
              <div className='registerForm_header flex flex-col text-center items-center justify-center gap-2'>
                <div className='registerForm_title flex items-center gap-1.5'>
                  <h2 className='text-semibold-32 dark:text-semibold-32-white'>Create an account</h2>
                </div>
                <h3 className='text-regular-14 w-[292px]'>Enter your name, email and password to create an account</h3>
              </div>

              <form onSubmit={handleRegister} className='registerForm_body flex flex-col items-center gap-6 self-stretch'>
                <div className='registerForm_input flex flex-col gap-4 self-stretch'>
                  <div className='registerForm_input_fields flex flex-col items-center gap-3'>
                    <div className='registerForm_input_textfield flex flex-col justify-center self-stretch gap-1'>
                      <h3 className='self-stretch text-regular-12-neutral-300 mb-0.5'>Full Name</h3>
                      <div className='registerForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='Ridwan Taufiiqul'
                          required
                        />
                      </div>
                      
                      <h3 className='self-stretch text-regular-12-neutral-300 mt-3 mb-0.5'>Email</h3>
                      <div className='registerForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='ridwant@gmail.com'
                          required
                        />
                      </div>
                      
                      <h3 className='self-stretch text-regular-12-neutral-300 mt-3 mb-0.5'>Password</h3>
                      <div className='registerForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='••••••••'
                          required
                        />
                      </div>
                      
                      <h3 className='self-stretch text-regular-12-neutral-300 mt-3 mb-0.5'>Confirm Password</h3>
                      <div className='registerForm_input_inner flex items-center justify-center w-full h-[48px] py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600'>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className='input-styled placeholder-regular-14 dark:placeholder-regular-14-white outline-0 bg-transparent dark:text-white'
                          placeholder='••••••••'
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-center gap-2">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <label htmlFor="terms-checkbox" className="text-regular-12">
                      I agree to NexFile's <span className='text-regular-12-primary cursor-pointer hover:underline'>Terms of Service</span> and <span className='text-regular-12-primary cursor-pointer hover:underline'>Privacy Policy</span>
                    </label>
                  </div>
                </div>
                
                <div className='registerForm_button w-[350px] flex flex-col items-center self-stretch gap-6'>
                  <button type="submit" className='btn-primary'>
                    Register
                  </button>
                </div>
              </form>
              
              <h3 className='register_text text-regular-12'>
                Already have an account?
                <button
                  onClick={() => goto('login')}
                  className='text-regular-12-primary ml-1 hover:underline'
                >
                  Login
                </button>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default Register;