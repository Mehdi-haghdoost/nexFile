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

  const sortedData = useMemo(() => {git add src/hooks/useSorting.js
git commit -m "fix: improve date and time sorting logic in useSorting hook

- Add convertTimeToMinutes function to properly handle AM/PM time format
- Add convertDateToTimestamp function to handle DD/MM/YYYY date format
- Fix sorting accuracy for time values (02:30 PM vs 10:30 AM)
- Fix sorting accuracy for date values (22/12/2024 vs 18/12/2024)
- Convert time to minutes for easier comparison
- Convert date to timestamp for proper chronological sorting
- Add console logging to handleSort for debugging"
git push
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