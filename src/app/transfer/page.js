'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import TransferHeader from '@/components/templates/transfer/TransferHeader'
import TransferFilterActions from '@/components/templates/transfer/TransferFilterActions'
import TransferTabs from '@/components/templates/transfer/TransferTabs'
import TransferEmptyState from '@/components/templates/transfer/TransferEmptyState'
import TransfersTable from '@/components/templates/transfer/TransfersTable'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTransfers } from '@/hooks/transfers/useTransfers'
import { copyTransferLink, openTransferLink } from '@/utils/transfers/transferLinkActions'

const TransferPage = () => {
  // Validates the session on mount and rotates the token before it expires
  useAuth()

  const router = useRouter()

  const [activeTab, setActiveTab] = useState('all')
  const [activeTransferTab, setActiveTransferTab] = useState('sent')
  const [search, setSearch] = useState('')

  const isReceived = activeTransferTab === 'received'

  const { transfers, isLoading, deletingId, deleteTransfer } = useTransfers({
    tab: activeTransferTab,
    status: activeTab,
    search,
  })

  const handleOpenDetails = useCallback((transfer) => {
    router.push(`/transfer/${transfer.id}`)
  }, [router])

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
            <div className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full overflow-x-hidden'>

              <TransferFilterActions
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                search={search}
                setSearch={setSearch}
              />

              <TransferTabs
                activeTransferTab={activeTransferTab}
                setActiveTransferTab={setActiveTransferTab}
              />

              {/* Loading, results, no matches, nothing received, or the first-run empty state */}
              {isLoading ? (
                <div className='flex flex-1 items-center justify-center self-stretch py-12'>
                  <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                </div>
              ) : transfers.length > 0 ? (
                <TransfersTable
                  transfers={transfers}
                  isReceived={isReceived}
                  onOpenDetails={handleOpenDetails}
                  onCopyLink={copyTransferLink}
                  onOpenLink={openTransferLink}
                  onDelete={deleteTransfer}
                  deletingId={deletingId}
                />
              ) : hasFilters ? (
                <div className='flex flex-1 items-center justify-center self-stretch py-12'>
                  <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                    No transfers match these filters
                  </p>
                </div>
              ) : isReceived ? (
                <div className='flex flex-1 flex-col items-center justify-center gap-1 self-stretch py-12 text-center'>
                  <p className='text-sm font-medium text-neutral-500 dark:text-white'>
                    Nothing has been sent to you yet
                  </p>
                  <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                    Transfers emailed to your address will appear here
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