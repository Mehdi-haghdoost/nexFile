import styles from './featureCard.module.css'

const FeatureCard = ({title,percentage,timeframe,description,image,className}) => {
    return (
        <div className={className}>
            <div className='flex-column-stretch'>
                <h3 className='text-semibold-12-upper'>{title}</h3>
                <div className='flex items-baseline gap-2'>
                    <h2 className='text-semibold-36'>{percentage}</h2>
                    <span className='text-regular-12-light'>{timeframe}</span>
                </div>
                <div>
                    <span className='text-regular-10-light'>
                        {description}
                    </span>
                </div>
                <div className={styles.authCard_graph}>
                   <img src={image} alt="container_image" />
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default FeatureCard