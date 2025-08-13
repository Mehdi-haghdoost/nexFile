import FileItem from '@/components/modules/home/allFolder/FileItem';
import styles from './fileSection.module.css';
import { useState } from 'react';
import FileTableHeader from '@/components/modules/home/allFolder/FileTableHeader';
import FileSectionHeader from '@/components/modules/home/allFolder/FileSectionHeader';

const FileSection = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);


    // فعلاً استاتیک، بعداً از API میاد
    const totalFiles = 5;

    // یک فایل انتخاب بشه
    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId) // تو این شرط گفتم اگر یک فایل قبلا انتخاب شده ؟
                ? prev.filter(id => id !== fileId) // ❌   پس حذفش کن
                : [...prev.fileId] //✅   اگر قبلا انتخاب نشده اضافش کن
        );
    }

    const handleSelectAll = () => {
        const allFileIds = [1, 2, 3, 4, 5] // فعلاً استاتیک
        setSelectedFiles(prev =>
            prev.length === allFileIds.length  // همه انتخاب شدن؟
                ? [] // ❌  پس همه رو unselect کن
                : allFileIds // ✅ پس همه رو select کن
        );
    };

    const isAllSelected = selectedFiles.length === totalFiles;

    return (
        <div className='flex flex-col items-start gap-5 flex-1 self-stretch'>
            {/* file header */}
            <FileSectionHeader />
            {/* file list */}
            <div className='flex flex-col items-start flex-1 self-stretch rounded-lg border border-[#F2F2F3]'>
                {/* Header */}
                <FileTableHeader
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                />

                {/* Content */}
                <ul className='w-full'>
                    <FileItem
                        sharedBy="Adrian Carter"
                        sharedByImage="/images/adrian.png"
                        fileSize="250 MB"
                        lastModified="05/08/2025"
                        isSelected={selectedFiles.includes(1)}
                        onSelect={() => handleSelectFile(1)}
                    />
                     <FileItem
                        sharedBy="Adrian Carter"
                        sharedByImage="/images/adrian.png"
                        fileSize="250 MB"
                        lastModified="05/08/2025"
                        isSelected={selectedFiles.includes(1)}
                        onSelect={() => handleSelectFile(1)}
                    />
                     <FileItem
                        sharedBy="Adrian Carter"
                        sharedByImage="/images/adrian.png"
                        fileSize="250 MB"
                        lastModified="05/08/2025"
                        isSelected={selectedFiles.includes(1)}
                        onSelect={() => handleSelectFile(1)}
                    />
                     <FileItem
                        sharedBy="Adrian Carter"
                        sharedByImage="/images/adrian.png"
                        fileSize="250 MB"
                        lastModified="05/08/2025"
                        isSelected={selectedFiles.includes(1)}
                        onSelect={() => handleSelectFile(1)}
                    />
                     <FileItem
                        sharedBy="Adrian Carter"
                        sharedByImage="/images/adrian.png"
                        fileSize="250 MB"
                        lastModified="05/08/2025"
                        isSelected={selectedFiles.includes(1)}
                        onSelect={() => handleSelectFile(1)}
                    />
                </ul>
            </div>
        </div>
    )
}

export default FileSection