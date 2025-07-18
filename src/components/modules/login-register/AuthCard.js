import styles from './authCard.module.css';
import BarCard from './BarCard';
import ChartCard from './ChartCard';
import FeatureCard from './FeatureCard';
import FreeStorageCard from './FreeStorageCard';
import TestimonialCard from './TestimonialCard';

const AuthCard = ({ card }) => {
   
    // return (
    //     <div className={`flex flex-col  rounded-[28px] bg-white `}>

    //     </div>
    // )
    switch (card.type) {
        case 'chart':
            console.log('Rendering ChartCard');
            return (
                <ChartCard
                    title={card.title}
                    percentage={card.percentage}
                    timeframe={card.timeframe}
                    description={card.description}
                    image={card.image}
                    className={card.className}
                />
            );

        case 'testimonial':
            console.log('Rendering TestimonialCard');
            return (
                <TestimonialCard
                    quote={card.quote}
                    user={card.user}
                    className={card.className}
                />
            );

        case 'bar':
            console.log('Rendering BarCard');
            return (
                <BarCard
                    title={card.title}
                    percentage={card.percentage}
                    timeframe={card.timeframe}
                    description={card.description}
                    image={card.image}
                    className={card.className}
                />
            );
        case 'feature':
            console.log('Rendering FeatureCard');
            return (
                <FeatureCard
                    title={card.title}
                    percentage={card.percentage}
                    timeframe={card.timeframe}
                    description={card.description}
                    icon={card.icon}
                    className={card.className}
                />
            );
        case 'freeStorage':
            console.log('Rendering FreeStorageCard');
            return (
                <FreeStorageCard
                    title={card.title}
                    icon={card.icon}
                    storage={card.storage}
                    description={card.description}
                    className={card.className}
                />
            );
        default:
            return null;
    }
}
export default AuthCard;