import styles from './testimonialCard.module.css';

const TestimonialCard = ({quote,user,className}) => {
    
    return (
        <div className={className}>
            <div>
                <h2 className={styles.authCard_title}>
                    {quote}
                </h2>
            </div>
            <div className='flex items-center'>
                <div className={styles.authCard_userImage}></div>
                <div className='flex flex-col justify-center ml-2 mt-3'>
                    <h3 className='text-semibold-16'>{user.name}</h3>
                    <span className='text-regular-14'>{user.email}</span>
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard