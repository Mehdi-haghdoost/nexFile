import React from 'react'
import DropdownWrapper from './DropdownWrapper';
import DropdownItem from './DropdownItem';
import { createOptions, addOptions, modifyOptions } from '@/utils/constants/createDropdownConstants';
import useModalStore from '@/store/ui/modalStore';

const CreateDropdown = ({ onClose, isLast = false }) => {

  const { openModal } = useModalStore();

  const handleModalOpen = (modalType) => {
    console.log('🔥 handleModalOpen called with:', modalType);
    openModal(modalType)
    onClose();
  }

  return (
    <DropdownWrapper onClose={onClose} isLast={isLast}>
      {/* Header */}
      <button 
        className='flex items-start py-1 px-2 gap-2.5 self-stretch hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition-colors'
        onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.75073 3.75L14.25 14.2493" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
          <path d="M3.74997 14.2493L14.2493 3.75" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
        </svg>
      </button>

      {/* Create Section */}
      <div className='flex flex-col items-start gap-1 self-stretch'>
        <h3 className='text-xs font-normal text-neutral-500 dark:text-neutral-200 flex-1 h-[15px] truncate'>
          Create
        </h3>
        {createOptions.map((option, index) => (
          <DropdownItem
            key={index}
            icon={option.icon}
            title={option.title}
            hasSubmenu={option.hasSubmenu}
            submenuItems={option.submenuItems}
            onModalOpen={handleModalOpen}
            onClick={option.action}
          />
        ))}
      </div>

      <div className="w-full h-px bg-[#F2F2F3] dark:bg-neutral-700" />

      {/* Add Section */}
      <div className='flex flex-col items-start gap-1 self-stretch'>
        <h3 className='text-xs font-normal text-neutral-500 dark:text-neutral-200 flex-1 h-[15px] truncate'>
          Add
        </h3>
        {addOptions.map((option, index) => (
          <DropdownItem
            key={index}
            icon={option.icon}
            hasSubmenu={option.hasSubmenu}
            title={option.title}
            submenuItems={option.submenuItems}
            onClick={option.action}
          />
        ))}
      </div>

      <div className="w-full h-px bg-[#F2F2F3] dark:bg-neutral-700" />

      {/* Modify Section */}
      <div className='flex flex-col items-start gap-1 self-stretch'>
        <h3 className='text-xs font-normal text-neutral-500 dark:text-neutral-200 flex-1 h-[15px] truncate'>
          Modify
        </h3>
        {modifyOptions.map((option, index) => (
          <DropdownItem
            key={index}
            icon={option.icon}
            hasSubmenu={option.hasSubmenu}
            title={option.title}
            onClick={option.action}
          />
        ))}
      </div>
    </DropdownWrapper>
  )
}

export default CreateDropdown