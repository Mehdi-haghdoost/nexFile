'use client';

import React from 'react';

const DeadlinePicker = ({ 
  selectedDate = '', 
  selectedTime = '', 
  onDateChange, 
  onTimeChange 
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className='flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full'>
      <div className='flex items-center gap-2'>
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className='text-medium-14 text-gray-900'>Set deadline for file uploads</h3>
      </div>
      
      <div className='flex gap-4'>
        {/* انتخاب تاریخ */}
        <div className='flex-1'>
          <label className='block text-regular-12 text-gray-600 mb-2'>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            min={today}
            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>
        
        {/* انتخاب زمان */}
        <div className='flex-1'>
          <label className='block text-regular-12 text-gray-600 mb-2'>Time</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>
      </div>
      
      {selectedDate && (
        <div className='flex items-center gap-2 p-2 bg-white rounded border'>
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className='text-regular-12 text-gray-700'>
            Deadline: {selectedDate} {selectedTime && `at ${selectedTime}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default DeadlinePicker;