'use client'

import { useCallback, useState } from 'react'
import TransferHeader from '@/components/templates/transfer/TransferHeader'
import TransferFilterActions from '@/components/templates/transfer/TransferFilterActions'
import TransferTabs from '@/components/templates/transfer/TransferTabs'
import TransferEmptyState from '@/components/templates/transfer/TransferEmptyState'
import TransfersTable from '@/components/templates/transfer/TransfersTable'
import { useTransfers } from '@/hooks/transfers/useTransfers'
import { copyTextToClipboard } from '@/utils/clipboard'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const TransferPage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [activeTransferTab, setActiveTransferTab] = useState('sent')
  const [search, setSearch] = useState('')

  const { transfers, isLoading, deletingId, deleteTransfer } = useTransfers({
    tab: activeTransferTab,
    status: activeTab,
    search,
  })

  // copyTextToClipboard returns false instead of throwing, so check before claiming success
  const handleCopyLink = useCallback(async (transfer) => {
    if (!transfer?.link) {
      showErrorToast('This transfer has no share link')
      return
    }

    const copied = await copyTextToClipboard(transfer.link)

    if (copied) {
      showSuccessToast('Link copied to clipboard')
    } else {
      showErrorToast('Could not copy the link')
    }
  }, [])

  const handleOpenLink = useCallback((transfer) => {
    if (!transfer?.link) {
      showErrorToast('This transfer has no share link')
      return
    }

    window.open(transfer.link, '_blank', 'noopener,noreferrer')
  }, [])

  // Tells apart an empty account from a filter that matched nothing
  const hasFilters = Boolean(search) || activeTab !== 'all'

  return (
    <div className='flex flex-col h-full bg-white dark:bg-neutral-900 overflow-x-hidden'>
      <div className='flex flex-col flex-1 border-t border-r border-l border-stroke-200 w-full dark:border-neutral-700'> 

        {/* Header */}
        <TransferHeader />

        {/* Main Content */}
        <main className='flex-1 w-full overflow-x-hidden overflow-y-auto custom-scrollbar'> 
          <section
            aria-label="Transfer content"
            className='flex h-full flex-col items-start gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-8 border-t border-l border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
          >
            {/* File Section */}
            <div className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full overflow-x-hidden'>

              {/* Filter and Actions Container */}
              <TransferFilterActions 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                search={search}
                setSearch={setSearch}
              />

              {/* Sent/Received Tab Container */}
              <TransferTabs
                activeTransferTab={activeTransferTab}
                setActiveTransferTab={setActiveTransferTab}
              />

              {/* Loading, results, no matches, or the first-run empty state */}
              {isLoading ? (
                <div className='flex flex-1 items-center justify-center self-stretch py-12'>
                  <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                </div>
              ) : transfers.length > 0 ? (
                <TransfersTable 
                  transfers={transfers}
                  onCopyLink={handleCopyLink}
                  onOpenLink={handleOpenLink}
                  onDelete={deleteTransfer}
                  deletingId={deletingId}
                />
              ) : hasFilters ? (
                <div className='flex flex-1 items-center justify-center self-stretch py-12'>
                  <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                    No transfers match these filters
                  </p>
                </div>
              ) : (
                <TransferEmptyState />
              )}

            </div>
          </section>
        </main>

      </div>
    </div>
  )
}

export default TransferPage