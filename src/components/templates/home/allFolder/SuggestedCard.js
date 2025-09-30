import { FolderIcon2 } from '@/components/ui/icons';

const SuggestedCard = ({ image, title, time }) => {
  return (
    <li className='flex flex-col items-start w-[246px] gap-2 flex-1 p-4 rounded-lg bg-white border border-[#ECECEE]'>
      <img 
        className='bg-[#F6F6F7] rounded-lg py-4 px-7 gap-2.5' 
        src={image} 
        alt={title} 
      />
      <div className='flex justify-center items-center gap-1.5 self-stretch'>
        <FolderIcon2 />
        <h3 className='text-medium-14 flex-1'>{title}</h3>
        <p className='text-regular-12'>{time}</p>
      </div>
    </li>
  );
};

export default SuggestedCard;