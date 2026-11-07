import React, { useState } from 'react';
import Link from 'next/link';
import { FilesIcon, ViewIcon } from '@/components/ui/icons';
import FilterButton from '@/components/ui/FilterButton';
import useModalStore from '@/store/ui/modalStore';
import useMonitorSummary from '@/hooks/files/monitor/useMonitorSummary';
import { actionButtonsConfig } from '@/components/layouts/Home/actionButtonsConfig';
import FileTable from './FileTable';
import { MonitorSummaryCards } from './MonitorSummary';
import NeedsAttention from './NeedsAttention';

// The send action shared with the home action buttons, so its label, icon and modal live in one place
const SEND_ACTION = actionButtonsConfig['send-and-monitor'][0];

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
  const { summary, attention, totalTransfers, isLoading, error, refetch } = useMonitorSummary();

  // A parent may control the tab; otherwise the tab is local
  const currentFilter = activeTab ?? activeFilter;

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    onTabChange?.(filterType);
  };

  const openSend = () => openModal(SEND_ACTION.modal);

  // Only a confirmed zero shows the empty state, never a count that is still loading or failed
  const hasNoTransfers = totalTransfers === 0;

  return (
    <section className="flex flex-col flex-1 items-start gap-3 sm:gap-5 self-stretch w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Send and monitor</h2>

        {!hasNoTransfers && (
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Link
              href="/transfer"
              className="text-sm font-medium text-primary-500 dark:text-white whitespace-nowrap hover:underline"
            >
              View all transfers
            </Link>
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

          <FileTable filterType={currentFilter} totalTransfers={totalTransfers} />
        </>
      )}
    </section>
  );
};

export default SendAndMonitor;