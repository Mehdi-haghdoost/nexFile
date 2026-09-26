import { SearchIcon } from '@/components/ui/icons'
import useModalStore from '@/store/ui/modalStore'
import { TRANSFER_STATUS_TABS } from '@/utils/constants/transferConstants'

const TransferFilterActions = ({ activeTab, setActiveTab, search, setSearch }) => {
  const { openModal } = useModalStore();

  const handleCreateTransfer = () => {
    openModal('createTransfer');
  };

  return (
    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center self-stretch gap-3'>
      {/* Status filter */}
      <div className='flex justify-center items-center gap-0.5 h-8 rounded-lg bg-stroke-100 border border-stroke-300 dark:border-neutral-700 dark:bg-neutral-900 w-full lg:w-auto'>
        {TRANSFER_STATUS_TABS.map((tab) => (
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

      {/* Search and create */}
      <div className='flex items-start gap-2 w-full lg:w-auto'>
        <div className='flex items-center gap-1.5 h-8 flex-1 sm:flex-initial sm:w-[180px] lg:w-[220px] py-[13px] pr-3 pl-2 sm:pr-4 sm:pl-3 rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 shadow-light border border-stroke-200 transition-all duration-200 focus-within:border-[#5749BF]'>
          <div className='scale-110 sm:scale-125 transition-transform duration-200 shrink-0'>
            <SearchIcon />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className='flex-1 text-xs sm:text-regular-12-manrope dark:text-regular-12-manrope-neutral-200 dark:shadow-light outline-none bg-transparent min-w-0'
          />
        </div>

        {/* Full label on tablet and up, icon alone on mobile */}
        <button
          onClick={handleCreateTransfer}
          className='hidden sm:flex justify-center items-center gap-1.5 h-8 py-[13px] px-2.5 md:px-3.5 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-xs md:text-medium-14-white font-medium transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap'
        >
          Create transfer
        </button>

        <button
          onClick={handleCreateTransfer}
          aria-label='Create transfer'
          className='flex sm:hidden justify-center items-center h-8 w-8 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 shrink-0'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TransferFilterActions