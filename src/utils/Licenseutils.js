/**
 * Calculate available licenses
 * @param {number} total - Total licenses
 * @param {number} used - Used licenses
 * @returns {number} Available licenses
 */
export const calculateAvailableLicenses = (total, used) => {
    return Math.max(total - used, 0);
};

/**
 * Calculate license usage percentage
 * @param {number} used - Used licenses
 * @param {number} total - Total licenses
 * @returns {number} Percentage (0-100)
 */
export const calculateLicensePercentage = (used, total) => {
    if (total === 0) return 0;
    return Math.min((used / total) * 100, 100);
};

/**
 * Check if licenses are nearly full
 * @param {number} used - Used licenses
 * @param {number} total - Total licenses
 * @param {number} threshold - Warning threshold percentage (default: 80)
 * @returns {boolean} True if licenses usage is above threshold
 */
export const isLicensesNearlyFull = (used, total, threshold = 80) => {
    const percentage = calculateLicensePercentage(used, total);
    return percentage >= threshold;
};

/**
 * Get license status message
 * @param {number} available - Available licenses
 * @returns {string} Status message
 */
export const getLicenseStatusMessage = (available) => {
    if (available === 0) return 'No licenses available';
    if (available === 1) return '1 license available';
    return `${available} licenses available`;
};

/**
 * Format license description
 * @param {number} used - Used licenses
 * @param {number} total - Total licenses
 * @param {string} planName - Plan name (default: 'Business Trial')
 * @returns {string} Formatted description
 */
export const formatLicenseDescription = (used, total, planName = 'Business Trial') => {
    return `Utilizing ${used} out of ${total} licenses on your ${planName}`;
};

/**
 * Validate license data
 * @param {number} used - Used licenses
 * @param {number} total - Total licenses
 * @returns {boolean} True if data is valid
 */
export const validateLicenseData = (used, total) => {
    return (
        typeof used === 'number' &&
        typeof total === 'number' &&
        used >= 0 &&
        total > 0 &&
        used <= total
    );
};

/**
 * Get license usage color based on percentage
 * @param {number} percentage - Usage percentage (0-100)
 * @returns {string} Color class name
 */
export const getLicenseUsageColor = (percentage) => {
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-green-500';
};