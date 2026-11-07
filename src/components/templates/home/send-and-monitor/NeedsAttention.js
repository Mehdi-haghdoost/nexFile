'use client';
import React, { useId, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { AlertTriangleIcon, ClockIcon, EyeOffIcon } from '@/components/ui/icons';
import { useResendTransferEmails } from '@/hooks/transfers/useResendTransferEmails';
import { copyTransferLink } from '@/utils/transfers/transferLinkActions';

// Relative time such as "in 2 days" or "3 days ago"; an unreadable date shows nothing
const formatRelative = (date) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '' : formatDistanceToNowStrict(parsed, { addSuffix: true });
};

// "1 recipient", "2 recipients"
const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// How each reason reads, with its icon and tint
const REASONS = {
  delivery_failed: {
    icon: <AlertTriangleIcon size={16} />,
    tint: 'bg-red-50 dark:bg-red-500/10',
    describe: (item) => `Email to ${pluralize(item.failedCount, 'recipient')} failed`,
  },
  expiring_soon: {
    icon: <ClockIcon size={16} />,
    tint: 'bg-amber-50 dark:bg-amber-500/10',
    describe: (item) => `Expires ${formatRelative(item.expiresAt)}`,
  },
  never_opened: {
    icon: <EyeOffIcon />,
    tint: 'bg-stroke-100 dark:bg-neutral-800',
    describe: (item) => `Not opened yet, sent ${formatRelative(item.createdAt)}`,
  },
};

// The transfer's details page, where extending and every other action live
const detailsHref = (id) => `/transfer/${encodeURIComponent(id)}`;

const ACTION_CLASS =
  'shrink-0 inline-flex items-center justify-center h-8 px-3 rounded-lg border border-stroke-200 dark:border-dark-border bg-white dark:bg-neutral-900 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed';

const NeedsAttention = ({ attention, onChanged }) => {
  const titleId = useId();
  const [retryingId, setRetryingId] = useState(null);
  const { retryDelivery, retryingTarget } = useResendTransferEmails();

  // Unknown reasons are skipped, so a newer server cannot break this list
  const items = (attention?.items || []).filter((item) => REASONS[item.reason]);

  // Nothing to act on, so the section is not shown at all
  if (!items.length) return null;

  const total = Math.max(attention?.total || 0, items.length);
  const notShown = total - items.length;

  // Retries the failed emails, then reloads the list so a fixed transfer drops off
  const handleRetry = async (item) => {
    setRetryingId(item.id);
    try {
      await retryDelivery({ id: item.id });
    } finally {
      setRetryingId(null);
      onChanged?.();
    }
  };

  // One action per reason: retry a failed email, copy an unopened link, or open the page to extend
  const renderAction = (item) => {
    if (item.reason === 'delivery_failed') {
      return (
        <button
          type='button'
          onClick={() => handleRetry(item)}
          disabled={Boolean(retryingTarget)}
          aria-label={`Retry email for ${item.name}`}
          className={ACTION_CLASS}
        >
          {retryingId === item.id ? 'Retrying...' : 'Retry'}
        </button>
      );
    }

    if (item.reason === 'never_opened') {
      return (
        <button
          type='button'
          onClick={() => copyTransferLink(item)}
          aria-label={`Copy link for ${item.name}`}
          className={ACTION_CLASS}
        >
          Copy link
        </button>
      );
    }

    return (
      <Link href={detailsHref(item.id)} aria-label={`Extend ${item.name}`} className={ACTION_CLASS}>
        Extend
      </Link>
    );
  };

  return (
    <section
      aria-labelledby={titleId}
      className='flex flex-col w-full rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
    >
      <header className='flex items-center justify-between gap-2 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700'>
        <h3 id={titleId} className='text-sm font-medium text-neutral-500 dark:text-white'>
          Needs attention
        </h3>
        <span className='text-xs text-neutral-400 dark:text-neutral-300'>{pluralize(total, 'transfer')}</span>
      </header>

      <ul className='flex flex-col divide-y divide-stroke-200 dark:divide-neutral-700'>
        {items.map((item) => {
          const reason = REASONS[item.reason];

          return (
            <li key={item.id} className='flex items-center gap-3 px-4 py-3'>
              <span
                aria-hidden='true'
                className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full ${reason.tint}`}
              >
                {reason.icon}
              </span>

              <div className='flex flex-col flex-1 min-w-0'>
                <Link
                  href={detailsHref(item.id)}
                  className='text-sm font-medium text-neutral-500 dark:text-white truncate hover:underline'
                >
                  {item.name}
                </Link>
                <span className='text-xs text-neutral-400 dark:text-neutral-300 truncate'>{reason.describe(item)}</span>
              </div>

              {renderAction(item)}
            </li>
          );
        })}
      </ul>

      {notShown > 0 && (
        <p className='px-4 py-2 text-xs text-neutral-400 dark:text-neutral-300 border-t border-stroke-200 dark:border-neutral-700'>
          {notShown} more not shown. The most urgent are listed first.
        </p>
      )}
    </section>
  );
};

export default NeedsAttention;