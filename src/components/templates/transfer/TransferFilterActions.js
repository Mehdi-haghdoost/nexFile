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
    <div className='flex justify-between items-center self-stretch'>
      {/* Filter Tabs */}
      <div className='flex justify-center items-center gap-0.5 h-8 rounded-lg bg-stroke-100 border border-stroke-300 dark:border-neutral-700 dark:bg-neutral-900'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
    flex justify-center items-center py-1 px-3.5 gap-1.5 rounded-lg
    transition-[border,box-shadow,transform,color] duration-300 ease-in-out
    ${activeTab === tab.id
                ? 'border border-stroke-200 bg-white shadow-light text-medium-14 dark:text-medium-14-white scale-100 dark:bg-dark-gradient dark:border-dark-border dark-shadow-dark-panel'
                : 'border border-transparent bg-transparent text-regular-14-neutral-500 dark:text-regular-14-white hover:bg-gray-50 scale-95 dark:hover:bg-transparent'
              }
  `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className='flex items-start gap-3'>
        {/* Search Input */}
        <div className='flex items-center gap-1.5 h-8 w-[180px] py-[13px] pr-4 pl-3 rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 shadow-light border border-stroke-200 transition-all duration-200 focus-within:border-[#5749BF]'>
          <div className='scale-125 transition-transform duration-200'>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className='flex-1 text-regular-12-manrope dark:text-regular-12-manrope-neutral-200 dark:shadow-light outline-none bg-transparent'
          />
        </div>

        {/* Custom Design Button */}
        <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3.5 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 dark:text-medium-14-white transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95 dark:shadow-dark-panel dark:bg-dark-gradient dark:border-dark-border transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'>
          Custom design
        </button>

        {/* Create Transfer Button */}
        <button
          onClick={handleCreateTransfer}
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3.5 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-medium-14-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'
        >
          Create transfer
        </button>
      </div>
    </div>
  )
}

export default TransferFilterActions