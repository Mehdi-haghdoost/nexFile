import { FolderIcon2 } from '@/components/ui/icons';

const SuggestedCard = ({ image, title, time, onClick }) => {
  return (
    <div 
      className='flex flex-col items-start gap-2 p-3 sm:p-4 rounded-lg bg-white border border-[#ECECEE] dark:bg-neutral-800 dark:border-neutral-700 w-full cursor-pointer hover:shadow-md transition-shadow'
      onClick={onClick}
    >
      <div className='w-full bg-[#F6F6F7] dark:bg-neutral-700 rounded-lg py-6 sm:py-8 flex items-center justify-center overflow-hidden'>
        <img 
          className='max-w-full max-h-32 object-contain' 
          src={image} 
          alt={title}
          onError={(e) => {
            e.target.src = '/images/folder.png';
          }}
        />
      </div>
      <div className='flex justify-center items-center gap-1.5 self-stretch'>
        <div className='shrink-0'>
          <FolderIcon2 />
        </div>
        <h3 className='text-sm font-medium dark:text-white flex-1 truncate'>{title}</h3>
        <p className='text-xs text-neutral-300 dark:text-neutral-400 whitespace-nowrap'>{time}</p>
      </div>
    </div>
  );
};

export default SuggestedCard;