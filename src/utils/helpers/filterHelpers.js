/**
 * Filter files based on multiple filter criteria
 */
export const filterFiles = (files, filters) => {
    if (!files || files.length === 0) return files;

    const { showRecent, showStarred } = filters;

    // If no filters active, return all
    if (!showRecent && !showStarred) {
        return files;
    }

    let filtered = [...files];

    // Apply Recent filter
    if (showRecent) {
        filtered = getRecentFiles(filtered);
    }

    // Apply Starred filter
    if (showStarred) {
        filtered = getStarredFiles(filtered);
    }

    return filtered;
};

/**
 * Get recent files (updated in last 7 days)
 */
const getRecentFiles = (files) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return files.filter(file => {
        const updatedAt = new Date(file.updatedAt || file.createdAt);
        return updatedAt >= sevenDaysAgo;
    });
};

/**
 * Get starred files only
 */
const getStarredFiles = (files) => {
    return files.filter(file => file.isStarred === true);
};

/**
 * Get active filters label
 */
export const getActiveFiltersLabel = (filters) => {
    const { showRecent, showStarred } = filters;
    
    if (showRecent && showStarred) {
        return 'Recent & Starred';
    }
    if (showRecent) {
        return 'Recent Files';
    }
    if (showStarred) {
        return 'Starred Files';
    }
    return 'All Files';
};

/**
 * Get filter count
 */
export const getFilterCount = (files, filters) => {
    const filtered = filterFiles(files, filters);
    return filtered.length;
};