import FolderCard from '@/components/modules/home/allFolder/FolderCard';
import styles from './folderSection.module.css';

const FolderSection = () => {

  const folderNames = [
    'Wireframes',
    'Prototypes',
    'User Research',
    'Inspiration',
    'Final Designs',
    'Mockups',
    'Design System',
    'Assets',
    'Usability Testing',
    'Documentation',
  ]

  const handleFolderMenuClick = (folderName) => {
    console.log(`اینجا باید مدال برای ${folderName} باز بشه`);

  }

  return (
    <div className='flex flex-col items-start gap-3 self-stretch'>
      <h3 className='text-medium-18 dark:text-medium-18-white'>Folder</h3>
      {/* folder list */}
      <div className='flex items-start gap-3 self-stretch'>
        <div className='flex  items-start gap-3 flex-1 flex-wrap'>
          {folderNames.map((name, index) => (
            <FolderCard
              key={index}
              folderName={name}
              onMenuClick={handleFolderMenuClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FolderSection;