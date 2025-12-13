import FileItem from '@/components/modules/home/allFolder/FileItem';
import FileTableHeader from '@/components/modules/home/allFolder/FileTableHeader';
import FileSectionHeader from '@/components/modules/home/allFolder/FileSectionHeader';
import FileActionMenu from '@/components/modules/home/allFolder/FileActionMenu';
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

    // Empty State
    if (files.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 flex-1 self-stretch p-8 sm:p-12 w-full'>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    fill="none"
                    className="stroke-[#9E9EA7] dark:stroke-white w-12 h-12 sm:w-16 sm:h-16"
                >
                    <path 
                        d="M29.3333 18.6667L26.368 12.7367C25.8653 11.7307 25.6139 11.2277 25.2529 10.8501C24.9337 10.5159 24.5493 10.2508 24.1239 10.0705C23.6409 9.86667 23.0927 9.86667 21.9963 9.86667H14.9333C12.3463 9.86667 11.0528 9.86667 10.0513 10.3597C9.16572 10.7966 8.44639 11.5159 8.00959 12.4015C7.51666 13.403 7.51666 14.6965 7.51666 17.2835V18.6667M7.51666 18.6667H49.0667C52.2403 18.6667 53.8271 18.6667 55.0197 19.3178C56.0701 19.8905 56.9095 20.7299 57.4822 21.7803C58.1333 22.9729 58.1333 24.5597 58.1333 27.7333V44.2667C58.1333 47.4403 58.1333 49.0271 57.4822 50.2197C56.9095 51.2701 56.0701 52.1095 55.0197 52.6822C53.8271 53.3333 52.2403 53.3333 49.0667 53.3333H14.9333C11.7597 53.3333 10.1729 53.3333 8.98025 52.6822C7.92987 52.1095 7.0905 51.2701 6.51782 50.2197C5.86666 49.0271 5.86666 47.4403 5.86666 44.2667V18.6667Z" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                        Select a folder
                    </h3>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300 px-4'>
                        Choose a folder from the sidebar to view its files
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-start gap-5 flex-1 w-full'>
            {/* File Header */}
            <div className='w-full'>
                <FileSectionHeader />
            </div>
            
            {/* Desktop Table View - نمایش از 768px به بالا - بدون scroll */}
            <div className='hidden md:flex flex-col w-full rounded-lg border border-[#F2F2F3] dark:border-neutral-700'>
                <FileTableHeader
                    isAllSelected={isAllSelected}
                    onSelectAll={selectAllFiles}
                />
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

            {/* Mobile Card View - نمایش زیر 768px */}
            <div className='flex md:hidden flex-col gap-2 w-full'>
                {files.map((file) => (
                    <div 
                        key={file.id}
                        className='flex items-center gap-3 p-3 rounded-lg border border-[#F2F2F3] dark:border-neutral-700 bg-white dark:bg-neutral-800 w-full'
                    >
                        <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white shrink-0"
                        />
                        
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none" className="shrink-0">
                                    <path d="M9.75 5.25L8.91334 3.57669C8.67255 3.0951 8.55215 2.8543 8.37253 2.67837C8.21368 2.5228 8.02224 2.40448 7.81206 2.33198C7.57437 2.25 7.30516 2.25 6.76672 2.25H3.9C3.05992 2.25 2.63988 2.25 2.31901 2.41349C2.03677 2.5573 1.8073 2.78677 1.66349 3.06901C1.5 3.38988 1.5 3.80992 1.5 4.65V5.25M1.5 5.25H12.9C14.1601 5.25 14.7902 5.25 15.2715 5.49524C15.6948 5.71095 16.039 6.05516 16.2548 6.47852C16.5 6.95982 16.5 7.58988 16.5 8.85V12.15C16.5 13.4101 16.5 14.0402 16.2548 14.5215C16.039 14.9448 15.6948 15.289 15.2715 15.5048C14.7902 15.75 14.1601 15.75 12.9 15.75H5.1C3.83988 15.75 3.20982 15.75 2.72852 15.5048C2.30516 15.289 1.96095 14.9448 1.74524 14.5215C1.5 14.0402 1.5 13.4101 1.5 12.15V5.25Z" stroke="#FFCA28" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>
                                    {file.name}
                                </h3>
                            </div>
                            
                            <div className='flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-300'>
                                <span className='truncate'>{file.size}</span>
                                <span>•</span>
                                <span className='truncate'>{file.lastModified}</span>
                            </div>
                        </div>
                        
                        <div className='shrink-0'>
                            <FileActionMenu fileName={file.name} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileSection;