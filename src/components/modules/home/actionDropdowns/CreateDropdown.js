import React, { useState } from 'react'
import DropdownWrapper from './DropdownWrapper';
import DropdownItem from './DropdownItem';
import CreateFolderModal from '../../Modals/CreateFolderModal';
import useModalStore from '@/store/modalStore';

const CreateDropdown = ({ onClose, isLast = false }) => {

  const { openModal } = useModalStore();

  const handleModalOpen = (modalType) => {
    console.log('🔥 handleModalOpen called with:', modalType);
    openModal(modalType)
    onClose(); // این ایوینت برای بستن dropdown هستش
  }


  const createOptions = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M8.99988 14.7501H3.74988C3.35205 14.7501 2.97052 14.5921 2.68922 14.3108C2.40791 14.0295 2.24988 13.6479 2.24988 13.2501V5.00012C2.24988 4.6023 2.40791 4.22077 2.68922 3.93946C2.97052 3.65816 3.35205 3.50012 3.74988 3.50012H6.74988L8.99988 5.75012H14.2499C14.6477 5.75012 15.0292 5.90816 15.3105 6.18946C15.5918 6.47077 15.7499 6.8523 15.7499 7.25012V9.87512M11.9999 14.7501H16.4999M14.2499 12.5001V17.0001" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Folder',
      hasSubmenu: true,
      submenuItems: [
        {
          title: 'Folder',
          modal: 'createFolder'
        },
        {
          title: 'Automated folder',
          action: () => {
            console.log('Creating Automated folder');
            onClose();
          }
        },
      ]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M15.0001 8.375V5.6C15.0001 4.33988 15.0001 3.70982 14.7549 3.22852C14.5392 2.80516 14.195 2.46095 13.7716 2.24524C13.2903 2 12.6602 2 11.4001 2H6.60012C5.34 2 4.70994 2 4.22864 2.24524C3.80528 2.46095 3.46107 2.80516 3.24536 3.22852C3.00012 3.70982 3.00012 4.33988 3.00012 5.6V13.4C3.00012 14.6601 3.00012 15.2902 3.24536 15.7715C3.46107 16.1948 3.80528 16.5391 4.22864 16.7548C4.70994 17 5.34 17 6.60012 17H9.00012M13.5001 16.25V11.75M11.2501 14H15.7501" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Document',
      hasSubmenu: true,
      submenuItems: [
        {
          title: 'Folder',
          action: () => {
            console.log('Creating regular folder');
            onClose();
          }
        },
        {
          title: 'Automated folder',
          action: () => {
            console.log('Creating Automated folder');
            onClose();
          }
        },
      ]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M9 12.4999V16.2499M13.5 16.2499L10.5364 13.7802C9.98986 13.3248 9.71657 13.097 9.4115 13.01C9.14253 12.9333 8.85747 12.9333 8.5885 13.01C8.28343 13.097 8.01014 13.3248 7.46356 13.7802L4.5 16.2499M6 8.74988V9.49988M9 7.24988V9.49988M12 5.74988V9.49988M16.5 2.74988H1.5M2.25 2.74988H15.75V8.89988C15.75 10.16 15.75 10.7901 15.5048 11.2714C15.2891 11.6947 14.9448 12.0389 14.5215 12.2546C14.0402 12.4999 13.4101 12.4999 12.15 12.4999H5.85C4.58988 12.4999 3.95982 12.4999 3.47852 12.2546C3.05516 12.0389 2.71095 11.6947 2.49524 11.2714C2.25 10.7901 2.25 10.16 2.25 8.89988V2.74988Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Presentation',
      hasSubmenu: true,
      action: () => console.log('Creating Presentation'),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M2.24988 7.99988H15.7499M7.49988 2.74988V16.2499M2.24988 4.24988C2.24988 3.85205 2.40791 3.47052 2.68922 3.18922C2.97052 2.90791 3.35205 2.74988 3.74988 2.74988H14.2499C14.6477 2.74988 15.0292 2.90791 15.3105 3.18922C15.5918 3.47052 15.7499 3.85205 15.7499 4.24988V14.7499C15.7499 15.1477 15.5918 15.5292 15.3105 15.8105C15.0292 16.0918 14.6477 16.2499 14.2499 16.2499H3.74988C3.35205 16.2499 2.97052 16.0918 2.68922 15.8105C2.40791 15.5292 2.24988 15.1477 2.24988 14.7499V4.24988Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Spreadsheet',
      hasSubmenu: true,
      action: () => console.log('Creating Spreadsheet'),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M9 2C11.25 3.5 11.9421 6.71903 12 9.5C11.9421 12.281 11.25 15.5 9 17M9 2C6.75 3.5 6.05794 6.71903 6 9.5C6.05794 12.281 6.75 15.5 9 17M9 2C4.85786 2 1.5 5.35786 1.5 9.5M9 2C13.1421 2 16.5 5.35786 16.5 9.5M9 17C13.1421 17 16.5 13.6421 16.5 9.5M9 17C4.85787 17 1.5 13.6421 1.5 9.5M16.5 9.5C15 11.75 11.781 12.4421 9 12.5C6.21903 12.4421 3 11.75 1.5 9.5M16.5 9.5C15 7.25 11.781 6.55794 9 6.5C6.21903 6.55794 3 7.25 1.5 9.5" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Web shortcut',
      hasSubmenu: false,
      action: () => console.log('Creating Web shortcut'),
    },
  ]

  const addOptions = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M15.7499 11.7499V12.6499C15.7499 13.91 15.7499 14.5401 15.5046 15.0214C15.2889 15.4447 14.9447 15.7889 14.5214 16.0046C14.0401 16.2499 13.41 16.2499 12.1499 16.2499H5.84988C4.58976 16.2499 3.9597 16.2499 3.4784 16.0046C3.05503 15.7889 2.71083 15.4447 2.49511 15.0214C2.24988 14.5401 2.24988 13.91 2.24988 12.6499V11.7499M12.7499 6.49988L8.99988 2.74988M8.99988 2.74988L5.24988 6.49988M8.99988 2.74988V11.7499" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Upload',
      hasSubmenu: true,
      submenuItems: [
        {
          title: 'Folder',
          action: () => {
            console.log('Creating regular folder');
            onClose();
          }
        },
        {
          title: 'Automated folder',
          action: () => {
            console.log('Creating Automated folder');
            onClose();
          }
        },
      ]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M15.0001 9.875V5.6C15.0001 4.33988 15.0001 3.70982 14.7549 3.22852C14.5392 2.80516 14.195 2.46095 13.7716 2.24524C13.2903 2 12.6602 2 11.4001 2H6.60012C5.34 2 4.70994 2 4.22864 2.24524C3.80528 2.46095 3.46107 2.80516 3.24536 3.22852C3.00012 3.70982 3.00012 4.33988 3.00012 5.6V13.4C3.00012 14.6601 3.00012 15.2902 3.24536 15.7715C3.46107 16.1948 3.80528 16.5391 4.22864 16.7548C4.70994 17 5.33997 17 6.60002 17H9.37512M11.2501 14.75L13.5001 17M13.5001 17L15.7501 14.75M13.5001 17V12.5" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Send file request',
      hasSubmenu: true,
      action: () => console.log('Send file request'),
    },
  ];

  const modifyOptions = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M8.25 3.4998H5.1C3.83988 3.4998 3.20982 3.4998 2.72852 3.74504C2.30516 3.96076 1.96095 4.30496 1.74524 4.72833C1.5 5.20963 1.5 5.83969 1.5 7.0998V13.3998C1.5 14.6599 1.5 15.29 1.74524 15.7713C1.96095 16.1946 2.30516 16.5389 2.72852 16.7546C3.20982 16.9998 3.83988 16.9998 5.1 16.9998H11.4C12.6601 16.9998 13.2902 16.9998 13.7715 16.7546C14.1948 16.5389 14.5391 16.1946 14.7548 15.7713C15 15.29 15 14.6599 15 13.3998V10.2498M5.99998 12.4998H7.25589C7.62277 12.4998 7.80622 12.4998 7.97885 12.4584C8.1319 12.4216 8.27822 12.361 8.41243 12.2788C8.5638 12.186 8.69352 12.0563 8.95294 11.7969L16.125 4.62481C16.7463 4.00348 16.7463 2.99612 16.125 2.3748C15.5037 1.75348 14.4963 1.75348 13.875 2.3748L6.70293 9.54686C6.4435 9.80629 6.31378 9.936 6.22102 10.0874C6.13878 10.2216 6.07817 10.3679 6.04143 10.521C5.99998 10.6936 5.99998 10.877 5.99998 11.2439V12.4998Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Edit',
      hasSubmenu: true,
      action: () => console.log('Edit files'),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <path d="M2.24988 14.7499C4.74963 13.2499 5.99988 11.7499 5.99988 10.2499C5.99988 7.99988 5.24988 7.99988 4.49988 7.99988C3.74988 7.99988 2.97588 8.81363 2.99988 10.2499C3.02538 11.7859 4.24338 12.4076 4.87488 13.2499C5.99988 14.7499 6.74988 15.1249 7.49988 13.9999C8.00013 13.2499 8.37513 12.6251 8.62488 12.1249C9.37488 13.8746 10.3746 14.7499 11.6249 14.7499H13.4999M13.4999 14.7499L11.9999 13.2499V4.24988C11.9999 3.40913 12.6591 2.74988 13.4999 2.74988C14.3406 2.74988 14.9999 3.40913 14.9999 4.24988V13.2499L13.4999 14.7499ZM11.9999 5.74988H14.9999" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Sign',
      hasSubmenu: true,
      action: () => console.log('Sign document'),
    },
  ]

  return (
    <>

      <DropdownWrapper onClose={onClose} isLast={isLast}>
        {/* Header */}
        <button className='flex items-start py-1 px-2 gap-2.5 self-stretch'
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75073 3.75L14.25 14.2493" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.74997 14.2493L14.2493 3.75" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </button>
        {/* Create Section */}
        <div className='flex flex-col items-start gap-1 self-stretch'>
          <h3 className='text-regular-12 flex-1 h-[15px] truncate'>Create</h3>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="285" height="2" viewBox="0 0 285 2" fill="none">
          <path d="M0.00195312 1H284.998" stroke="#F2F2F3" strokeWidth="1.2" />
        </svg>

        {/* Add Section */}
        <div className='flex flex-col items-start gap-1 self-stretch'>
          <h3 className='text-regular-12 flex-1 h-[15px] truncate'>Add</h3>
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

        <svg xmlns="http://www.w3.org/2000/svg" width="285" height="2" viewBox="0 0 285 2" fill="none">
          <path d="M0.00195312 1H284.998" stroke="#F2F2F3" strokeWidth="1.2" />
        </svg>

        {/* Modify Section */}
        <div className='flex flex-col items-start gap-1 self-stretch'>
          <h3 className='text-regular-12 flex-1 h-[15px] truncate'>Modify</h3>
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
    </>

  )
}

export default CreateDropdown