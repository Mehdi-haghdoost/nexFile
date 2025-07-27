import styles from './authLayout.module.css';
import AuthLeftPanel from './AuthLeftPanel';

const AuthLayout = ({ children,cards }) => {

    return (
        <div className='flex w-full h-[1024px] bg-white dark:bg-gray-900 py-[12px] overflow-hidden'>
            {/* ستون سمت چپ */}
            <div className={`flex flex-1  h-full ml-3 border `}>
                <AuthLeftPanel cards={cards} />
            </div>
            {/* ستون سمت راست */}
            <div className={`flex-1  ${styles.authLayout_rightSide}`}>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;