import React from 'react';
import { CollapseSidebarIcon, FileIcon, HomeIcon } from '@/components/ui/icons';
import FolderItem from '@/components/modules/Modals/CreateFileModal/FolderItem';

const PaperDocSidebar = ({
    folders,
    selectedFolder,
    openedFolderId,
    onFolderSelect,
    onBackToHome,
    onCollapseSidebar,
    isCollapsed = false
}) => {
    const handleBackToHome = () => {
        if (onBackToHome) {
            onBackToHome();
        }
    };

    const handleCollapseSidebar = () => {
        if (onCollapseSidebar) {
            onCollapseSidebar();
        }
    };


    const sidebarClasses = `
        flex flex-col items-start gap-8 flex-shrink-0 bg-white border-l border-r border-[#F2F2F3]
        transition-[width,padding] duration-300 ease-in-out overflow-hidden
        ${isCollapsed ? 'w-12 p-2' : 'w-[267px] p-6'}
    `.trim();

    return (
        <div className={sidebarClasses}>
            {/* Back to Home Section */}
            <div className={`flex items-center h-[42px] gap-2 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch'}`}>
                {isCollapsed ? (
                    <button
                        onClick={onCollapseSidebar}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Expand sidebar"
                    >
                        <div className="transition-transform duration-300 rotate-180">
                            <CollapseSidebarIcon />
                        </div>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onBackToHome}
                            className="flex flex-1 items-center text-start gap-2 hover:opacity-70 transition-opacity"
                        >
                            <HomeIcon />
                            <h2 className='text-medium-16 flex-1'>Back to home</h2>
                        </button>
                        <button
                            onClick={onCollapseSidebar}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Collapse sidebar"
                        >
                            <div className="transition-transform duration-300">
                                <CollapseSidebarIcon />
                            </div>
                        </button>
                    </>
                )}
            </div>

            <div
                className={`
                    flex flex-col items-start gap-1 self-stretch
                    transition-opacity duration-200
                    ${isCollapsed ? 'opacity-0' : 'opacity-100 delay-150'}
                `}
                >

                {folders.map((folder) => (
                    <div key={folder.id}>
                        <FolderItem
                            folder={folder}
                            isSelected={selectedFolder?.id === folder.id}
                            onSelect={onFolderSelect}
                            showDivider={false}
                        />

                        {/* نمایش لیست فایل های هر فولدر */}
                        {openedFolderId === folder.id && (
                            <div className='flex flex-col items-start py-0 px-[19px] self-stretch'>
                                {folder.files.length > 0 ? (
                                    folder.files.map((file) => (
                                        <div
                                            key={file.id}
                                            className='flex items-center py-2 px-3 gap-2.5 w-[181px] self-stretch hover:bg-[#F6F6F7] rounded cursor-pointer transition-all duration-200'
                                        >
                                            <FileIcon />
                                            <div className='flex items-center gap-1.5 flex-1'>
                                                <h3 className='text-regular-14'>{file.name}</h3>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex items-center py-2 px-3 gap-2.5 w-[181px] self-stretch text-gray-400'>
                                        <span className='text-regular-12'>No files in this folder</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PaperDocSidebar;