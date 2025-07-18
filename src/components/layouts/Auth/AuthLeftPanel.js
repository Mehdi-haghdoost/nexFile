import AuthCard from '@/components/modules/login-register/AuthCard';
import styles from './authLeftPanel.module.css';

const AuthLeftPanel = ({cards}) => {
      console.log('=== AuthLeftPanel ===');
    console.log('cards:', cards);
    console.log('cards length:', cards?.length);
    console.log('cards is array:', Array.isArray(cards));
    return (
        <div className='inline-flex h-[1000px]  flex-col justify-center items-center shrink-0 relative overflow-hidden'>
            {/* محل قرارگیری عکس */}
            <div className={`bg-[#121214] w-[702px] h-[1000px] shrink-0 ml-3 rounded-xl ${styles.authLeftPanel_image}`}>
            </div>

            {/* محل قرار گیری کارت ها */}
            {/* <div className='absolute inset-0 flex flex-col justify-center items-center gap-[40px] rounded-[25.455px]'>
                <AuthCard className='items-start w-[300px] h-[340px] p-[21.818px] gap-[18.182px] blur-card' >
                    <div className='flex-column-stretch'>
                        <h3 className='text-semibold-12-upper'>satisfaction</h3>
                        <div className='flex items-baseline gap-2'>
                            <h2 className='text-semibold-36'>+23,92%</h2>
                            <span className='text-regular-12-light'>last month</span>
                        </div>
                        <div>
                            <span className='text-regular-10-light'>
                                User satisfaction has increased with seamless file management, enhanced security, and fast access, making storage and sharing effortless
                            </span>
                        </div>
                        <div className={styles.authCard_graph}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="252" height="144" viewBox="0 0 252 144" fill="none">
                                <path d="M251.727 0.50408L0.818176 0.504059" stroke="white" strokeOpacity="0.2" strokeWidth="0.909091" />
                                <path d="M251.727 35.9587L0.818176 35.9586" stroke="white" strokeOpacity="0.2" strokeWidth="0.909091" />
                                <path d="M251.727 71.4132L0.818176 71.4131" stroke="white" strokeOpacity="0.2" strokeWidth="0.909091" />
                                <path d="M251.727 106.868L0.818176 106.868" stroke="white" strokeOpacity="0.2" strokeWidth="0.909091" />
                                <path d="M251.727 142.322L0.818176 142.322" stroke="white" strokeOpacity="0.2" strokeWidth="0.909091" />
                                <path d="M238.091 20.5041L238.091 142.322" stroke="url(#paint0_linear_254_10567)" strokeWidth="1.36364" />
                                <path d="M15.3636 142.322L80.0638 74.1934C89.4928 64.2648 94.2073 59.3005 100.223 59.1402C106.238 58.9798 111.211 63.6859 121.155 73.098L131.333 82.7308C141.108 91.9824 145.995 96.6082 151.932 96.5058C157.869 96.4033 162.594 91.6117 172.044 82.0284L238.091 15.0495" stroke="url(#paint1_linear_254_10567)" strokeWidth="4.54545" />
                                <ellipse cx="237.904" cy="15.0495" rx="5.26775" ry="5.45455" fill="#4D3EC6" />
                                <defs>
                                    <linearGradient id="paint0_linear_254_10567" x1="238.591" y1="20.5041" x2="238.591" y2="142.322" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#939393" />
                                        <stop offset="1" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_254_10567" x1="241.163" y1="15.0495" x2="-11.2897" y2="149.496" gradientUnits="userSpaceOnUse">
                                        <stop offset="0.254803" stopColor="#4D3EC6" />
                                        <stop offset="0.719222" stopColor="#A39CE2" stopOpacity="0.51485" />
                                        <stop offset="1" stopColor="white" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div></div>
                </AuthCard>
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
                <AuthCard className='items-start w-[300px] h-[345px] p-[21.818px] gap-[18.182px] blur-card' >
                    <div className='flex-column-stretch'>
                        <h3 className="text-semibold-12-upper">
                            TOTAL USER
                        </h3>
                        <div className='flex items-baseline gap-2'>
                            <h2 className='text-semibold-36'>+44,21%</h2>
                            <span className='text-regular-12-light'>last month</span>
                        </div>
                    </div>
                    <div>
                        <span className='text-regular-10-light'>
                            Our dashboard's growing reliability and efficiency have led to a significant increase in total users, reflecting trust and satisfaction in our service
                        </span>
                    </div>
                    <div className='flex justify_center items-end gap-[7.273px] self-stretch'>
                        <img src="./images/Graph.png" alt="Graph.png" />
                    </div>
                </AuthCard>
            </div> */}

            <div className='absolute inset-0 flex flex-col justify-center items-center gap-[40px] rounded-[25.455px]'>
                 {cards && cards.map((card, index) => {
                    console.log(`=== Rendering Card ${index} ===`);
                    console.log('Card data:', card);
                    console.log('Card type:', card.type);
                    console.log('====================');
                    
                    return (
                        <AuthCard key={index} card={JSON.parse(JSON.stringify(card))} />
                    );
                })}
            </div>
        </div>
    )
}

export default AuthLeftPanel;