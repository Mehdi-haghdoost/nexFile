'use client';

import React, { useState } from 'react';
import { calculatePasswordStrength, checkPasswordsMatch } from '@/utils/passwordUtils';

const PasswordInput = ({ 
  password = '', 
  confirmPassword = '', 
  onPasswordChange, 
  onConfirmPasswordChange, 
  showStrength = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);
  const passwordsDontMatch = confirmPassword && passwordsMatch === false;

  return (
    <div className='flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full dark:bg-neutral-800 dark:border-dark-border'>
      <div className='flex items-center gap-2'>
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 className='text-medium-14 text-gray-900 dark:text-medium-14-white'>Set password protection</h3>
      </div>

      {/* رمز عبور */}
      <div>
        <label className='block text-regular-12 text-gray-600 mb-2 dark:text-regular-12-white'>Password</label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange?.(e.target.value)}
            placeholder='Enter password...'
            className='w-full h-10 px-3 py-2 pr-10 border border-gray-300 dark:bg-transparent dark:border-dark-border dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* نمایش قدرت رمز عبور */}
        {showStrength && password && (
          <div className='mt-2'>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-200 rounded-full h-1'>
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? 'bg-red-500' : 
                    passwordStrength.score <= 3 ? 'bg-yellow-500' : 
                    passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs ${passwordStrength.color}`}>
                {passwordStrength.text}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* تأیید رمز عبور */}
      <div>
        <label className='block text-regular-12 text-gray-600 mb-2 dark:text-regular-12-white'>Confirm Password</label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            placeholder='Confirm password...'
            className={`w-full h-10 px-3 py-2 pr-10 border rounded-lg dark:text-white dark:bg-transparent dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              passwordsDontMatch ? 'border-red-300 bg-red-50' : 
              passwordsMatch === true ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* پیام‌های validation */}
        {passwordsDontMatch && (
          <div className='flex items-center gap-1 mt-1'>
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className='text-xs text-red-500'>Passwords do not match</span>
          </div>
        )}

        {passwordsMatch === true && (
          <div className='flex items-center gap-1 mt-1'>
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className='text-xs text-green-500'>Passwords match</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;