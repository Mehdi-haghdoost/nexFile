import AuthLeftPanel from './AuthLeftPanel';

const AuthLayout = ({ children, cards }) => {
    return (
        <div className='flex flex-col md:flex-row w-full h-screen bg-white dark:bg-gray-900 md:py-3 overflow-hidden'>

            {/* Marketing panel, desktop only */}
            <div className='hidden md:flex md:flex-1 h-full md:ml-3 overflow-hidden'>
                <AuthLeftPanel cards={cards} />
            </div>

            {/* Scrollable form column */}
            <div className='flex-1 w-full h-full overflow-y-auto overflow-x-hidden'>
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;