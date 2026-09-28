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

// folderId null means the root level, which is what /home and /folder show
const FileSection = ({ folderId = null }) => {
    const { selectedFiles, selectFile, clearSelection } = useFilesStore();
    const { files, isLoading, error } = useFiles(folderId);
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
                    <FileSectionHeader />
                </div>

                {preparedFiles.length === 0 ? (
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
                    </>
                )}
            </div>

            <BulkActionsBar selectedFiles={selectedFileObjects} />
        </>
    );
};

export default FileSection;