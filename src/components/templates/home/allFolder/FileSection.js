import FileItem from '@/components/modules/home/allFolder/FileItem';
import FileGridItem from '@/components/modules/home/allFolder/FileGridItem';
import FileTableHeader from '@/components/modules/home/allFolder/FileTableHeader';
import FileSectionHeader from '@/components/modules/home/allFolder/FileSectionHeader';
import BulkActionsBar from '@/components/modules/home/allFolder/BulkActionsBar';
import {
    FilesEmptyState,
    FilesErrorState,
    FilesLoadingState,
} from '@/components/modules/home/allFolder/FileListStates';
import useFilesStore from '@/store/features/files/filesStore';
import { useFiles } from '@/hooks/files/filesManagement/useFiles';
import { getTimeAgo } from '@/utils/helpers/timeHelpers';
import useViewModeStore from '@/store/ui/viewModeStore';

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// folderId null lists every file in every folder, which is what /home and /folder show
const FileSection = ({ folderId = null, title = 'Your files' }) => {
    const { selectedFiles, selectFile, clearSelection } = useFilesStore();
    const { files, isLoading, error, totalFiles, hasMore, isLoadingMore, loadMore } = useFiles(folderId);
    const { viewMode } = useViewModeStore();

    const isAllSelected = files.length > 0 && selectedFiles.length === files.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
            return;
        }

        files.forEach((file) => {
            if (!selectedFiles.includes(file.id)) selectFile(file.id);
        });
    };

    const preparedFiles = files.map((file) => ({
        ...file,
        formattedSize: formatFileSize(file.size || 0),
        formattedTime: getTimeAgo(file.updatedAt),
    }));

    const selectedFileObjects = preparedFiles.filter((file) => selectedFiles.includes(file.id));

    if (isLoading) return <FilesLoadingState />;
    if (error) return <FilesErrorState error={error} />;

    return (
        <>
            <div className='flex flex-col items-start gap-5 flex-1 w-full'>
                <div className='w-full'>
                    {/* The count covers every matching file, including pages not loaded yet */}
                    <FileSectionHeader title={title} count={totalFiles} />
                </div>

                {preparedFiles.length === 0 && !hasMore ? (
                    <FilesEmptyState isRoot={!folderId} />
                ) : (
                    <>
                        {/* Table and grid are desktop only; mobile always uses cards */}
                        {viewMode === 'list' ? (
                            <div className='hidden md:flex flex-col w-full rounded-lg border border-[#F2F2F3] dark:border-neutral-700'>
                                <FileTableHeader
                                    isAllSelected={isAllSelected}
                                    onSelectAll={handleSelectAll}
                                />
                                <ul className='w-full'>
                                    {preparedFiles.map((file) => (
                                        <FileItem
                                            key={file.id}
                                            file={file}
                                            isSelected={selectedFiles.includes(file.id)}
                                            onSelect={() => selectFile(file.id)}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className='hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
                                {preparedFiles.map((file) => (
                                    <FileGridItem
                                        key={file.id}
                                        file={file}
                                        isSelected={selectedFiles.includes(file.id)}
                                        onSelect={() => selectFile(file.id)}
                                    />
                                ))}
                            </div>
                        )}

                        <div className='grid md:hidden grid-cols-2 gap-3 w-full'>
                            {preparedFiles.map((file) => (
                                <FileGridItem
                                    key={file.id}
                                    file={file}
                                    isSelected={selectedFiles.includes(file.id)}
                                    onSelect={() => selectFile(file.id)}
                                />
                            ))}
                        </div>

                        {/* The next files load under the ones already shown, in every view */}
                        {hasMore && (
                            <div className='flex justify-center w-full'>
                                <button
                                    type='button'
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className='flex items-center justify-center gap-2 h-9 px-5 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-sm font-medium text-neutral-500 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isLoadingMore && (
                                        <div className='w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                                    )}
                                    {isLoadingMore ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <BulkActionsBar selectedFiles={selectedFileObjects} />
        </>
    );
};

export default FileSection;