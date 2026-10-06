import { useState, useMemo, useCallback } from 'react';

// Sorts a list by one of its keys, handling the shapes the tables actually hold
const useSorting = (data, initialSort = { key: 'name', direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(initialSort);

  // Dates arrive as ISO strings, Date objects or timestamps depending on the caller
  const toTimestamp = useCallback((value) => {
    if (!value) return 0;

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }, []);

  const compareValues = useCallback((aValue, bValue, key) => {
    // Missing values sort to the end regardless of direction
    if (aValue == null) return bValue == null ? 0 : -1;
    if (bValue == null) return 1;

    // Any key naming a moment is compared as one
    if (/at$|date|time|created|updated|expiration/i.test(key)) {
      return toTimestamp(aValue) - toTimestamp(bValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    }

    // localeCompare with numeric ordering, so "file 2" precedes "file 10"
    return String(aValue).localeCompare(String(bValue), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }, [toTimestamp]);

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!sortConfig.key) return [...data];

    return [...data].sort((a, b) => {
      const comparison = compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.key);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, compareValues]);

  // Clicking the active column reverses it; any other column starts ascending
  const handleSort = useCallback((key) => {
    if (!key) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const resetSort = useCallback(() => setSortConfig(initialSort), [initialSort]);

  return { sortedData, sortConfig, handleSort, resetSort };
};

export default useSorting;