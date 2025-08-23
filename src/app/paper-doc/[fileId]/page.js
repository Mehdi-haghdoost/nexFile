"use client";
import FolderItem from '@/components/modules/Modals/CreateFileModal/FolderItem';
import { CollapseSidebarIcon, FileIcon, HomeIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import Header from '@/components/layouts/Home/Header';

const PaperDocPage = () => {
    const { folders, isLoading } = useFolders();

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(1);


    const params = useParams();
    const fileId = params.fileId;

    //  آپدیت تابع برای باز و بسته کردن فولدر
    const handleFolderSelect = (folder) => {
        setSelectedFolder(folder);
        console.log("Selected folder:", folder);
        setOpenedFolderId(prevId => (prevId === folder.id ? null : folder.id));
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className='flex overflow-hidden'>
            {/* Sidebar */}
            <div className='flex flex-col items-start w-[267px] h-[1024px] p-6 gap-8 flex-shrink-0 bg-white border-l border-r border-[#F2F2F3]'>
                {/* Back to Home Section */}
                <div className='flex items-center h-[42px] gap-2 flex-shrink-0 self-stretch'>
                    <HomeIcon />
                    <h2 className='text-medium-16 flex-1'>Back to home</h2>
                    <CollapseSidebarIcon />
                </div>
                {/* Navbar */}
                <div className='flex flex-col items-start gap-1 self-stretch'>
                    {folders.map((folder) => (
                        <div>
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                isSelected={selectedFolder?.id === folder.id}
                                onSelect={handleFolderSelect}
                                showDivider={false}
                            />
                            {/*  نمایش لیست فایل های هر فولدر */}
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

            <div className='flex flex-col items-start h-[1024px] w-[1090px] flex-shrink-0'>
                <Header />
                {/* Main Content */}
                <div className='flex flex-col flex-1  items-start p-[120px] gap-4 bg-white self-stretch'>
                    <h2 className='text-semibold-36-neutral-300'>Give a Title</h2>
                     
                    <textarea 
                        placeholder='Type something'  
                        className='flex-1 w-full text-regular-16 resize-none outline-none border-none p-0 bg-transparent'
                    />
                </div>

            </div>
        </div>
    )
}

export default PaperDocPage