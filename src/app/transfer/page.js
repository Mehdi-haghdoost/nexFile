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
    // اینجا می‌تونی منوی actions رو باز کنی
  }

  return (
    <div className='flex justify-center items-center bg-white'>
      <div className='flex flex-col items-start flex-shrink-0 border-t border-r border-l border-solid border-stroke-200 w-full'>

        {/* Header */}
        <TransferHeader />

        {/* Main Content */}
        <main className='flex-1 w-full'>
          <section
            aria-label="Transfer content"
            className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch border-t border-l border-stroke-200 bg-white'
          >
            {/* File Section */}
            <div className='flex flex-1 flex-col items-start gap-5 self-stretch'>

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