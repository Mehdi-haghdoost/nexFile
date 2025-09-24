import { useState, useEffect, useCallback } from 'react';
import useModalStore from '@/store/modalStore';
import useSorting from '@/hooks/useSorting';
import { MOCK_FILES } from '@/components/templates/home/file-requests/constants/fileRequestConstants';

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
      let filteredData = MOCK_FILES;
      if (activeFilter !== 'All') {
        // منطق فیلتر (فعلاً همه رو نشان می‌ده)
        filteredData = MOCK_FILES;
      }
      
      setRawData(filteredData);
    } catch (err) {
      console.error('Error fetching file requests:', err);
      setError(err);
      setRawData(MOCK_FILES); // fallback
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
    // اینجا می‌تونید منوی اکشن رو باز کنید
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