import { TRANSFER_TABS } from '@/utils/constants/transferConstants'

const TransferTabs = ({ activeTransferTab, setActiveTransferTab }) => {
    return (
        <div className='flex items-start gap-3 border-b border-stroke-300 dark:border-neutral-500'>
            {TRANSFER_TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTransferTab(tab.id)}
                    className={`
            flex justify-center items-center gap-2.5 pt-0 px-2 pb-2 transition-all duration-300
            ${activeTransferTab === tab.id
                            ? 'border-b-[1.5px] border-solid border-[#4C3CC6]'
                            : ''
                        }
          `}
                >
                    <h3 className={activeTransferTab === tab.id ? 'text-medium-14-primary-500' : 'text-regular-14'}>
                        {tab.label}
                    </h3>
                </button>
            ))}
        </div>
    )
}

export default TransferTabs;