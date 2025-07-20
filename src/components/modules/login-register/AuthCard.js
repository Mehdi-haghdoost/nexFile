import styles from './authCard.module.css';
import BarCard from './BarCard';
import ChartCard from './ChartCard';
import FeatureCard from './FeatureCard';
import FreeStorageCard from './FreeStorageCard';
import TestimonialCard from './TestimonialCard';

const AuthCard = ({ card }) => {

    switch (card.type) {
        case 'chart':
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
            return (
                <TestimonialCard
                    quote={card.quote}
                    user={card.user}
                    className={card.className}
                />
            );

        case 'bar':
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
            return (
                <FeatureCard
                    title={card.title}
                    percentage={card.percentage}
                    timeframe={card.timeframe}
                    description={card.description}
                    image={card.image}
                    className={card.className}
                />
            );
        case 'freeStorage':
            return (
                <FreeStorageCard
                    title={card.title}
                    image={card.image}
                    storage={card.storage}
                    timeframe={card.timeframe}
                    description={card.description}
                    className={card.className}
                />
            );
        default:
            return null;
    }
}
export default AuthCard;