import AuthCard from '@/components/modules/login-register/AuthCard';
import styles from './authLeftPanel.module.css';

const AuthLeftPanel = () => {
    return (
        <div className='inline-flex h-[1000px]  flex-col justify-center items-center shrink-0 relative overflow-hidden'>
            {/* محل قرارگیری عکس */}
            <div className={`bg-[#121214] w-[702px] h-[1000px] shrink-0 ml-3 rounded-xl ${styles.authLeftPanel_image}`}>
            </div>

            {/* محل قرار گیری کارت ها */}
            <div className='absolute inset-0 flex flex-col justify-center items-center gap-[40px]'>
                <AuthCard className='w-[300px] h-[340px]' ></AuthCard>
                <AuthCard className='items-start w-[330px] h-[401px] p-[24px] gap-[12px] rounded-[28px] border border-[#E1E0E5] border' >
                    <div>
                        <h2 className={styles.authCard_title}>
                            "The search and folder organization features are incredibly efficient. My productivity has improved since using this dashboard!"
                        </h2>
                    </div>
                    <div className='flex items-center'>
                        <div className={styles.authCard_userImage}></div>
                        <div className='flex flex-col justify-center ml-2'>
                            <h3 className='text-semibold-16'>David Villa</h3>
                            <span className='text-regular-14'>davill@gmail.com</span>
                        </div>
                    </div>
                </AuthCard>
                <AuthCard className=' items-start w-[300px] h-[345px] p-[21.818px] gap-[18.182px] rounded-[25.455px] border-[0.909px] border-[#E1E0E5] opacity-60 backdrop-blur-[60.909px]' >
                    <div className='flex flex-col items-start gap-[10.909px] self-stretch'>
                        <h3 className={`text-neutral-500 ${styles.authCard_company_title}`}>
                            TOTAL USER
                        </h3>
                        <div className='flex items-baseline gap-2'>
                            <h2 className='text-neutral-500 text-[36.364px] not-italic font-semibold leading-[150%] tracking-[-1.091px]'>+44,21%</h2>
                            <span className='text-neutral-300 text-[12.727px] font-normal not-italic leading-[150%] tracking-[-0.255px]'>last month</span>
                        </div>
                    </div>
                    <div>
                        <span className='text-neutral-300 text-[10.91px] font-normal not-italic tracking-[-0.255px]'>
                            Our dashboard's growing reliability and efficiency have led to a significant increase in total users, reflecting trust and satisfaction in our service
                        </span>
                    </div>
                    <div className='flex justify_center items-end gap-[7.273px] self-stretch'>
                        <img src="./images/Graph.png" alt="Graph.png" />
                    </div>
                </AuthCard>
            </div>
        </div>
    )
}

export default AuthLeftPanel;