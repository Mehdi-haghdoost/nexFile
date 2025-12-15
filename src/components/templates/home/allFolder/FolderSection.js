import FolderCard from '@/components/modules/home/allFolder/FolderCard';
import { FOLDER_NAMES } from '@/utils/constants/folderConstants';

const FolderSection = () => {
  const handleFolderMenuClick = (folderName) => {
    console.log(`اینجا باید مدال برای ${folderName} باز بشه`);
  }

  return (
    <div className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
      <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>Folder</h3>
      
      {/* Folder Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 w-full'>
        {FOLDER_NAMES.map((name, index) => (
          <FolderCard
            key={index}
            folderName={name}
            onMenuClick={handleFolderMenuClick}
          />
        ))}
      </div>
    </div>
  )
}

export default FolderSection;