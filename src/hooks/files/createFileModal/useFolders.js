import { useState, useEffect } from 'react';

export const useFolders = () => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);

    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/folders', {
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch folders');
            }

            const data = await response.json();
            
            if (data.success && data.folders) {
                setFolders(data.folders);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching folders:', err);
            setError(err.message);
            setFolders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const createFileInFolder = async (selectedFolder) => {
        if (!selectedFolder) {
            return {
                success: false,
                message: 'Please select a folder first'
            };
        }

        setIsCreatingFile(true);

        try {
            const response = await fetch('/api/files/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    folderId: selectedFolder.id,
                    name: 'Untitled Document',
                    type: 'document'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create file');
            }

            const result = await response.json();

            return {
                success: true,
                message: `File created successfully in ${selectedFolder.name}`,
                data: result
            };
        } catch (error) {
            console.error('Error creating file:', error);
            return {
                success: false,
                message: error.message || 'Failed to create file. Please try again.',
                error: error.message
            };
        } finally {
            setIsCreatingFile(false);
        }
    };

    const refreshFolders = () => {
        fetchFolders();
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    return {
        folders,
        isLoading,
        error,
        isCreatingFile,
        refreshFolders,
        createFileInFolder
    };
};