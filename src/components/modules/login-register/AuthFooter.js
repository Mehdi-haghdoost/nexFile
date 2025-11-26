// import styles from './authFooter.module.css';

// const AuthFooter = () => {
//     return (
//         <div className='flex items-center justify-between w-[580px] p-3'>
//             <h3 className='text-regular-12 text-center'>© 2024 - KeepCloud All Rights Reserved</h3>
//             <div className='flex items-center gap-2'>
//                 <span className='text-regular-14' >Privacy Policy</span>
//                 <span className='text-regular-14'>•</span>
//                 <span className='text-regular-14'>Term & Condition</span>
//             </div>
//         </div>
//     )
// }

// export default AuthFooter

// C:\Users\LENOVO\Desktop\nexFile\src\components\modules\login-register\AuthFooter.js

import styles from './authFooter.module.css';

const AuthFooter = () => {
    return (
        <div className='flex flex-col sm:flex-row items-center justify-between w-full max-w-[580px] px-4 py-3 gap-2 sm:gap-4'>
            <h3 className='text-regular-12 text-center sm:text-left whitespace-nowrap'>
                © 2024 - KeepCloud All Rights Reserved
            </h3>
            <div className='flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap'>
                <span className='text-regular-14'>Privacy Policy</span>
                <span className='text-regular-14'>•</span>
                <span className='text-regular-14'>Term & Condition</span>
            </div>
        </div>
    )
}

export default AuthFooter;