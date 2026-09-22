'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import TransferHeader from '@/components/templates/transfer/TransferHeader'
import TransferDetailsHero from '@/components/templates/transfer/details/TransferDetailsHero'
import TransferDetailsStats from '@/components/templates/transfer/details/TransferDetailsStats'
import TransferDetailsRecipients from '@/components/templates/transfer/details/TransferDetailsRecipients'
import TransferDetailsFiles from '@/components/templates/transfer/details/TransferDetailsFiles'
import { BackArrowIcon } from '@/components/ui/icons'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTransferDetails } from '@/hooks/transfers/useTransferDetails'
import { useDeleteTransfer } from '@/hooks/transfers/useDeleteTransfer'
import { useTransferExpiry } from '@/hooks/transfers/useTransferExpiry'
import { copyTransferLink, openTransferLink } from '@/utils/transfers/transferLinkActions'

const TransferDetailsPage = () => {
  // Validates the session on mount and rotates the token before it expires
  useAuth()

  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const { transfer, isLoading, isNotFound, error, updateTransfer } = useTransferDetails(id)

  // A deleted transfer has nothing left to show, so return to the list
  const handleDeleted = useCallback(() => {
    router.push('/transfer')
  }, [router])

  const { deleteTransfer, deletingId } = useDeleteTransfer({ onDeleted: handleDeleted })
  const { extendTransfer, endTransfer, pendingAction } = useTransferExpiry({ onUpdated: updateTransfer })

  return (
    <div className='flex flex-col h-full bg-white dark:bg-neutral-900 overflow-x-hidden'>
      <div className='flex flex-col flex-1 border-t border-r border-l border-stroke-200 w-full dark:border-neutral-700'>

        {/* Header */}
        <TransferHeader />

        {/* Main Content */}
        <main className='flex-1 w-full overflow-x-hidden overflow-y-auto custom-scrollbar'>
          <section
            aria-label="Transfer details"
            className='flex min-h-full flex-col items-start gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-8 border-t border-l border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
          >
            <Link
              href='/transfer'
              className='flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-500 dark:text-neutral-300 dark:hover:text-white transition-colors'
            >
              <BackArrowIcon />
              Back to transfers
            </Link>

            {isLoading ? (
              <div className='flex flex-1 items-center justify-center self-stretch py-16'>
                <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : isNotFound || error || !transfer ? (
              /* Missing, deleted, someone else's, or a failed request */
              <div className='flex flex-1 flex-col items-center justify-center gap-2 self-stretch py-16 text-center'>
                <h1 className='text-base font-medium text-neutral-500 dark:text-white'>
                  {isNotFound ? 'Transfer not found' : 'Could not load this transfer'}
                </h1>
                <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                  {isNotFound
                    ? 'It may have been deleted, or the link is wrong.'
                    : error}
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-4 md:gap-6 self-stretch w-full max-w-4xl'>
                <TransferDetailsHero
                  transfer={transfer}
                  onCopyLink={() => copyTransferLink(transfer)}
                  onOpenLink={() => openTransferLink(transfer)}
                  onExtend={(days) => extendTransfer(transfer, days)}
                  onEnd={() => endTransfer(transfer)}
                  onDelete={() => deleteTransfer(transfer)}
                  pendingAction={pendingAction}
                  isDeleting={deletingId === transfer.id}
                />

                <TransferDetailsStats transfer={transfer} />

                {/* Only email transfers have recipients to show */}
                {transfer.recipients?.length > 0 && (
                  <TransferDetailsRecipients
                    recipients={transfer.recipients}
                    message={transfer.message}
                  />
                )}

                <TransferDetailsFiles files={transfer.files} />
              </div>
            )}
          </section>
        </main>

      </div>
    </div>
  )
}

export default TransferDetailsPage