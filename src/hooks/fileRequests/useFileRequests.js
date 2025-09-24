// src/hooks/fileRequests/useFileRequests.js
import { useState, useEffect, useCallback } from 'react';
import useModalStore from '@/store/modalStore';
import useSorting from '@/hooks/useSorting';

// Mock data داخل همین فایل
const mockFiles = [
  { id: '1', name: 'Resume_2025.pdf', created: '2025/09/22', expiration: '2025/10/22', submitters: 3, uploads: 5, time: '10:30 AM' },
  { id: '2', name: 'Project-Brief.docx', created: '2025/09/21', expiration: '2025/10/21', submitters: 1, uploads: 1, time: '02:45 PM' },
  { id: '3', name: 'Marketing_Assets.zip', created: '2025/09/20', expiration: '2025/10/20', submitters: 5, uploads: 12, time: '09:00 AM' },
];

export const useFileRequests = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [rawData, setRawData] = useState([]);
  
  const { openModal } = useModalStore();
  
  const { sortedData: files, handleSort, sortConfig } = useSorting(
    rawData, 
    { key: 'name', direction: 'asc' }
  );

  // تابع دریافت داده‌ها
  const fetchFileRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // شبیه‌سازی API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // اعمال فیلتر روی داده‌های mock
      let filteredData = mockFiles;
      if (activeFilter !== 'All') {
        // منطق فیلتر (فعلاً همه رو نشان می‌ده)
        filteredData = mockFiles;
      }
      
      setRawData(filteredData);
    } catch (err) {
      console.error('Error fetching file requests:', err);
      setError(err);
      setRawData(mockFiles); // fallback
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // تابع درخواست جدید
  const handleNewRequest = useCallback(() => {
    openModal('fileRequest');
  }, [openModal]);

  // تابع اکشن
  const handleActionClick = useCallback((fileId) => {
    console.log(`Action clicked for file: ${fileId}`);
  }, []);

  // تابع تازه‌سازی
  const refetch = useCallback(() => {
    fetchFileRequests();
  }, [fetchFileRequests]);

  // اجرا هنگام تغییر فیلتر
  useEffect(() => {
    fetchFileRequests();
  }, [fetchFileRequests]);

  return {
    files,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    sortConfig,
    handleSort,
    handleNewRequest,
    handleActionClick,
    refetch
  };
};