import { useState, useMemo } from 'react';

const useSorting = (data, initialSort = { key: 'name', direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'date') {
        aValue = new Date(aValue.split('/').reverse().join('/'));
        bValue = new Date(bValue.split('/').reverse().join('/'));
      }
      
      if (sortConfig.key === 'time') {
        aValue = new Date('1970/01/01 ' + aValue);
        bValue = new Date('1970/01/01 ' + bValue);
      }

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
  };

  return { sortedData, sortConfig, handleSort };
};

export default useSorting;