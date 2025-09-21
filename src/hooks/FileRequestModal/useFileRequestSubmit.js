import { useState } from 'react';
import { prepareFileRequestData } from '@/utils/formScroll';

export const useFileRequestSubmit = (formData, onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = prepareFileRequestData(formData);
      console.log('Form Submitted!', requestData);
      
      // API call logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};