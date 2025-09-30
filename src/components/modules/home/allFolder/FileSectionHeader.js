import { useFoldersStore } from '@/store/features/folders/foldersStore';

const FileSectionHeader = () => {
    const { getSelectedFolderData } = useFoldersStore();
    const selectedFolder = getSelectedFolderData();

    return (
        <div className='flex flex-col items-start gap-3 self-stretch'>
            <div className='flex justify-between items-center self-stretch'>
                {selectedFolder ? (
                    <div className='flex items-center gap-2'>
                        <h2 className='text-medium-18'>{selectedFolder.name}</h2>
                    </div>
                ) : (
                    <h2 className='text-medium-18'>Your file</h2>
                )}
                <div className='flex items-center -gap-1'>
                    <img src="/images/adrian.png" alt="adrian" />
                    <img src="/images/bella.png" alt="bella" />
                    <img src="/images/daniel.png" alt="daniel" />
                    <img src="/images/emily.png" alt="emily" />
                    <img src="/images/samuel.png" alt="samuel" />
                </div>
            </div>
            <div className='flex justify-between items-center self-stretch'>
                <div className='flex items-start gap-3'>
                    <button className='flex h-8 py-4 pr-4 pl-3 justify-center items-center gap-1.5 boxShadow-light bg-white rounded-lg border border-[#ECECEE]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15.1333 7.66667L13.8004 9L12.4666 7.66667M13.9634 8.66667C13.9876 8.44778 14 8.22534 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C9.88484 14 11.5667 13.1309 12.6667 11.7716M8 4.66667V8L10 9.33333" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className='text-medium-14 text-center'>Recent</h3>
                    </button>
                    <button className='flex h-8 py-4 pr-4 pl-3 justify-center items-center gap-1.5 boxShadow-light bg-white rounded-lg border border-[#ECECEE]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.52175 2.30217C7.6754 1.99088 7.75223 1.83523 7.85653 1.7855C7.94728 1.74224 8.0527 1.74224 8.14345 1.7855C8.24775 1.83523 8.32458 1.99088 8.47823 2.30217L9.93602 5.25548C9.98138 5.34738 10.0041 5.39333 10.0372 5.42901C10.0666 5.4606 10.1018 5.48619 10.1409 5.50437C10.185 5.52491 10.2357 5.53232 10.3371 5.54714L13.598 6.02376C13.9414 6.07395 14.113 6.09905 14.1925 6.18292C14.2616 6.25589 14.2941 6.35616 14.281 6.45581C14.2659 6.57035 14.1416 6.69141 13.893 6.93355L11.5343 9.23091C11.4608 9.30252 11.424 9.33833 11.4003 9.38093C11.3793 9.41866 11.3658 9.4601 11.3606 9.50296C11.3547 9.55137 11.3634 9.60196 11.3807 9.70312L11.9373 12.948C11.996 13.2903 12.0253 13.4614 11.9702 13.563C11.9222 13.6513 11.8369 13.7133 11.738 13.7316C11.6244 13.7527 11.4707 13.6719 11.1634 13.5102L8.24823 11.9772C8.1574 11.9294 8.11199 11.9055 8.06414 11.8961C8.02178 11.8878 7.9782 11.8878 7.93584 11.8961C7.888 11.9055 7.84258 11.9294 7.75175 11.9772L4.8366 13.5102C4.52926 13.6719 4.37559 13.7527 4.26196 13.7316C4.1631 13.7133 4.07779 13.6513 4.0298 13.563C3.97465 13.4614 4.004 13.2903 4.0627 12.948L4.61924 9.70312C4.63659 9.60196 4.64526 9.55137 4.63939 9.50296C4.6342 9.4601 4.62072 9.41866 4.59972 9.38093C4.57599 9.33833 4.53923 9.30252 4.4657 9.2309L2.10702 6.93355C1.85842 6.69141 1.73412 6.57035 1.719 6.45581C1.70584 6.35616 1.73835 6.25589 1.80748 6.18292C1.88694 6.09905 2.05863 6.07395 2.40201 6.02376L5.66285 5.54714C5.76426 5.53232 5.81497 5.52491 5.85912 5.50437C5.89822 5.48619 5.93342 5.4606 5.96277 5.42901C5.99592 5.39333 6.0186 5.34738 6.06396 5.25548L7.52175 2.30217Z" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className='text-medium-14 text-center'>Started</h3>
                    </button>
                </div>
                <div className='flex items-start gap-3'>
                    <button className='flex h-8 py-4 pr-4 pl-3 justify-center items-center gap-1.5 boxShadow-light bg-white rounded-lg border border-[#ECECEE]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2.25722 3.77791C1.75299 3.21437 1.50088 2.93259 1.49137 2.69312C1.48311 2.48509 1.57251 2.28515 1.73305 2.15259C1.91785 2 2.29595 2 3.05215 2H12.9474C13.7036 2 14.0817 2 14.2665 2.15259C14.4271 2.28515 14.5165 2.48509 14.5082 2.69312C14.4987 2.93259 14.2466 3.21437 13.7424 3.77791L9.9382 8.02962C9.83769 8.14196 9.78743 8.19813 9.7516 8.26205C9.71981 8.31875 9.69649 8.37978 9.68238 8.44323C9.66646 8.51476 9.66646 8.59013 9.66646 8.74087V12.3056C9.66646 12.436 9.66646 12.5011 9.64543 12.5575C9.62685 12.6073 9.59663 12.6519 9.55729 12.6877C9.51277 12.7281 9.45225 12.7524 9.3312 12.8008L7.06453 13.7074C6.8195 13.8054 6.69699 13.8545 6.59864 13.834C6.51263 13.8161 6.43716 13.765 6.38862 13.6918C6.33312 13.6081 6.33312 13.4762 6.33312 13.2122V8.74087C6.33312 8.59013 6.33312 8.51476 6.3172 8.44323C6.30309 8.37978 6.27977 8.31875 6.24798 8.26205C6.21215 8.19813 6.16189 8.14196 6.06138 8.02962L2.25722 3.77791Z" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className='text-medium-14 text-center'>Filter</h3>
                    </button>
                    <button className='flex h-8 w-45 py-4 pr-4 pl-3 justify-center items-center gap-1.5 boxShadow-light bg-white rounded-lg border border-[#ECECEE]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 14L11.6667 11.6667M13.3333 7.66667C13.3333 10.7963 10.7963 13.3333 7.66667 13.3333C4.53705 13.3333 2 10.7963 2 7.66667C2 4.53705 4.53705 2 7.66667 2C10.7963 2 13.3333 4.53705 13.3333 7.66667Z" stroke="#58585F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input type="text" className='text-regular-12-manrope flex-1 outline-0' placeholder='Search...' />
                    </button>
                    <div className='flex justify-center items-center h-8 p-0.5 gap-1 bg-stroke-100 rounded-lg border border-[#ECECEE]'>
                        <button className='flex py-[13px] px-[9px] justify-center items-center gap-1.5 self-stretch rounded-lg boxShadow-middle bg-white border border-[#F2F2F3]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2.33337 3.50004C2.33337 3.19062 2.45629 2.89388 2.67508 2.67508C2.89388 2.45629 3.19062 2.33337 3.50004 2.33337H10.5C10.8095 2.33337 11.1062 2.45629 11.325 2.67508C11.5438 2.89388 11.6667 3.19062 11.6667 3.50004V4.66671C11.6667 4.97613 11.5438 5.27287 11.325 5.49167C11.1062 5.71046 10.8095 5.83337 10.5 5.83337H3.50004C3.19062 5.83337 2.89388 5.71046 2.67508 5.49167C2.45629 5.27287 2.33337 4.97613 2.33337 4.66671V3.50004Z" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.33337 9.33337C2.33337 9.02396 2.45629 8.72721 2.67508 8.50842C2.89388 8.28962 3.19062 8.16671 3.50004 8.16671H10.5C10.8095 8.16671 11.1062 8.28962 11.325 8.50842C11.5438 8.72721 11.6667 9.02396 11.6667 9.33337V10.5C11.6667 10.8095 11.5438 11.1062 11.325 11.325C11.1062 11.5438 10.8095 11.6667 10.5 11.6667H3.50004C3.19062 11.6667 2.89388 11.5438 2.67508 11.325C2.45629 11.1062 2.33337 10.8095 2.33337 10.5V9.33337Z" stroke="#2E2E37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className='flex justify-center items-center gap-1 py-[13px] px-[9px] self-stretch rounded-[5px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2.33337 2.91671C2.33337 2.762 2.39483 2.61362 2.50423 2.50423C2.61362 2.39483 2.762 2.33337 2.91671 2.33337H5.25004C5.40475 2.33337 5.55312 2.39483 5.66252 2.50423C5.77192 2.61362 5.83337 2.762 5.83337 2.91671V5.25004C5.83337 5.40475 5.77192 5.55312 5.66252 5.66252C5.55312 5.77192 5.40475 5.83337 5.25004 5.83337H2.91671C2.762 5.83337 2.61362 5.77192 2.50423 5.66252C2.39483 5.55312 2.33337 5.40475 2.33337 5.25004V2.91671Z" stroke="#7A797F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.16671 2.91671C8.16671 2.762 8.22817 2.61362 8.33756 2.50423C8.44696 2.39483 8.59533 2.33337 8.75004 2.33337H11.0834C11.2381 2.33337 11.3865 2.39483 11.4959 2.50423C11.6053 2.61362 11.6667 2.762 11.6667 2.91671V5.25004C11.6667 5.40475 11.6053 5.55312 11.4959 5.66252C11.3865 5.77192 11.2381 5.83337 11.0834 5.83337H8.75004C8.59533 5.83337 8.44696 5.77192 8.33756 5.66252C8.22817 5.55312 8.16671 5.40475 8.16671 5.25004V2.91671Z" stroke="#7A797F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.33337 8.75004C2.33337 8.59533 2.39483 8.44696 2.50423 8.33756C2.61362 8.22817 2.762 8.16671 2.91671 8.16671H5.25004C5.40475 8.16671 5.55312 8.22817 5.66252 8.33756C5.77192 8.44696 5.83337 8.59533 5.83337 8.75004V11.0834C5.83337 11.2381 5.77192 11.3865 5.66252 11.4959C5.55312 11.6053 5.40475 11.6667 5.25004 11.6667H2.91671C2.762 11.6667 2.61362 11.6053 2.50423 11.4959C2.39483 11.3865 2.33337 11.2381 2.33337 11.0834V8.75004Z" stroke="#7A797F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.16671 8.75004C8.16671 8.59533 8.22817 8.44696 8.33756 8.33756C8.44696 8.22817 8.59533 8.16671 8.75004 8.16671H11.0834C11.2381 8.16671 11.3865 8.22817 11.4959 8.33756C11.6053 8.44696 11.6667 8.59533 11.6667 8.75004V11.0834C11.6667 11.2381 11.6053 11.3865 11.4959 11.4959C11.3865 11.6053 11.2381 11.6667 11.0834 11.6667H8.75004C8.59533 11.6667 8.44696 11.6053 8.33756 11.4959C8.22817 11.3865 8.16671 11.2381 8.16671 11.0834V8.75004Z" stroke="#7A797F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileSectionHeader;