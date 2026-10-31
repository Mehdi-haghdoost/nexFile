'use client';
import React from 'react';
import useMonitorSummary from '@/hooks/files/monitor/useMonitorSummary';

// Thousands separators, so 1200 reads as 1,200
const numberFormat = new Intl.NumberFormat('en-US');

// A missing or invalid count shows as 0 rather than breaking the card
const formatCount = (value) => numberFormat.format(Number.isFinite(value) ? value : 0);

// The four cards, in display order, with a note where the definition is not obvious
const getCards = (summary) => {
  const days = summary?.windowDays || 7;
  const recent = `Last ${days} days`;

  return [
    { id: 'activeTransfers', label: 'Active transfers', value: summary?.activeTransfers, hint: 'Not expired or deleted' },
    { id: 'views', label: 'Views', value: summary?.views, hint: recent },
    { id: 'downloads', label: 'Downloads', value: summary?.downloads, hint: `${recent}, download all counts once` },
    { id: 'visitors', label: 'Visitors', value: summary?.visitors, hint: `${recent}, counted per transfer` },
  ];
};

const CARD_CLASS = 'flex flex-col gap-1 p-4 rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 min-w-0';

const MonitorSummary = () => {
  const { summary, isLoading, error, refetch } = useMonitorSummary();

  // Numbers already on screen stay while a refresh runs, so the cards do not flash
  const showSkeleton = isLoading && !summary;

  if (error && !summary) {
    return (
      <div
        role='alert'
        className='flex flex-wrap items-center justify-between gap-3 w-full p-4 rounded-xl border border-stroke-200 dark:border-neutral-700'
      >
        <span className='text-sm text-neutral-400 dark:text-neutral-300'>{error}</span>
        <button
          type='button'
          onClick={refetch}
          className='px-3 py-1 rounded-lg border border-stroke-200 dark:border-dark-border text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <dl
      aria-label='Transfer summary'
      aria-busy={isLoading}
      className='grid grid-cols-2 lg:grid-cols-4 gap-3 w-full'
    >
      {getCards(summary).map((card) => (
        <div key={card.id} className={CARD_CLASS}>
          <dt className='text-xs text-neutral-300 dark:text-neutral-400 truncate'>{card.label}</dt>
          <dd className='text-xl font-semibold text-neutral-500 dark:text-white'>
            {showSkeleton ? (
              <span
                data-testid='summary-skeleton'
                className='block h-7 w-12 rounded bg-stroke-100 dark:bg-neutral-800 animate-pulse'
              />
            ) : (
              formatCount(card.value)
            )}
          </dd>
          <dd className='text-[11px] text-neutral-300 dark:text-neutral-500'>{card.hint}</dd>
        </div>
      ))}
    </dl>
  );
};

export default MonitorSummary;