import FolderCard from '@/components/modules/home/allFolder/FolderCard';
import { useFolders } from '@/hooks/folders/useFolders';
import useFoldersStore from '@/store/features/folders/foldersStore';

const FolderSection = () => {
  const { folders, isLoading } = useFolders();
  const { setSelectedFolder } = useFoldersStore();

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
  };

  const handleFolderMenuClick = (folderName) => {
    console.log(`Menu clicked for ${folderName}`);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
        <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>Folder</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 w-full'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className='flex w-full h-[36px] sm:h-[38px] py-1 px-2 sm:px-3 items-center gap-1.5 sm:gap-2 rounded-lg border border-[#ECECEE] bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 animate-pulse'
            />
          ))}
        </div>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
        <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>Folder</h3>
        <div className='flex items-center justify-center w-full py-8 border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg'>
          <p className='text-sm text-neutral-400 dark:text-neutral-300'>No folders yet. Create your first folder!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
      <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>Folder</h3>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 w-full'>
        {folders.map((folder) => (
          <div key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            <FolderCard
              folderName={folder.name}
              onMenuClick={handleFolderMenuClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderSection;