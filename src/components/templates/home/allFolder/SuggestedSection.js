import SuggestedCard from './SuggestedCard';
import { SUGGESTED_ITEMS } from '@/utils/constants/suggestedConstants';

const SuggestedSection = () => {
  return (
    <div className='flex flex-col items-start gap-3 self-stretch'>
      <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
        Suggested from your activity
      </h3>
      
      {/* Suggested Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full'>
        {SUGGESTED_ITEMS.map((item) => (
          <SuggestedCard
            key={item.id}
            image={item.image}
            title={item.title}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedSection;