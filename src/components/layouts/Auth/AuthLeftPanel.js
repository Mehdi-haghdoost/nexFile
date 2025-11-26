import AuthCard from '@/components/modules/login-register/AuthCard';
import styles from './authLeftPanel.module.css';

const AuthLeftPanel = ({ cards }) => {
    return (
        <div className='inline-flex h-full w-full flex-col justify-center items-center shrink-0 relative overflow-hidden rounded-xl'>
            
            {/* تصویر پس‌زمینه */}
            <div className={`bg-[#121214] w-full h-full shrink-0 rounded-xl ${styles.authLeftPanel_image}`}>
            </div>

            {/* کارت‌های شناور */}
            <div className='absolute inset-0 flex flex-col justify-center items-center gap-6 lg:gap-10 p-4'>
                {cards && cards.map((card, index) => {
                    const cardWithPosition = {
                        ...card,
                        className: index === 1 ? 'middle-card' : card.className,
                        isMiddle: index === 1
                    };

                    return (
                        <AuthCard key={index} card={cardWithPosition} />
                    );
                })}
            </div>
        </div>
    );
}

export default AuthLeftPanel;