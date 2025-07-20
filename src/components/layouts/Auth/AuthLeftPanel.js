import AuthCard from '@/components/modules/login-register/AuthCard';
import styles from './authLeftPanel.module.css';

const AuthLeftPanel = ({ cards }) => {

    return (
        <div className='inline-flex h-[1000px]  flex-col justify-center items-center shrink-0 relative overflow-hidden'>
            {/* محل قرارگیری عکس */}
            <div className={`bg-[#121214] w-[702px] h-[1000px] shrink-0 rounded-xl ${styles.authLeftPanel_image}`}>
            </div>

            {/* محل قرار گیری کارت ها */}

            <div className='absolute inset-0 flex flex-col justify-center items-center gap-[40px] rounded-[25.455px]'>
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
    )
}

export default AuthLeftPanel;