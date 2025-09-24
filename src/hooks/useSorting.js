import { useState, useMemo, useCallback } from 'react';

const useSorting = (
  data, 
  initialSort = { key: 'name', direction: 'asc' }
) => {
  const [sortConfig, setSortConfig] = useState(initialSort);

  // تابع تبدیل زمان
  const convertTimeToMinutes = useCallback((timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;

    try {
      const trimmed = timeStr.trim();
      
      if (trimmed.includes('AM') || trimmed.includes('PM')) {
        const [time, period] = trimmed.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes)) return 0;
        
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) {
          hour24 = hours + 12;
        } else if (period === 'AM' && hours === 12) {
          hour24 = 0;
        }
        
        return hour24 * 60 + minutes;
      } 
      
      const [hours, minutes] = trimmed.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      
      return hours * 60 + minutes;
    } catch (error) {
      console.warn('Error parsing time:', timeStr, error);
      return 0;
    }
  }, []);

  // تابع تبدیل تاریخ
  const convertDateToTimestamp = useCallback((dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 0;

    try {
      const trimmed = dateStr.trim();
      
      if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return new Date(year, month - 1, day).getTime();
          }
        }
      }
      
      const date = new Date(trimmed);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    } catch (error) {
      console.warn('Error parsing date:', dateStr, error);
      return 0;
    }
  }, []);

  // مقایسه مقادیر
  const compareValues = useCallback((aValue, bValue, key) => {
    if (aValue === null || aValue === undefined) return bValue === null || bValue === undefined ? 0 : -1;
    if (bValue === null || bValue === undefined) return 1;

    // برای زمان
    if (key === 'time' || (typeof aValue === 'string' && (aValue.includes('AM') || aValue.includes('PM')))) {
      return convertTimeToMinutes(aValue) - convertTimeToMinutes(bValue);
    }
    
    // برای تاریخ
    if (key === 'created' || key === 'expiration' || key === 'date') {
      return convertDateToTimestamp(aValue) - convertDateToTimestamp(bValue);
    }
    
    // برای اعداد
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    }
    
    // برای رشته‌های عددی
    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    // برای رشته‌ها
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue, 'en-US', { 
        numeric: true, 
        sensitivity: 'base' 
      });
    }
    
    return String(aValue).localeCompare(String(bValue));
  }, [convertTimeToMinutes, convertDateToTimestamp]);

  // داده‌های sort شده
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!sortConfig.key) return [...data];

    try {
      const sorted = [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        const comparison = compareValues(aValue, bValue, sortConfig.key);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
      
      return sorted;
    } catch (error) {
      console.error('Error sorting data:', error);
      return [...data];
    }
  }, [data, sortConfig, compareValues]);

  // تابع sort
  const handleSort = useCallback((key) => {
    if (!key || typeof key !== 'string') return;

    setSortConfig(prevConfig => {
      const newDirection = 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc';
      
      return { key, direction: newDirection };
    });
  }, []);

  // reset sort
  const resetSort = useCallback(() => {
    setSortConfig(initialSort);
  }, [initialSort]);

  return {
    sortedData,
    sortConfig,
    handleSort,
    resetSort
  };
};

export default useSorting;