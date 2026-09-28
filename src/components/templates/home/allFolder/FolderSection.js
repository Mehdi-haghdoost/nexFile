import FolderCard from '@/components/modules/home/allFolder/FolderCard';
import { useFolders } from '@/hooks/folders/useFolders';

// parentId null lists root folders, which is what /home and /folder show
const FolderSection = ({ parentId = null, title = 'Folders' }) => {
  const { folders, isLoading } = useFolders(parentId);

  const gridClasses = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 w-full';

  if (isLoading) {
    return (
      <section className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
        <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>{title}</h3>
        <div className={gridClasses}>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className='flex w-full h-[46px] rounded-lg border border-[#ECECEE] bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 animate-pulse'
            />
          ))}
        </div>
      </section>
    );
  }

  // A folder with no subfolders says nothing here, since its files are listed below
  if (folders.length === 0 && parentId) return null;

  if (folders.length === 0) {
    return (
      <section className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
        <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>{title}</h3>
        <div className='flex items-center justify-center w-full py-8 border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg'>
          <p className='text-sm text-neutral-400 dark:text-neutral-300'>No folders yet. Create your first folder!</p>
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
      <div className='flex items-baseline gap-2'>
        <h3 className='text-sm sm:text-base md:text-lg font-medium text-neutral-500 dark:text-white'>{title}</h3>
        <span className='text-xs text-neutral-300 dark:text-neutral-400'>{folders.length}</span>
      </div>

      <div className={gridClasses}>
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </div>
    </section>
  );
};

export default FolderSection;