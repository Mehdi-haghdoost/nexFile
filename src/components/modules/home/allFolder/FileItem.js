import React from 'react'

const FileItem = ({
    name,
    sharedBy = "Current User",
    sharedByImage = "/images/adrian.png",
    fileSize,
    lastModified,
    isSelected = false,
    onSelect
}) => {
    return (
        <li className='flex items-center h-[52px] py-[13px] px-5 gap-2 self-stretch'>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={onSelect}
                            className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <ul className='flex items-center gap-3 flex-1'>
                            <li className='flex items-center w-[300px] h-10 py-0 px-3 gap-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9.75 5.25L8.91334 3.57669C8.67255 3.0951 8.55215 2.8543 8.37253 2.67837C8.21368 2.5228 8.02224 2.40448 7.81206 2.33198C7.57437 2.25 7.30516 2.25 6.76672 2.25H3.9C3.05992 2.25 2.63988 2.25 2.31901 2.41349C2.03677 2.5573 1.8073 2.78677 1.66349 3.06901C1.5 3.38988 1.5 3.80992 1.5 4.65V5.25M1.5 5.25H12.9C14.1601 5.25 14.7902 5.25 15.2715 5.49524C15.6948 5.71095 16.039 6.05516 16.2548 6.47852C16.5 6.95982 16.5 7.58988 16.5 8.85V12.15C16.5 13.4101 16.5 14.0402 16.2548 14.5215C16.039 14.9448 15.6948 15.289 15.2715 15.5048C14.7902 15.75 14.1601 15.75 12.9 15.75H5.1C3.83988 15.75 3.20982 15.75 2.72852 15.5048C2.30516 15.289 1.96095 14.9448 1.74524 14.5215C1.5 14.0402 1.5 13.4101 1.5 12.15V5.25Z" stroke="#FFCA28" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3 className='text-medium-14'> {name} </h3>
                            </li>
                            <li className='flex items-center flex-1 py-0 px-3 gap-2'>
                                <img src={sharedByImage} alt={sharedBy} className='w-6 h-6 rounded-3xl' />
                                <h3 className='text-medium-14'>{sharedBy}</h3>
                            </li>
                            <li className='flex items-center w-[129px] py-0 px-3 gap-2 self-stretch'>
                                <h3 className='text-medium-14'>{fileSize}</h3>
                            </li>
                            <li className='flex items-center w-[171px] py-0 px-3 gap-2'>
                                <h3 className='text-medium-14'>{lastModified}</h3>
                            </li>
                            <li className='flex items-center justify-center w-[52px] py-0 px-3 gap-2'>
                                <div className='flex items-center p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                        <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                        <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                        <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </li>
    )
}

export default FileItem