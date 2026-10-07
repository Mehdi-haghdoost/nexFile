'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RequestPasswordGate from '@/components/templates/request/RequestPasswordGate';
import RequestUploadForm from '@/components/templates/request/RequestUploadForm';
import { AlertTriangleIcon, CheckIcon, NexFileLogoIcon } from '@/components/ui/icons';
import { formatDate } from '@/utils/transfers/formatDates';

const PublicFileRequestPage = () => {
  const { token } = useParams();

  const [requestInfo, setRequestInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sentCount, setSentCount] = useState(0);

  // Plain fetch on purpose: a submitter has no session to refresh
  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/request/${token}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Request not found');
      }

      setRequestInfo(data.request);
      setIsUnlocked(Boolean(data.request.isUnlocked));
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const handleUnlock = async (password) => {
    setIsUnlocking(true);
    setUnlockError('');

    try {
      const response = await fetch(`/api/public/request/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not unlock this request');
      }

      setIsUnlocked(true);
    } catch (error) {
      setUnlockError(error.message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSubmit = async ({ submitterName, file }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('submitterName', submitterName);
      formData.append('file', file);

      const response = await fetch(`/api/public/request/${token}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send the file');
      }

      setSentCount((previous) => previous + 1);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deadlineNote =
    requestInfo?.hasDeadline && requestInfo.deadline
      ? `Open until ${formatDate(requestInfo.deadline)}`
      : null;

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4 py-10'>
      <div className='w-full max-w-md'>
        {/* Brand mark, since this page is seen by people with no account */}
        <div className='mb-6 flex items-center justify-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
            <NexFileLogoIcon />
          </div>
          <span className='text-base font-medium text-neutral-500 dark:text-white'>NexFile</span>
        </div>

        <div className='rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 sm:p-6 shadow-light dark:shadow-dark-panel'>
          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
            </div>
          ) : loadError ? (
            <div className='flex flex-col items-center gap-3 py-12 text-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-stroke-100 dark:bg-neutral-700'>
                <AlertTriangleIcon size={24} />
              </div>
              <h1 className='text-base font-medium text-neutral-500 dark:text-white'>
                Request not found
              </h1>
              <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                The link may be wrong, or the request may have been deleted.
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              {/* What is being asked for */}
              <div className='flex flex-col gap-1'>
                <h1 dir='auto' className='text-lg font-medium text-neutral-500 dark:text-white'>
                  {requestInfo.title}
                </h1>
                {requestInfo.description && (
                  <p dir='auto' className='text-sm text-neutral-300 dark:text-neutral-400 whitespace-pre-line'>
                    {requestInfo.description}
                  </p>
                )}
                {deadlineNote && !requestInfo.closedReason && (
                  <p className='text-xs text-neutral-300 dark:text-neutral-400'>{deadlineNote}</p>
                )}
              </div>

              {/* A closed or expired request accepts nothing, so no form is offered */}
              {requestInfo.closedReason ? (
                <p className='rounded-lg bg-error-400/10 px-3 py-3 text-sm text-error-400'>
                  {requestInfo.closedReason}
                </p>
              ) : !isUnlocked ? (
                <RequestPasswordGate
                  onUnlock={handleUnlock}
                  isUnlocking={isUnlocking}
                  error={unlockError}
                />
              ) : (
                <>
                  {/* Sending several files is normal, so the form stays after each one */}
                  {sentCount > 0 && (
                    <div className='flex items-center gap-2 rounded-lg bg-success-400/10 px-3 py-2.5'>
                      <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-500'>
                        <CheckIcon size={12} />
                      </span>
                      <p className='text-xs text-success-500 dark:text-success-400'>
                        {sentCount === 1 ? 'Your file was sent.' : `${sentCount} files sent.`} Add another below if you need to.
                      </p>
                    </div>
                  )}

                  {submitError && (
                    <p className='rounded-lg bg-error-400/10 px-3 py-2 text-xs text-error-400'>
                      {submitError}
                    </p>
                  )}

                  <RequestUploadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicFileRequestPage;