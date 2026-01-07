/**
 * Format time difference between now and given date
 * @param {Date|string} date - The date to compare
 * @returns {string} - Formatted time string (e.g., "2h ago", "3 days ago")
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Get appropriate image for file type
 * @param {string} mimeType - File MIME type
 * @param {string} url - File URL (Cloudinary/local)
 * @returns {string} - Image URL or placeholder
 */
export const getFileImage = (mimeType, url) => {
  if (!mimeType) return '/images/folder.png';

  if (mimeType.startsWith('image/')) {
    return url || '/images/folder.png';
  }

  if (mimeType.startsWith('video/')) {
    return '/images/video-placeholder.png';
  }

  if (mimeType.includes('pdf')) {
    return '/images/pdf-placeholder.png';
  }

  if (mimeType.includes('word') || mimeType.includes('document')) {
    return '/images/doc-placeholder.png';
  }

  return '/images/folder.png';
};