import styles from './freeStorageCard.module.css';

const FreeStorageCard = ({ title, image, storage,timeframe, description, className }) => {
    return (
        <div className={className}>
            <div className='flex-column-stretch'>
                <h3 className='text-semibold-12-upper'>{title}</h3>
                <div className='flex items-baseline'>
                    <h2 className='text-semibold-36'>{storage}</h2>
                    <span className='text-medium-24'>{timeframe}</span>
                </div>
                <div>
                    <span className='text-regular-10-light'>
                        {description}
                    </span>
                </div>
                <div className={styles.authCard_graph}>
                    <img src={image} alt="folder_img" />
                </div>
            </div>
        </div>
    )
}

export default FreeStorageCard