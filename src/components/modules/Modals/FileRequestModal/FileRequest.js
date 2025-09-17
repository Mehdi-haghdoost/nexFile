'use client';

import React from 'react'
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon, FolderIcon } from '@/components/ui/icons';

const FileRequest = () => {

  const { modals, closeModal } = useModalStore();
  const { isOpen, data } = modals.fileRequest;

  const handleClose = () => {
    closeModal('fileRequest');
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width='600px'>
      <div className='w-full'>
        <div className='flex flex-col justify-center items-start gap-12 p-6 flex-shrink-0 rounded-lg border border-neutral-50 bg-white'>
          {/* Form */}
          <form className='flex flex-col items-start gap-6 self-stretch'>
            {/* Form Header */}
            <div className='flex justify-between items-center self-stretch'>
              <h3 className='text-medium-18'>Create new request</h3>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                <CloseIcon />
              </button>
            </div>
            {/* Form Fields */}
            <div className='flex flex-col items-start gap-5 self-stretch'>
              <div className='flex flex-col items-start gap-4 self-stretch'>
                {/* Text field */}
                <div className='flex flex-col justify-center items-start gap-1 self-stretch'>
                  <label htmlFor="" className='text-regular-12-neutral-300'>Title</label>
                  <div className='flex gap-2 h-[48px] w-full py-3 px-4 rounded-lg border border-stroke-500 bg-white'>
                    <input
                      className='flex-1 text-regular-14-neutral-200 outline-0 gap-10'
                      type="text" name="" id="" />
                  </div>
                </div>

                {/* Text field */}
                <div className='flex flex-col justify-center items-start gap-1 self-stretch'>
                  <label htmlFor="" className='text-regular-12-neutral-300'>Description</label>
                  <div className='flex items-start flex-1 gap-2 h-[48px] w-full py-3 px-4 rounded-lg border border-stroke-500 bg-white'>
                    <textarea
                      className='flex-1 text-regular-14-neutral-200 outline-0 gap-10'
                      type="text" name="" id="" />
                  </div>
                </div>

                {/* Folder Upload Section */}
                <div className='flex flex-col items-start gap-2 self-stretch'>
                  <h4 className='text-regular-12-neutral-300'>Folder for file uploads</h4>
                  <div className='flex items-center justify-between gap-3 h-[52px] py-3 px-4 self-stretch rounded-lg border border-stroke-500 bg-white'>
                  <div className='flex items-center justify-between gap-3'>
                      <FolderIcon />
                    {/* Folder Info */}
                    <div className='flex items-center gap-2'>
                      <h3 className='text-medium-14'>Campaign Design</h3>
                      <h3 className='text-regular-14'>•</h3>
                      <h3 className='text-regular-14'>Ridwan T</h3>
                    </div>
                  </div>
                    <button 
                    className='text-right text-medium-12-primary'
                    >
                      Change folder
                    </button>
                  </div>
                </div>


              </div>
              <div className='flex justify-between items-center self-stretch'></div>
              <div className='flex justify-between items-center self-stretch'></div>
            </div>
          </form>
          {/* Form Footer */}
          <div className='flex justify-end items-start gap-3 self-stretch'>
            <button className='flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center'>
              Cancel
            </button>
            <button className='flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 bg-stroke-100 shadow-light text-medium-14-neutral-100 text-center'>
              Create
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default FileRequest

