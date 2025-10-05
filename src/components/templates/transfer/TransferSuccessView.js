import { CopyLinkIcon, CopyLinkWhiteIcon } from '@/components/ui/icons';

const TransferSuccessView = ({ shareLink, onBack, onManage }) => {

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleSendEmail = () => {
        console.log('Send email with link:', shareLink);
    };

    return (
        <div className='flex flex-col gap-8 animate-in fade-in-0 zoom-in-95 duration-500'>

            {/* Success Checkmark with Animation */}
            <div className='flex flex-col items-center gap-4 self-stretch'>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <div className="relative flex w-16 h-16 justify-center items-center rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-[0_8px_24px_0_rgba(76,60,198,0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" className='animate-in zoom-in-0 duration-700 delay-200'>
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <h3 className='text-medium-20 text-center'>Transfer Ready!</h3>
                    <p className='text-regular-14 text-gray-500'>Your files are prepared for sending</p>
                </div>
            </div>

            {/* Share Link Card */}
            <div className='flex flex-col gap-2 self-stretch'>
                <p className='text-regular-12 text-gray-600 px-1'>Share this link with anyone</p>
                <div className='relative group'>
                    <div className='flex items-center gap-3 p-4 rounded-xl border-2 border-stroke-200 bg-white transition-all duration-200 group-hover:border-primary-300 group-hover:shadow-[0_0_0_4px_rgba(76,60,198,0.1)]'>
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className='flex-1 bg-transparent outline-none text-regular-14 text-gray-700 truncate'
                        />
                        <button
                            onClick={handleCopyLink}
                            className='flex justify-center text-white items-center w-10 h-10 rounded-lg bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95'
                        >
                            <CopyLinkWhiteIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Cards Grid */}
            <div className='grid grid-cols-2 gap-3 self-stretch'>

                {/* Email Card */}
                <button
                    onClick={handleSendEmail}
                    className='group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-[#F8F7FF] to-white border border-primary-200 transition-all duration-300 hover:shadow-[0_12px_24px_0_rgba(76,60,198,0.15)] hover:scale-105 active:scale-100'
                >
                    <div className='flex justify-center items-center w-12 h-12 rounded-xl bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 5.83333L10 10.8333L17.5 5.83333M3.33333 15.8333H16.6667C17.1269 15.8333 17.5 15.4602 17.5 15V5C17.5 4.53976 17.1269 4.16667 16.6667 4.16667H3.33333C2.8731 4.16667 2.5 4.53976 2.5 5V15C2.5 15.4602 2.8731 15.8333 3.33333 15.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className='flex flex-col items-center gap-0.5'>
                        <span className='text-medium-14 text-gray-900'>Send Email</span>
                        <span className='text-regular-11 text-gray-500'>Share via email</span>
                    </div>
                </button>

                {/* Copy Link Card */}
                <button
                    onClick={handleCopyLink}
                    className='group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-stroke-200 transition-all duration-300 hover:border-primary-300 hover:shadow-lg hover:scale-105 active:scale-100'
                >
                    <div className='flex justify-center items-center w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary-100 transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M11.6667 8.33333L8.33333 11.6667M13.3333 5.83333L15.8333 8.33333C16.7538 9.25381 16.7538 10.7462 15.8333 11.6667L13.3333 14.1667C12.4128 15.0871 10.9205 15.0871 10 14.1667L7.5 11.6667C6.57953 10.7462 6.57953 9.25381 7.5 8.33333L10 5.83333C10.9205 4.91286 12.4128 4.91286 13.3333 5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='text-gray-600 group-hover:text-primary-600 transition-colors' />
                        </svg>
                    </div>
                    <div className='flex flex-col items-center gap-0.5'>
                        <span className='text-medium-14 text-gray-900'>Copy Link</span>
                        <span className='text-regular-11 text-gray-500'>Get shareable link</span>
                    </div>
                </button>

            </div>

            {/* Manage Button */}
            <button
                onClick={onManage}
                className='flex justify-center items-center gap-2 h-12 py-3 px-6 rounded-xl bg-gray-50 text-medium-14 text-gray-700 transition-all duration-200 hover:bg-gray-100 active:scale-98'
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.25 11.25C14.1267 11.5277 14.0908 11.8359 14.1469 12.1346C14.203 12.4334 14.3486 12.7085 14.565 12.9225L14.6175 12.975C14.7901 13.1474 14.9272 13.3523 15.0209 13.5779C15.1145 13.8035 15.1629 14.0453 15.1629 14.2894C15.1629 14.5334 15.1145 14.7753 15.0209 15.0009C14.9272 15.2265 14.7901 15.4314 14.6175 15.6038C14.4451 15.7763 14.2402 15.9135 14.0146 16.0071C13.789 16.1007 13.5472 16.1491 13.3031 16.1491C13.0591 16.1491 12.8172 16.1007 12.5916 16.0071C12.366 15.9135 12.1611 15.7763 11.9888 15.6038L11.9363 15.5513C11.7222 15.3348 11.4471 15.1892 11.1484 15.1332C10.8496 15.0771 10.5415 15.113 10.2638 15.2363C9.99061 15.3553 9.76106 15.5555 9.60733 15.8103C9.45359 16.065 9.37289 16.3627 9.37501 16.6663V16.875C9.37501 17.3723 9.17742 17.8492 8.82579 18.2008C8.47417 18.5525 7.99729 18.75 7.50001 18.75C7.00273 18.75 6.52585 18.5525 6.17423 18.2008C5.8226 17.8492 5.62501 17.3723 5.62501 16.875V16.7888C5.61803 16.4777 5.52667 16.1748 5.36064 15.9126C5.19461 15.6504 4.96035 15.4391 4.68376 15.3013C4.40599 15.178 4.09786 15.1421 3.79911 15.1982C3.50036 15.2542 3.22527 15.3999 3.01126 15.6163L2.95876 15.6688C2.78641 15.8413 2.5815 15.9784 2.35589 16.0721C2.13029 16.1657 1.88844 16.2141 1.64439 16.2141C1.40035 16.2141 1.1585 16.1657 0.932892 16.0721C0.707288 15.9784 0.502373 15.8413 0.330016 15.6688C0.157506 15.4964 0.0203613 15.2915 -0.0732727 15.0659C-0.166907 14.8403 -0.215332 14.5984 -0.215332 14.3544C-0.215332 14.1104 -0.166907 13.8685 -0.0732727 13.6429C0.0203613 13.4173 0.157506 13.2124 0.330016 13.04L0.382516 12.9875C0.59896 12.7735 0.744559 12.4984 0.800655 12.1996C0.856751 11.9009 0.820863 11.5927 0.697516 11.315C0.578522 11.0418 0.37839 10.8123 0.123608 10.6585C-0.131174 10.5048 -0.428887 10.4241 -0.732484 10.4263H-0.937484C-1.43476 10.4263 -1.91164 10.2287 -2.26327 9.87704C-2.61489 9.52542 -2.81248 9.04854 -2.81248 8.55126C-2.81248 8.05398 -2.61489 7.5771 -2.26327 7.22547C-1.91164 6.87385 -1.43476 6.67626 -0.937484 6.67626H-0.851234C-0.542246 6.66928 -0.239316 6.57792 0.0228652 6.41189C0.285047 6.24586 0.496356 6.0116 0.634141 5.73501C0.757488 5.45724 0.793377 5.14911 0.73728 4.85036C0.681184 4.5516 0.535586 4.27651 0.319141 4.06251L0.266641 4.01001C0.0941309 3.83765 -0.0430136 3.63274 -0.136648 3.40713C-0.230282 3.18153 -0.278707 2.93968 -0.278707 2.69563C-0.278707 2.45159 -0.230282 2.20974 -0.136648 1.98413C-0.0430136 1.75853 0.0941309 1.55361 0.266641 1.38126C0.438998 1.20875 0.643912 1.0716 0.869516 0.977969C1.09512 0.884335 1.33697 0.83591 1.58102 0.83591C1.82506 0.83591 2.06692 0.884335 2.29252 0.977969C2.51812 1.0716 2.72304 1.20875 2.89539 1.38126L2.94789 1.43376C3.1619 1.6502 3.43699 1.7958 3.73574 1.8519C4.03449 1.90799 4.34262 1.8721 4.62039 1.74876H4.68376C4.95697 1.62976 5.18652 1.42963 5.34025 1.17484C5.49399 0.920061 5.57469 0.622349 5.57251 0.318751V0.112501C5.57251 -0.384777 5.7701 -0.861659 6.12173 -1.21328C6.47335 -1.56491 6.95023 -1.7625 7.44751 -1.7625C7.94479 -1.7625 8.42167 -1.56491 8.77329 -1.21328C9.12492 -0.861659 9.32251 -0.384777 9.32251 0.112501V0.198751C9.32033 0.502349 9.40103 0.80006 9.55476 1.05484C9.7085 1.30963 9.93805 1.50976 10.2113 1.62876C10.489 1.7521 10.7971 1.78799 11.0959 1.7319C11.3946 1.6758 11.6697 1.5302 11.8838 1.31376L11.9363 1.26126C12.1086 1.08875 12.3135 0.951604 12.5391 0.85797C12.7647 0.764336 13.0066 0.71591 13.2506 0.71591C13.4947 0.71591 13.7365 0.764336 13.9621 0.85797C14.1877 0.951604 14.3927 1.08875 14.565 1.26126C14.7375 1.43361 14.8747 1.63853 14.9683 1.86413C15.0619 2.08974 15.1104 2.33159 15.1104 2.57563C15.1104 2.81968 15.0619 3.06153 14.9683 3.28713C14.8747 3.51274 14.7375 3.71765 14.565 3.89001L14.5125 3.94251C14.2961 4.15651 14.1505 4.4316 14.0944 4.73036C14.0383 5.02911 14.0742 5.33724 14.1975 5.61501V5.67838C14.3165 5.95159 14.5167 6.18113 14.7715 6.33487C15.0262 6.4886 15.324 6.5693 15.6275 6.56713H15.8338C16.331 6.56713 16.8079 6.76472 17.1595 7.11634C17.5112 7.46797 17.7088 7.94485 17.7088 8.44213C17.7088 8.93941 17.5112 9.41629 17.1595 9.76792C16.8079 10.1195 16.331 10.3171 15.8338 10.3171H15.7475C15.4439 10.3149 15.1462 10.3956 14.8915 10.5493C14.6367 10.7031 14.4366 10.9226 14.3175 11.1871V11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Manage transfer settings
            </button>

            {/* Back Link */}
            {onBack && (
                <div className='flex justify-center items-center gap-2 pt-2 border-t border-stroke-100'>
                    <button
                        onClick={onBack}
                        className='flex items-center gap-2 text-regular-13 text-gray-500 hover:text-primary-600 transition-colors group'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className='group-hover:-translate-x-1 transition-transform'>
                            <path d="M8.75 10.5L5.25 7L8.75 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to upload
                    </button>
                </div>
            )}

        </div>
    );
};

export default TransferSuccessView;