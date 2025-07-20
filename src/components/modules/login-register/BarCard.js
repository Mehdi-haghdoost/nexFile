import styles from './barCard.module.css';

const BarCard = ({ title, percentage, timeframe, description, className, image }) => {

    return (
        <div className='flex flex-col '>
            <div className={className}>
                <div className='flex-column-stretch gap-0'>
                    <h3 className="text-semibold-12-upper">
                        {title}
                    </h3>
                    <div className='flex items-baseline'>
                        <h2 className='text-semibold-36 mr-2'>{percentage}</h2>
                        <span className='text-regular-12-light'>{timeframe}</span>
                    </div>
                </div>
                <div className='my-2'>
                    <span className='text-regular-10-light'>
                        {description}
                    </span>
                </div>
                <div className='flex justify_center items-end  self-stretch'>
                    <img src={image} alt="Graph.png" className='w-[256px] h-[105px]' />
                </div>
            </div>
        </div>

    )
}

export default BarCard