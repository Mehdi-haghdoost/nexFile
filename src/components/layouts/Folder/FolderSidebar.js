import SidebarHeader from '../Home/SidebarHeader';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon2 } from '@/components/ui/icons';
import { useFoldersStore } from '@/store/features/folders/foldersStore';
import StorageWidget from '../Home/StorageWidget';

const FolderSidebar = () => {
    const {
        folders,
        selectedFolder,
        selectedFile,
        expandedFolders,
        setSelectedFolder,
        setSelectedFile,
        toggleFolder
    } = useFoldersStore();

    const handleFolderClick = (folderId) => {
        toggleFolder(folderId);
        setSelectedFolder(folderId);
    };

    const handleFileClick = (folderId, fileId) => {
        setSelectedFolder(folderId);
        setSelectedFile(fileId);
    };

    return (
        <nav className='flex flex-col min-h-screen items-start w-60 lg:w-[267px] px-4 py-4 lg:px-6 lg:py-6 flex-shrink-0 gap-6 lg:gap-8 border-r border-l border-gray-200 bg-white'>
            <SidebarHeader />

            <div className='flex flex-col items-start self-stretch flex-1 gap-1 overflow-y-auto'>
                {folders.map((folder) => {
                    const isExpanded = expandedFolders.includes(folder.id);
                    const isSelected = selectedFolder === folder.id;

                    return (
                        <div key={folder.id} className='w-full'>
                            {/* Folder Button */}
                            <button
                                onClick={() => handleFolderClick(folder.id)}
                                className={`flex items-center gap-2 self-stretch w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-purple-50 text-blue-700'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                {/* Chevron Icon */}
                                <span className='flex-shrink-0 transition-transform duration-200'>
                                    {isExpanded ? (
                                        <ChevronDownIcon />
                                    ) : (
                                        <ChevronRightIcon />
                                    )}
                                </span>

                                {/* Folder Icon */}
                                <FolderIcon2 />

                                {/* Folder Name */}
                                <span className={`text-sm flex-1 text-left ${isSelected ? 'font-medium' : ''}`}>
                                    {folder.name}
                                </span>

                                {/* File Count Badge */}
                                <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                                    {folder.files.length}
                                </span>
                            </button>

                            {/* Files List with smooth animation */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className='flex flex-col gap-0.5 ml-6'>
                                    {folder.files.map((file) => {
                                        const isFileSelected = selectedFile === file.id;

                                        return (
                                            <button
                                                key={file.id}
                                                onClick={() => handleFileClick(folder.id, file.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-left transition-all duration-150 ${
                                                    isFileSelected
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'hover:bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {/* File Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M8.16667 1.75H3.5C3.19058 1.75 2.89384 1.87292 2.67504 2.09171C2.45625 2.31051 2.33333 2.60725 2.33333 2.91667V11.0833C2.33333 11.3928 2.45625 11.6895 2.67504 11.9083C2.89384 12.1271 3.19058 12.25 3.5 12.25H10.5C10.8094 12.25 11.1062 12.1271 11.325 11.9083C11.5437 11.6895 11.6667 11.3928 11.6667 11.0833V5.25L8.16667 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8.16667 1.75V5.25H11.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                <span className='text-xs truncate'>
                                                    {file.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <StorageWidget />
        </nav>
    );
};

export default FolderSidebar;