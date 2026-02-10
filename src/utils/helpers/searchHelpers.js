/**
 * Search files by name
 */
export const searchFiles = (files, query) => {
    if (!files || files.length === 0) return files;
    if (!query || query.trim() === '') return files;

    const searchTerm = query.toLowerCase().trim();

    return files.filter(file => {
        // Search in display name
        const displayName = (file.displayName || file.originalName || file.name || '').toLowerCase();
        
        // Search in original name
        const originalName = (file.originalName || file.name || '').toLowerCase();
        
        // Search in folder name
        const folderName = (file.folderName || '').toLowerCase();
        
        // Search in extension
        const extension = (file.extension || '').toLowerCase();

        return (
            displayName.includes(searchTerm) ||
            originalName.includes(searchTerm) ||
            folderName.includes(searchTerm) ||
            extension.includes(searchTerm)
        );
    });
};

/**
 * Highlight search term in text
 */
export const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-500/30">$1</mark>');
};