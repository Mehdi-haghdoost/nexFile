import { SearchIcon } from '@/components/ui/icons'
import useModalStore from '@/store/ui/modalStore'

const TransferFilterActions = ({ activeTab, setActiveTab }) => {
  const { openModal } = useModalStore();

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' }
  ]

  const handleCreateTransfer = () => {
    openModal('createTransfer');
  };

  return (
    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center self-stretch gap-3'>
      {/* Filter Tabs */}
      <div className='flex justify-center items-center gap-0.5 h-8 rounded-lg bg-stroke-100 border border-stroke-300 dark:border-neutral-700 dark:bg-neutral-900 w-full lg:w-auto'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 lg:flex-initial flex justify-center items-center py-1 px-2 sm:px-3.5 gap-1.5 rounded-lg text-xs sm:text-sm
              transition-[border,box-shadow,transform,color] duration-300 ease-in-out
              ${activeTab === tab.id
                ? 'border border-stroke-200 bg-white shadow-light font-medium dark:text-medium-14-white scale-100 dark:bg-dark-gradient dark:border-dark-border dark-shadow-dark-panel'
                : 'border border-transparent bg-transparent text-neutral-500 dark:text-white hover:bg-gray-50 scale-95 dark:hover:bg-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className='flex items-start gap-2 w-full lg:w-auto'>
        {/* Search Input */}
        <div className='flex items-center gap-1.5 h-8 flex-1 sm:flex-initial sm:w-[140px] md:w-[160px] lg:w-[180px] py-[13px] pr-3 pl-2 sm:pr-4 sm:pl-3 rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 shadow-light border border-stroke-200 transition-all duration-200 focus-within:border-[#5749BF]'>
          <div className='scale-110 sm:scale-125 transition-transform duration-200 shrink-0'>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className='flex-1 text-xs sm:text-regular-12-manrope dark:text-regular-12-manrope-neutral-200 dark:shadow-light outline-none bg-transparent min-w-0'
          />
        </div>

        {/* Custom Design Button - Responsive */}
        {/* Desktop (1024px+): Full Text */}
        <button className='hidden lg:flex justify-center items-center gap-1.5 h-8 py-[13px] px-3.5 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 dark:text-medium-14-white transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95 dark:shadow-dark-panel dark:bg-dark-gradient dark:border-dark-border hover:scale-105 whitespace-nowrap'>
          Custom design
        </button>

        {/* Tablet (640-1024px): Icon + Short Text */}
        <button className='hidden sm:flex lg:hidden justify-center items-center gap-1.5 h-8 py-[13px] px-2.5 rounded-lg border border-stroke-300 bg-white shadow-light text-xs font-medium dark:text-white transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95 dark:shadow-dark-panel dark:bg-dark-gradient dark:border-dark-border hover:scale-105 whitespace-nowrap'>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M2.66667 2H6.66667L8.66667 4H13.3333C13.687 4 14.0261 4.14048 14.2761 4.39052C14.5262 4.64057 14.6667 4.97971 14.6667 5.33333V12C14.6667 12.3536 14.5262 12.6928 14.2761 12.9428C14.0261 13.1929 13.687 13.3333 13.3333 13.3333H2.66667C2.31304 13.3333 1.97391 13.1929 1.72386 12.9428C1.47381 12.6928 1.33333 12.3536 1.33333 12V3.33333C1.33333 2.97971 1.47381 2.64057 1.72386 2.39052C1.97391 2.14048 2.31304 2 2.66667 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Design
        </button>

        {/* Mobile (<640px): Icon Only */}
        <button className='flex sm:hidden justify-center items-center h-8 w-8 rounded-lg border border-stroke-300 bg-white shadow-light dark:shadow-dark-panel dark:bg-dark-gradient dark:border-dark-border transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 shrink-0'>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2.66667 2H6.66667L8.66667 4H13.3333C13.687 4 14.0261 4.14048 14.2761 4.39052C14.5262 4.64057 14.6667 4.97971 14.6667 5.33333V12C14.6667 12.3536 14.5262 12.6928 14.2761 12.9428C14.0261 13.1929 13.687 13.3333 13.3333 13.3333H2.66667C2.31304 13.3333 1.97391 13.1929 1.72386 12.9428C1.47381 12.6928 1.33333 12.3536 1.33333 12V3.33333C1.33333 2.97971 1.47381 2.64057 1.72386 2.39052C1.97391 2.14048 2.31304 2 2.66667 2Z" stroke="currentColor" className="stroke-neutral-500 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Create Transfer Button */}
        {/* Desktop & Tablet: Full Text */}
        <button
          onClick={handleCreateTransfer}
          className='hidden sm:flex justify-center items-center gap-1.5 h-8 py-[13px] px-2.5 md:px-3.5 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-xs md:text-medium-14-white font-medium transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap'
        >
          Create transfer
        </button>

        {/* Mobile: Icon + */}
        <button
          onClick={handleCreateTransfer}
          className='flex sm:hidden justify-center items-center h-8 w-8 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 shrink-0'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TransferFilterActions