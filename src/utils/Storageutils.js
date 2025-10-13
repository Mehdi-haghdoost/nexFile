import { STORAGE_UNITS, STORAGE_MULTIPLIER } from '@/utils/constants/Dashboardconstants';

/**
 * Format bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted string (e.g., "1.5 GB")
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 bytes';
    if (bytes < 0) return 'Invalid size';

    const k = STORAGE_MULTIPLIER;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = Object.values(STORAGE_UNITS);

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${value} ${sizes[i]}`;
};

/**
 * Convert GB to bytes
 * @param {number} gb - Number of gigabytes
 * @returns {number} Number of bytes
 */
export const gbToBytes = (gb) => {
    return gb * Math.pow(STORAGE_MULTIPLIER, 3);
};

/**
 * Convert bytes to GB
 * @param {number} bytes - Number of bytes
 * @returns {number} Number of gigabytes
 */
export const bytesToGB = (bytes) => {
    return bytes / Math.pow(STORAGE_MULTIPLIER, 3);
};

/**
 * Calculate storage percentage
 * @param {number} usedBytes - Used storage in bytes
 * @param {number} totalGB - Total storage in GB
 * @returns {number} Percentage (0-100)
 */
export const calculateStoragePercentage = (usedBytes, totalGB) => {
    const totalBytes = gbToBytes(totalGB);
    if (totalBytes === 0) return 0;
    return Math.min((usedBytes / totalBytes) * 100, 100);
};

/**
 * Calculate remaining storage in GB
 * @param {number} usedBytes - Used storage in bytes
 * @param {number} totalGB - Total storage in GB
 * @returns {number} Remaining storage in GB
 */
export const calculateRemainingGB = (usedBytes, totalGB) => {
    const usedGB = bytesToGB(usedBytes);
    return Math.max(totalGB - usedGB, 0);
};

/**
 * Get storage status color based on usage percentage
 * @param {number} percentage - Usage percentage (0-100)
 * @returns {string} Color class name
 */
export const getStorageStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
};

/**
 * Check if storage is nearly full
 * @param {number} usedBytes - Used storage in bytes
 * @param {number} totalGB - Total storage in GB
 * @param {number} threshold - Warning threshold percentage (default: 90)
 * @returns {boolean} True if storage is above threshold
 */
export const isStorageNearlyFull = (usedBytes, totalGB, threshold = 90) => {
    const percentage = calculateStoragePercentage(usedBytes, totalGB);
    return percentage >= threshold;
};