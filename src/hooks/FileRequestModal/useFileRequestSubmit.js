import { useState } from "react";
import { prepareFileRequestData } from '@/utils/formScroll'; // ← اضافه کردن import

export const useFileRequestSubmit = (formData, onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = prepareFileRequestData(formData);
      
      console.log('Form Submitted!', requestData); // موقتی برای تست
      
      // شبیه‌سازی تاخیر API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // شبیه‌سازی لینک تولید شده
      const mockLink = `https://www.NexFile.com/scl/fi/abc123/${encodeURIComponent(formData.title || 'FileRequest')}.paper?rlkey=mock123&st=test&dl=0`;
      
      // فراخوانی callback با لینک تولید شده
      onSuccess(mockLink);
      
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};