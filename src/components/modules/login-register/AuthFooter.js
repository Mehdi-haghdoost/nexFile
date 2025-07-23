import styles from './authFooter.module.css';

const AuthFooter = () => {
    return (
        <div className='flex items-center justify-between w-[580px]'>
            <h3 className='text-regular-12 text-center'>© 2024 - KeepCloud All Rights Reserved</h3>
            <div className='flex items-center gap-2'>
                <span className='text-regular-14' >Privacy Policy</span>
                <span className='text-regular-14'>•</span>
                <span className='text-regular-14'>Term & Condition</span>
            </div>
        </div>
    )
}

export default AuthFooter