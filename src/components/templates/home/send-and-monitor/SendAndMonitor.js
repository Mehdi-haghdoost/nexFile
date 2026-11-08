import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FilesIcon, HistoryIcon, ViewIcon } from '@/components/ui/icons';
import FilterButton from '@/components/ui/FilterButton';
import useModalStore from '@/store/ui/modalStore';
import { showErrorToast } from '@/lib/toast';
import useMonitorSummary from '@/hooks/files/monitor/useMonitorSummary';
import { actionButtonsConfig } from '@/components/layouts/Home/actionButtonsConfig';
import FileTable from './FileTable';
import { MonitorSummaryCards } from './MonitorSummary';
import NeedsAttention from './NeedsAttention';

// The send action shared with the home action buttons, so its label, icon and modal live in one place
const SEND_ACTION = actionButtonsConfig['send-and-monitor'][0];

// Returning to the tab refreshes at most this often, like the transfer details page
const MIN_REFRESH_GAP = 30 * 1000;

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  // Ids match the tab names the activity API accepts
  const filters = [
    { id: 'activity', icon: <ViewIcon />, label: 'Activity' },
    { id: 'transfers', icon: <FilesIcon />, label: 'Transfers' }
  ];

  return (
    <div 
      className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-900 w-full sm:w-auto"
      role="tablist"
      aria-label="Content filter options"
    >
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          icon={filter.icon}
          label={filter.label}
          isActive={activeFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
          ariaLabel={`Show ${filter.label.toLowerCase()} content`}
        />
      ))}
    </div>
  );
};

// The send icon drawn white, for use on the filled primary button
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 [&>path]:stroke-white">
    {SEND_ACTION.icon}
  </svg>
);

const SendButton = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex shrink-0 items-center justify-center gap-2 h-9 px-4 rounded-lg bg-primary-500 text-sm font-medium text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition"
  >
    <SendIcon />
    {label}
  </button>
);

// Reloads the section in place; the label hides on mobile, where the accessible name still says what it does
const RefreshButton = ({ isRefreshing, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isRefreshing}
    aria-label={isRefreshing ? 'Refreshing' : 'Refresh'}
    title="Refresh"
    className="inline-flex shrink-0 items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {isRefreshing ? (
      <span aria-hidden="true" className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    ) : (
      <HistoryIcon />
    )}
    {/* The label stays put while the spinner shows progress, so nothing beside it shifts */}
    <span className="hidden sm:inline">Refresh</span>
  </button>
);

// Shown instead of the whole monitor until the first transfer exists
const FirstTransferState = ({ onSend }) => (
  <div className="flex flex-col items-center justify-center gap-3 w-full py-12 px-4 rounded-xl border border-dashed border-stroke-300 dark:border-neutral-700 text-center">
    <h3 className="text-base font-medium text-neutral-500 dark:text-white">No transfers yet</h3>
    <p className="max-w-sm text-sm text-neutral-400 dark:text-neutral-300">
      Send files by link or email, with an expiry date and an optional password. Views and downloads will show up here.
    </p>
    <SendButton label="Send your first transfer" onClick={onSend} />
  </div>
);

const SendAndMonitor = ({ activeTab, onTabChange }) => {
  const [activeFilter, setActiveFilter] = useState('activity');
  const openModal = useModalStore((state) => state.openModal);

  // One request feeds the cards, Needs attention, the empty state and the table's "View all" link
  const { summary, attention, totalTransfers, isLoading, error, refetch, refresh: refreshSummary } = useMonitorSummary();

  // A new token reloads the current tab's table quietly
  const [refreshToken, setRefreshToken] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // The refresh in progress, waiting for both the summary and the table to finish
  const pendingRefresh = useRef(null);
  const tokenCounter = useRef(0);
  const lastRefreshAt = useRef(Date.now());

  // A parent may control the tab; otherwise the tab is local
  const currentFilter = activeTab ?? activeFilter;

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    onTabChange?.(filterType);
  };

  const openSend = () => openModal(SEND_ACTION.modal);

  // Only a confirmed zero shows the empty state, never a count that is still loading or failed
  const hasNoTransfers = totalTransfers === 0;

  // Marks one half of a refresh done; once both are, a manual refresh reports how it went
  const finishPart = useCallback((token, part, ok) => {
    const pending = pendingRefresh.current;
    if (!pending || pending.token !== token) return;

    pending[part] = true;
    if (!ok) pending.failed = true;
    if (!pending.summary || !pending.table) return;

    pendingRefresh.current = null;
    setIsRefreshing(false);

    if (!pending.manual) return;
    if (pending.failed) showErrorToast('Could not refresh. Showing the last loaded data.');
    else setAnnouncement('Updated');
  }, []);

  // Quietly reloads the summary and the current tab together; a second request waits for the first
  const refreshSection = useCallback(({ manual = false } = {}) => {
    if (pendingRefresh.current) return;

    tokenCounter.current += 1;
    const token = tokenCounter.current;
    lastRefreshAt.current = Date.now();

    // With no table on screen there is only the summary to wait for
    pendingRefresh.current = { token, manual, summary: false, table: hasNoTransfers, failed: false };
    setIsRefreshing(true);
    setAnnouncement('');
    setRefreshToken(token);

    refreshSummary().then((ok) => finishPart(token, 'summary', ok !== false));
  }, [hasNoTransfers, refreshSummary, finishPart]);

  // Each finished table load answers the refresh it was started for
  const handleTableSettled = useCallback(({ token, ok }) => finishPart(token, 'table', ok), [finishPart]);

  // The table leaves the page when the last transfer is gone, so a refresh stops waiting for it
  useEffect(() => {
    if (hasNoTransfers && pendingRefresh.current) finishPart(pendingRefresh.current.token, 'table', true);
  }, [hasNoTransfers, finishPart]);

  // New views and downloads arrive while the page sits open, so returning to the tab refreshes them
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastRefreshAt.current < MIN_REFRESH_GAP) return;

      refreshSection();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshSection]);

  return (
    <section className="flex flex-col flex-1 items-start gap-3 sm:gap-5 self-stretch w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Send and monitor</h2>

        {!hasNoTransfers && (
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-3">
              <RefreshButton isRefreshing={isRefreshing} onClick={() => refreshSection({ manual: true })} />
              <Link
                href="/transfer"
                className="text-sm font-medium text-primary-500 dark:text-white whitespace-nowrap hover:underline"
              >
                View all transfers
              </Link>
            </div>
            <SendButton label={SEND_ACTION.title} onClick={openSend} />
          </div>
        )}
      </header>

      {hasNoTransfers ? (
        <FirstTransferState onSend={openSend} />
      ) : (
        <>
          {/* Headline numbers for all transfers, independent of the selected tab */}
          <MonitorSummaryCards summary={summary} isLoading={isLoading} error={error} onRetry={refetch} />

          <NeedsAttention attention={attention} onChanged={refetch} />

          <FilterTabs 
            activeFilter={currentFilter} 
            onFilterChange={handleFilterChange} 
          />

          <FileTable
            filterType={currentFilter}
            totalTransfers={totalTransfers}
            refreshToken={refreshToken}
            onRefreshSettled={handleTableSettled}
          />
        </>
      )}

      {/* Tells screen readers a manual refresh finished, since the content changes in place */}
      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
    </section>
  );
};

export default SendAndMonitor;