'use client'

import { useState } from 'react'
import TransferHeader from '@/components/templates/transfer/TransferHeader'
import TransferFilterActions from '@/components/templates/transfer/TransferFilterActions'
import TransferTabs from '@/components/templates/transfer/TransferTabs'
import TransferEmptyState from '@/components/templates/transfer/TransferEmptyState'
import TransfersTable from '@/components/templates/transfer/TransfersTable'
import useTransferStore from '@/store/features/transfer/transferStore'

const TransferPage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [activeTransferTab, setActiveTransferTab] = useState('sent')
  
  const { transfers } = useTransferStore()

  const handleActionClick = (transferId) => {
    console.log('Action clicked for transfer:', transferId)
  }

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
              />

              {/* Sent/Received Tab Container */}
              <TransferTabs
                activeTransferTab={activeTransferTab}
                setActiveTransferTab={setActiveTransferTab}
              />

              {/* Conditional Rendering: Table or Empty State */}
              {transfers.length > 0 ? (
                <TransfersTable 
                  transfers={transfers}
                  onActionClick={handleActionClick}
                />
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