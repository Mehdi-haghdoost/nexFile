'use client';

import React, { useState, useEffect } from 'react';

const DeadlinePicker = ({ 
  selectedDate = '', 
  selectedTime = '', 
  onDateChange, 
  onTimeChange 
}) => {
  // ✅ Fix: استفاده از useState + useEffect برای تاریخ امروز
  const [today, setToday] = useState('');

  useEffect(() => {
    // این فقط در کلاینت اجرا میشه، در سرور نمیاد
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <div className='flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-dark-border w-full'>
      <div className='flex items-center gap-2'>
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white'>Set deadline for file uploads</h3>
      </div>
      
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
        {/* انتخاب تاریخ */}
        <div className='flex-1 min-w-0'>
          <label className='block text-xs sm:text-sm text-gray-600 dark:text-neutral-300 mb-2'>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            min={today}
            className='w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>
        
        {/* انتخاب زمان */}
        <div className='flex-1 min-w-0'>
          <label className='block text-xs sm:text-sm text-gray-600 dark:text-neutral-300 mb-2'>Time</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className='w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>
      </div>
      
      {selectedDate && (
        <div className='flex items-center gap-2 p-2 bg-white dark:bg-neutral-700 rounded border border-gray-200 dark:border-neutral-600'>
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-200'>
            Deadline: {selectedDate} {selectedTime && `at ${selectedTime}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default DeadlinePicker;