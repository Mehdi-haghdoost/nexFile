import styles from './authLayout.module.css';
import AuthLeftPanel from './AuthLeftPanel';

const AuthLayout = ({ children,cards }) => {

console.log('AuthLayout Cards ===>', cards);

    return (
        <div className='flex w-full h-[1024px] bg-white pt-[12px]'>
            {/* ستون سمت چپ */}
            <div className={`flex flex-1  h-full overflow-hidden`}>
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