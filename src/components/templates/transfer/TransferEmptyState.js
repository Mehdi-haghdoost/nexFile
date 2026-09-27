import { TransferPlaneIcon } from '@/components/ui/icons'

const TransferEmptyState = () => {
  return (
    <div className='flex flex-1 flex-col justify-center items-center gap-4 py-4 px-7 self-stretch rounded-lg border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-full'>
      {/* Icon Container */}
      <div className='flex flex-col justify-center items-center gap-2 p-1 w-[72px] h-[72px] rounded-2xl border-2 border-dark-white-70 dark:bg-dark-neutral-gradient bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]'>
        <TransferPlaneIcon />
      </div>

      {/* Text Content */}
      <div className='flex flex-col items-center gap-2'>
        <h3 className='text-medium-16 m-0 dark:text-medium-16-white'>Available whenever you need</h3>
        <p className='text-regular-12 text-center text-gray-600 m-0 dark:text-regular-12-neutral-300'>
          Prepare your transfer, send it, and track it here
        </p>
      </div>
    </div>
  )
}

export default TransferEmptyState