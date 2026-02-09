/**
 * Sort files and folders
 */
export const sortItems = (items, sortBy, sortOrder) => {
    if (!items || items.length === 0) return items;

    const sorted = [...items].sort((a, b) => {
        // Separate folders and files
        const aIsFolder = !a.mimeType;
        const bIsFolder = !b.mimeType;

        // If sorting by type, prioritize folders or files
        if (sortBy === 'type') {
            if (aIsFolder && !bIsFolder) return sortOrder === 'asc' ? -1 : 1;
            if (!aIsFolder && bIsFolder) return sortOrder === 'asc' ? 1 : -1;
            // If same type, sort by name
            return sortByName(a, b, sortOrder);
        }

        // For other sort types, keep folders and files together
        switch (sortBy) {
            case 'name':
                return sortByName(a, b, sortOrder);
            
            case 'date':
                return sortByDate(a, b, sortOrder);
            
            case 'size':
                return sortBySize(a, b, sortOrder);
            
            default:
                return 0;
        }
    });

    return sorted;
};

/**
 * Sort by name (case-insensitive)
 */
const sortByName = (a, b, sortOrder) => {
    const nameA = (a.displayName || a.originalName || a.name || '').toLowerCase();
    const nameB = (b.displayName || b.originalName || b.name || '').toLowerCase();

    if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
    } else {
        return nameB.localeCompare(nameA);
    }
};

/**
 * Sort by date (createdAt or updatedAt)
 */
const sortByDate = (a, b, sortOrder) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);

    if (sortOrder === 'asc') {
        return dateA - dateB; // Oldest first
    } else {
        return dateB - dateA; // Newest first
    }
};

/**
 * Sort by size
 */
const sortBySize = (a, b, sortOrder) => {
    const sizeA = a.size || a.totalSize || 0;
    const sizeB = b.size || b.totalSize || 0;

    if (sortOrder === 'asc') {
        return sizeA - sizeB; // Smallest first
    } else {
        return sizeB - sizeA; // Largest first
    }
};

/**
 * Get sort label for display
 */
export const getSortLabel = (sortBy, sortOrder) => {
    const labels = {
        name: sortOrder === 'asc' ? 'Name (A-Z)' : 'Name (Z-A)',
        date: sortOrder === 'asc' ? 'Date (Oldest)' : 'Date (Newest)',
        size: sortOrder === 'asc' ? 'Size (Smallest)' : 'Size (Largest)',
        type: sortOrder === 'asc' ? 'Folders First' : 'Files First',
    };

    return labels[sortBy] || 'Sort by';
};