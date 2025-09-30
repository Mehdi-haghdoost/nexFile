import FileItem from '@/components/modules/home/allFolder/FileItem';
import FileTableHeader from '@/components/modules/home/allFolder/FileTableHeader';
import FileSectionHeader from '@/components/modules/home/allFolder/FileSectionHeader';
import { useFoldersStore } from '@/store/features/folders/foldersStore';

const FileSection = () => {
    const {
        selectedFiles,
        getCurrentFolderFiles,
        toggleFileSelection,
        selectAllFiles
    } = useFoldersStore();

    const files = getCurrentFolderFiles();
    const isAllSelected = files.length > 0 && selectedFiles.length === files.length;

    if (files.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 flex-1 self-stretch p-12'>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M29.3333 18.6667L26.368 12.7367C25.8653 11.7307 25.6139 11.2277 25.2529 10.8501C24.9337 10.5159 24.5493 10.2508 24.1239 10.0705C23.6409 9.86667 23.0927 9.86667 21.9963 9.86667H14.9333C12.3463 9.86667 11.0528 9.86667 10.0513 10.3597C9.16572 10.7966 8.44639 11.5159 8.00959 12.4015C7.51666 13.403 7.51666 14.6965 7.51666 17.2835V18.6667M7.51666 18.6667H49.0667C52.2403 18.6667 53.8271 18.6667 55.0197 19.3178C56.0701 19.8905 56.9095 20.7299 57.4822 21.7803C58.1333 22.9729 58.1333 24.5597 58.1333 27.7333V44.2667C58.1333 47.4403 58.1333 49.0271 57.4822 50.2197C56.9095 51.2701 56.0701 52.1095 55.0197 52.6822C53.8271 53.3333 52.2403 53.3333 49.0667 53.3333H14.9333C11.7597 53.3333 10.1729 53.3333 8.98025 52.6822C7.92987 52.1095 7.0905 51.2701 6.51782 50.2197C5.86666 49.0271 5.86666 47.4403 5.86666 44.2667V18.6667Z" stroke="#9E9EA7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className='flex flex-col items-center gap-2'>
                    <h3 className='text-lg font-medium text-gray-900'>Select a folder</h3>
                    <p className='text-sm text-gray-500'>Choose a folder from the sidebar to view its files</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-start gap-5 flex-1 self-stretch'>
            {/* file header */}
            <FileSectionHeader />
            
            {/* file list */}
            <div className='flex flex-col items-start flex-1 self-stretch rounded-lg border border-[#F2F2F3]'>
                {/* Header */}
                <FileTableHeader
                    isAllSelected={isAllSelected}
                    onSelectAll={selectAllFiles}
                />

                {/* Content */}
                <ul className='w-full'>
                    {files.map((file) => (
                        <FileItem
                            key={file.id}
                            name={file.name}
                            sharedBy={file.sharedBy}
                            sharedByImage={file.sharedByImage}
                            fileSize={file.size}
                            lastModified={file.lastModified}
                            isSelected={selectedFiles.includes(file.id)}
                            onSelect={() => toggleFileSelection(file.id)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileSection;