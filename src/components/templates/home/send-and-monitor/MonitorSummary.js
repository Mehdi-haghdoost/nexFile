'use client';
import React, { useState } from 'react';
import useMonitorSummary, { DEFAULT_SUMMARY_WINDOW } from '@/hooks/files/monitor/useMonitorSummary';

// The periods the toggle offers, matching what the summary API accepts
const WINDOW_OPTIONS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
];

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

// Chooses the period the views, downloads and visitors cards count; styled like the monitor's tabs
const SummaryWindowToggle = ({ windowDays, onChange }) => (
  <div
    role='group'
    aria-label='Summary period'
    className='flex items-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-900'
  >
    {WINDOW_OPTIONS.map((option) => {
      const isActive = option.days === windowDays;

      return (
        <button
          key={option.days}
          type='button'
          onClick={() => onChange(option.days)}
          aria-pressed={isActive}
          className={`flex shrink-0 items-center justify-center self-stretch py-1 px-3 rounded-lg text-[11px] sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap transition-[border,box-shadow,transform,color,opacity] duration-200 active:scale-95 ${
            isActive
              ? 'border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle'
              : 'border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800'
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

// Draws the cards from data the caller already loaded, so the section fetches the summary once
export const MonitorSummaryCards = ({ summary, isLoading, error, onRetry, windowDays, onWindowChange }) => {
  // Numbers already on screen stay while a refresh runs, so the cards do not flash
  const showSkeleton = isLoading && !summary;

  if (error && !summary) {
    return (
      <div
        role='alert'
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full p-4 rounded-xl border border-stroke-200 dark:border-neutral-700'
      >
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium text-neutral-700 dark:text-neutral-200'>
            Couldn't load your transfer summary
          </span>
          <span className='text-xs text-neutral-500 dark:text-neutral-400'>
            Something went wrong while loading your summary. Please try again.
          </span>
        </div>
        <button
          type='button'
          onClick={onRetry}
          className='self-start sm:self-auto px-3 py-2 rounded-lg border border-stroke-200 dark:border-dark-border text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
        >
          Try again
        </button>
      </div>
    );
  }

  // A failed switch leaves the previous period's figures up, so say which period they still show
  const isShowingOtherWindow = Boolean(error && summary && summary.windowDays && summary.windowDays !== windowDays);

  return (
    <div className='flex flex-col gap-3 w-full'>
      {/* The toggle shows only where the caller lets the period change */}
      {onWindowChange && (
        <div className='flex flex-wrap items-center justify-end gap-2 w-full'>
          {isShowingOtherWindow && (
            <p role='alert' className='text-xs text-neutral-400 dark:text-neutral-300'>
              Couldn't load the last {windowDays} days. Showing the last {summary.windowDays} days.{' '}
              <button type='button' onClick={onRetry} className='font-medium text-primary-500 dark:text-white hover:underline'>
                Try again
              </button>
            </p>
          )}
          <SummaryWindowToggle windowDays={windowDays} onChange={onWindowChange} />
        </div>
      )}

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
    </div>
  );
};

// Loads its own data and keeps its own period, for anywhere the cards are shown on their own
const MonitorSummary = () => {
  const [windowDays, setWindowDays] = useState(DEFAULT_SUMMARY_WINDOW);
  const { summary, isLoading, error, refetch } = useMonitorSummary(windowDays);

  return (
    <MonitorSummaryCards
      summary={summary}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      windowDays={windowDays}
      onWindowChange={setWindowDays}
    />
  );
};

export default MonitorSummary;