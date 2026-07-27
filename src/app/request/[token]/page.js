'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const PublicFileRequestPage = () => {
  const { token } = useParams();

  const [requestInfo, setRequestInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submitterName, setSubmitterName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load the public request info on mount
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/public/request/${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Request not found');
        }
        setRequestInfo(data.request);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submitterName.trim()) {
      showErrorToast('Please enter your name');
      return;
    }
    if (!selectedFile) {
      showErrorToast('Please choose a file');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/public/request/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit');
      }

      setIsSubmitted(true);
      showSuccessToast('Submission recorded (test mode)');
    } catch (err) {
      showErrorToast(err.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900'>
        <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-50 dark:bg-neutral-900 px-4 text-center'>
        <h1 className='text-lg font-medium text-neutral-700 dark:text-white'>Link not found</h1>
        <p className='text-sm text-neutral-400'>{error}</p>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900 px-4 py-10'>
      <div className='w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl border border-stroke-200 dark:border-neutral-700 shadow-lg p-6 sm:p-8'>
        {/* Test-mode banner */}
        <div className='mb-5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3 py-2'>
          <p className='text-xs text-amber-700 dark:text-amber-400'>
            Test page — files aren&apos;t stored yet, this only demonstrates the flow.
          </p>
        </div>

        <h1 className='text-lg font-semibold text-neutral-800 dark:text-white mb-1'>
          {requestInfo.title}
        </h1>
        {requestInfo.description && (
          <p className='text-sm text-neutral-500 dark:text-neutral-300 mb-4'>
            {requestInfo.description}
          </p>
        )}

        {requestInfo.status === 'closed' ? (
          <div className='rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-3 text-sm text-red-600 dark:text-red-400'>
            This request is closed and no longer accepting files.
          </div>
        ) : isSubmitted ? (
          <div className='rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 px-3 py-3 text-sm text-green-700 dark:text-green-400'>
            Thanks! Your test submission was recorded.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                Your name
              </label>
              <input
                type='text'
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                placeholder='Jane Doe'
                className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
              />
            </div>

            <div>
              <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                File
              </label>
              <input
                type='file'
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className='w-full text-sm text-neutral-500 dark:text-neutral-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-600 dark:file:bg-primary-500/10 dark:file:text-primary-400'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='mt-2 h-10 rounded-lg bg-gradient-primary text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity'
            >
              {isSubmitting ? 'Submitting...' : 'Upload'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublicFileRequestPage;