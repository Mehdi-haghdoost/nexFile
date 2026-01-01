'use client';
import SidebarHeader from '../Home/SidebarHeader';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon2 } from '@/components/ui/icons';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { useFolders } from '@/hooks/folders/useFolders';
import StorageWidget from '../Home/StorageWidget';

const FolderSidebar = ({ isOpen, onToggle }) => {
    const { folders, isLoading } = useFolders(); // Fetch folders
    const {
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
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            onToggle(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeInOverlay"
                    onClick={() => onToggle(false)}
                />
            )}

            <nav className={`
                flex flex-col min-h-screen items-start px-4 py-4 lg:px-6 lg:py-6 
                flex-shrink-0 gap-6 lg:gap-8 
                border-r border-l border-gray-200 dark:border-neutral-800 
                bg-white dark:bg-neutral-900
                transition-transform duration-300 ease-in-out
                w-60 lg:w-[267px]
                
                ${isOpen 
                    ? 'fixed right-0 top-0 bottom-0 z-50 translate-x-0 shadow-2xl' 
                    : 'fixed right-0 top-0 bottom-0 z-50 translate-x-full'
                }
                
                lg:static lg:translate-x-0 lg:shadow-none
            `}>
                <button
                    onClick={() => onToggle(false)}
                    className="lg:hidden absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors z-10"
                    aria-label="Close menu"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-500 dark:text-white"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <SidebarHeader />

                <div className='flex flex-col items-start self-stretch flex-1 gap-1 overflow-y-auto custom-scrollbar'>
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full py-8">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : folders.length === 0 ? (
                        <div className="flex items-center justify-center w-full py-8">
                            <p className="text-sm text-neutral-400 dark:text-neutral-300 text-center px-4">
                                No folders yet
                            </p>
                        </div>
                    ) : (
                        folders.map((folder) => {
                            const isExpanded = expandedFolders.includes(folder.id);
                            const isSelected = selectedFolder === folder.id;
                            const fileCount = folder.files?.length || 0;

                            return (
                                <div key={folder.id} className='w-full'>
                                    <button
                                        onClick={() => handleFolderClick(folder.id)}
                                        className={`flex items-center gap-2 self-stretch w-full px-3 py-2 rounded-lg ${
                                            isSelected
                                                ? 'bg-purple-50 text-blue-700 dark:bg-dark-gradient dark:text-medium-14-white dark:border-dark-border'
                                                : 'hover:bg-gray-50 text-gray-700 dark:hover:bg-dark-gradient dark:text-regular-14-neutral-200' 
                                        }`}
                                    >
                                        <span className='flex-shrink-0 transition-transform duration-200'>
                                            {isExpanded ? (
                                                <ChevronDownIcon />
                                            ) : (
                                                <ChevronRightIcon />
                                            )}
                                        </span>

                                        <FolderIcon2 />

                                        <span className={`text-sm flex-1 text-left truncate ${isSelected ? 'font-medium' : ''}`}>
                                            {folder.name}
                                        </span>

                                        <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full dark:bg-neutral-600 dark:text-neutral-300'>
                                            {fileCount}
                                        </span>
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className='flex flex-col gap-0.5 ml-6'>
                                            {folder.files?.map((file) => {
                                                const isFileSelected = selectedFile === file.id;

                                                return (
                                                    <button
                                                        key={file.id}
                                                        onClick={() => handleFileClick(folder.id, file.id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-left ${
                                                            isFileSelected
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-neutral-700 dark:text-regular-12-neutral-300'
                                                                : 'hover:bg-gray-100 text-gray-600 dark:hover:bg-dark-gradient dark:text-regular-12-neutral-300'
                                                        }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
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
                        })
                    )}
                </div>
                <StorageWidget />
            </nav>
        </>
    );
};

export default FolderSidebar;