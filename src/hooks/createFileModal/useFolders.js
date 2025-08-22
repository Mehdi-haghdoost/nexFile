import { useState, useEffect } from 'react';

// Static data for UI display
const STATIC_FOLDERS = [
    { id: 1, name: 'Campaign Design', path: 'Ridwan T./Campaign Design' },
    { id: 2, name: 'Illustrator Design', path: 'Ridwan T./Illustrator Design' },
    { id: 3, name: 'Canva Design', path: 'Ridwan T./Canva Design' },
    { id: 4, name: 'Figma Design', path: 'Ridwan T./Figma Design' },
    { id: 5, name: 'Canva Stock', path: 'Ridwan T./Canva Stock' },
];

export const useFolders = () => {
    const [folders, setFolders] = useState(STATIC_FOLDERS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    

    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/folders');

            if (!response.ok) {
                throw new Error(`Failed to fetch folders: ${response.status}`);
            }

            const data = await response.json();
            setFolders(data.folders || STATIC_FOLDERS);
        } catch (err) {
            console.error('Error fetching folders:', err);
            setError(err.message);

            // در صورت خطا، به داده‌های استاتیک برگردیم
            setFolders(STATIC_FOLDERS);
        } finally {
            setIsLoading(false);
        }
    };

    const createFileInFolder = async (selectedFolder) => {
        if (!selectedFolder) {
            throw new Error('Please select a folder first');
        }

        setIsCreatingFile(true);

        try {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderId: selectedFolder.id,
                    folderPath: selectedFolder.path,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create file: ${response.status}`);
            }

            const result = await response.json();
            console.log('File created successfully:', result);

            return {
                success: true,
                message: `File created successfully in ${selectedFolder.name}`,
                data: result
            };
        } catch (error) {
            console.error('Error creating file:', error);
            return {
                success: false,
                message: 'Failed to create file. Please try again.',
                error: error.message
            };
        } finally {
            setIsCreatingFile(false);
        }
    };

    const refreshFolders = () => {
        fetchFolders();
    };

    // فعلاً fetchFolders رو اجرا نمیکنم تا فقط داده‌های استاتیک نمایش داده بشن
    // useEffect(() => {
    //   fetchFolders();
    // }, []);

    return {
        folders,
        isLoading,
        error,
        isCreatingFile,
        refreshFolders,
        createFileInFolder
    };
};