import styles from './chartCard.js.module.css';

const ChartCard = ({title,percentage,timeframe,description,chartType,className,image}) => {
    return (
        <div className={className}>
            <div className='flex-column-stretch gap-0'>
                <h3 className='text-semibold-12-upper'>{title}</h3>
                <div className='flex items-baseline'>
                    <h2 className='text-semibold-36'>{percentage}</h2>
                    <span className='text-regular-12-light'>{timeframe}</span>
                </div>
                <div>
                    <span className='text-regular-10-light'>
                       {description}
                    </span>
                </div>
                <div className={styles.authCard_graph}>
                    <img className={styles.authCard_graph} src={image} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ChartCard