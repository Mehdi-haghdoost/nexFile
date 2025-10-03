const TransferEmptyState = () => {
  return (
    <div className='flex flex-1 flex-col justify-center items-center gap-4 py-4 px-7 self-stretch rounded-lg border-stroke-200 bg-white'>
      {/* Icon Container */}
      <div className='flex flex-col justify-center items-center gap-2 p-1 w-[72px] h-[72px] rounded-2xl border-2 border-[rgba(255,255,255,0.7)] bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]'>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="40" 
          height="41" 
          viewBox="0 0 40 41" 
          fill="none"
          aria-hidden="true"
        >
          <path 
            d="M20.0001 25.4991L15.0001 20.4991M20.0001 25.4991C22.3282 24.6137 24.5616 23.497 26.6667 22.1658M20.0001 25.4991V33.8324C20.0001 33.8324 25.0501 32.9158 26.6667 30.4991C28.4667 27.7991 26.6667 22.1658 26.6667 22.1658M15.0001 20.4991C15.887 18.1982 17.0038 15.9925 18.3334 13.9158C20.2754 10.8108 22.9795 8.25419 26.1884 6.48926C29.3974 4.72433 33.0045 3.80973 36.6667 3.83244C36.6667 8.36578 35.3667 16.3324 26.6667 22.1658M15.0001 20.4991H6.66675C6.66675 20.4991 7.58341 15.4491 10.0001 13.8324C12.7001 12.0324 18.3334 13.8324 18.3334 13.8324M7.50008 27.9991C5.00008 30.0991 4.16675 36.3324 4.16675 36.3324C4.16675 36.3324 10.4001 35.4991 12.5001 32.9991C13.6834 31.5991 13.6667 29.4491 12.3501 28.1491C11.7023 27.5308 10.8489 27.1735 9.95379 27.1458C9.05868 27.1181 8.18488 27.422 7.50008 27.9991Z" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      
      {/* Text Content */}
      <div className='flex flex-col items-center gap-2'>
        <h3 className='text-medium-16 m-0'>Available whenever you need</h3>
        <p className='text-regular-12 text-center text-gray-600 m-0'>
          Prepare your transfer, send it, and track it here
        </p>
      </div>
    </div>
  )
}

export default TransferEmptyState