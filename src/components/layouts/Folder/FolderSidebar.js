// 'use client';

// import SidebarHeader from '../Home/SidebarHeader';
// import StorageWidget from '../Home/StorageWidget';
// import FolderTreeNode from './FolderTreeNode';
// import { CloseIcon } from '@/components/ui/icons';
// import { useFolders } from '@/hooks/folders/useFolders';
// import useFoldersStore from '@/store/features/folders/foldersStore';

// const FolderSidebar = ({ isOpen, onToggle }) => {
//     const { folders, isLoading } = useFolders();
//     const expandedFolders = useFoldersStore((state) => state.expandedFolders);
//     const collapseAll = useFoldersStore((state) => state.collapseAll);

//     // Navigating from the tree closes the drawer on small screens
//     const handleNavigate = () => {
//         if (typeof window !== 'undefined' && window.innerWidth < 1024) {
//             onToggle(false);
//         }
//     };

//     return (
//         <>
//             {isOpen && (
//                 <div
//                     className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeInOverlay"
//                     onClick={() => onToggle(false)}
//                 />
//             )}

//             <nav className={`
//                 flex flex-col min-h-screen items-start px-4 py-4 lg:px-6 lg:py-6 
//                 flex-shrink-0 gap-6 lg:gap-8 
//                 border-r border-l border-gray-200 dark:border-neutral-800 
//                 bg-white dark:bg-neutral-900
//                 transition-transform duration-300 ease-in-out
//                 w-60 lg:w-[267px]
                
//                 ${isOpen 
//                     ? 'fixed right-0 top-0 bottom-0 z-50 translate-x-0 shadow-2xl' 
//                     : 'fixed right-0 top-0 bottom-0 z-50 translate-x-full'
//                 }
                
//                 lg:static lg:translate-x-0 lg:shadow-none
//             `}>
//                 <button
//                     onClick={() => onToggle(false)}
//                     className="lg:hidden absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors z-10"
//                     aria-label="Close menu"
//                 >
//                     <CloseIcon />
//                 </button>

//                 <SidebarHeader />

//                 <div className='flex flex-col items-start self-stretch flex-1 gap-1 overflow-y-auto custom-scrollbar'>
//                     <div className='flex items-center justify-between w-full px-1 pb-1'>
//                         <span className='text-xs font-medium text-neutral-400 dark:text-neutral-300'>
//                             Folders
//                         </span>

//                         {expandedFolders.length > 0 && (
//                             <button
//                                 onClick={collapseAll}
//                                 className='text-xs text-primary-500 hover:underline'
//                             >
//                                 Collapse all
//                             </button>
//                         )}
//                     </div>

//                     {isLoading ? (
//                         <div className="flex items-center justify-center w-full py-8">
//                             <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
//                         </div>
//                     ) : folders.length === 0 ? (
//                         <div className="flex items-center justify-center w-full py-8">
//                             <p className="text-sm text-neutral-400 dark:text-neutral-300 text-center px-4">
//                                 No folders yet
//                             </p>
//                         </div>
//                     ) : (
//                         folders.map((folder) => (
//                             <FolderTreeNode
//                                 key={folder.id}
//                                 folder={folder}
//                                 onNavigate={handleNavigate}
//                             />
//                         ))
//                     )}
//                 </div>

//                 <StorageWidget />
//             </nav>
//         </>
//     );
// };

// export default FolderSidebar;
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import SidebarHeader from '../Home/SidebarHeader';
import StorageWidget from '../Home/StorageWidget';
import FolderTreeNode from './FolderTreeNode';
import { CloseIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/folders/useFolders';
import { useFolderDetails } from '@/hooks/folders/useFolderDetails';
import useFoldersStore from '@/store/features/folders/foldersStore';

const FolderSidebar = ({ isOpen, onToggle }) => {
    const params = useParams();
    const { folders, isLoading } = useFolders();

    const expandedFolders = useFoldersStore((state) => state.expandedFolders);
    const expandPath = useFoldersStore((state) => state.expandPath);
    const collapseAll = useFoldersStore((state) => state.collapseAll);

    // The path to the open folder, which the page is loading anyway
    const { path } = useFolderDetails(params?.id || null);

    // Opens the branch leading to the current folder, so arriving by URL reveals where it sits
    useEffect(() => {
        if (!path.length) return;

        const ancestors = path.slice(0, -1).map((entry) => entry.id);
        if (ancestors.length) expandPath(ancestors);
    }, [path, expandPath]);

    // Navigating from the tree closes the drawer on small screens
    const handleNavigate = () => {
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
                    <CloseIcon />
                </button>

                <SidebarHeader />

                <div className='flex flex-col items-start self-stretch flex-1 gap-1 overflow-y-auto custom-scrollbar'>
                    <div className='flex items-center justify-between w-full px-1 pb-1'>
                        <span className='text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                            Folders
                        </span>

                        {expandedFolders.length > 0 && (
                            <button
                                onClick={collapseAll}
                                className='text-xs text-primary-500 hover:underline'
                            >
                                Collapse all
                            </button>
                        )}
                    </div>

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
                        folders.map((folder) => (
                            <FolderTreeNode
                                key={folder.id}
                                folder={folder}
                                onNavigate={handleNavigate}
                            />
                        ))
                    )}
                </div>

                <StorageWidget />
            </nav>
        </>
    );
};

export default FolderSidebar;

