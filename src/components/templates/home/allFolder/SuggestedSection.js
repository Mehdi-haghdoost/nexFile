import SuggestedCard from './SuggestedCard';
import { useSuggestedFiles } from '@/hooks/files/suggestedFiles/useSuggestedFiles';
import { getTimeAgo, getFileImage } from '@/utils/helpers/timeHelpers';

const SuggestedSection = () => {
  const { suggestedFiles, isLoading, error } = useSuggestedFiles(4);

  const handleFileClick = (file) => {
    console.log('File clicked:', file);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-start gap-3 self-stretch'>
        <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
          Suggested from your activity
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex flex-col items-start gap-2 p-3 sm:p-4 rounded-lg bg-white border border-[#ECECEE] dark:bg-neutral-800 dark:border-neutral-700 w-full animate-pulse'>
              <div className='w-full bg-gray-200 dark:bg-neutral-700 rounded-lg h-32'></div>
              <div className='w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-start gap-3 self-stretch'>
        <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
          Suggested from your activity
        </h3>
        <div className='w-full p-4 text-center text-neutral-400'>
          <p>Unable to load suggested files</p>
        </div>
      </div>
    );
  }

  if (!suggestedFiles || suggestedFiles.length === 0) {
    return (
      <div className='flex flex-col items-start gap-3 self-stretch'>
        <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
          Suggested from your activity
        </h3>
        <div className='w-full p-8 text-center text-neutral-400'>
          <p>No recent activity yet</p>
          <p className='text-sm mt-2'>Your recently accessed files will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start gap-3 self-stretch'>
      <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
        Suggested from your activity
      </h3>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full'>
        {suggestedFiles.map((file) => (
          <SuggestedCard
            key={file.id}
            image={getFileImage(file.mimeType, file.image)}
            title={file.originalName || file.name}
            time={getTimeAgo(file.updatedAt)}
            onClick={() => handleFileClick(file)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedSection;