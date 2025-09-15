import { useState, useMemo } from 'react';

const useSorting = (data, initialSort = { key: 'name', direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(initialSort);

  // تابع کمکی برای تبدیل time از PM/AM به 24-hour format
  const convertTimeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + minutes; // تبدیل به دقیقه برای مقایسه آسان‌تر
  };

  // تابع کمکی برای تبدیل date به timestamp
  const convertDateToTimestamp = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day).getTime();
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // برای تاریخ - تبدیل به timestamp
      if (sortConfig.key === 'date') {
        aValue = convertDateToTimestamp(aValue);
        bValue = convertDateToTimestamp(bValue);
      }
      
      // برای زمان - تبدیل به دقیقه
      if (sortConfig.key === 'time') {
        aValue = convertTimeToMinutes(aValue);
        bValue = convertTimeToMinutes(bValue);
      }

      // مقایسه بر اساس جهت sort
      if (sortConfig.direction === 'asc') {
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
      } else {
        if (typeof aValue === 'string') {
          return bValue.localeCompare(aValue);
        }
        return bValue - aValue;
      }
    });
    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    console.log('Sort changed to:', key, direction);
  };

  return { sortedData, sortConfig, handleSort };
};

export default useSorting;