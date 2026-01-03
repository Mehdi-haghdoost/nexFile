'use client'
import React, { useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal'
import useModalStore from '@/store/ui/modalStore'
import { useFilesStore } from '@/store'
import { useFolders } from '@/hooks/files/createFileModal/useFolders'

const DeletePermanentModal = () => {
  const { modals, closeModal } = useModalStore()
  const { deletePermanent } = useFilesStore()
  const { folders } = useFolders()
  
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const isOpen = modals.deletePermanent?.isOpen || false
  const fileData = modals.deletePermanent?.data || null

  const handleClose = () => {
    setPassword('')
    setShowPassword(false)
    setError('')
    closeModal('deletePermanent')
  }

  const handleDelete = () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    // TODO: در اینجا باید password را با API تایید کنید
    // فعلاً فرض می‌کنیم password صحیح است
    
    deletePermanent()
    handleClose()
  }

  // پیدا کردن Original location از folders
  const getOriginalLocation = () => {
    if (!fileData?.folder) return 'Unknown'
    
    const folder = folders.find(f => f.name === fileData.folder)
    if (folder) {
      return `${folder.path}/${fileData.category}`
    }
    return `${fileData.folder}/${fileData.category}`
  }

  // محاسبه File type
  const getFileType = () => {
    if (!fileData?.name) return 'Unknown'
    const extension = fileData.name.split('.').pop().toUpperCase()
    return extension
  }

  if (!fileData) return null

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width="480px">
      <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
        {/* Header */}
        <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch">
          <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">
            Permanently delete item?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            Are you sure you want to delete this item?
          </p>
        </div>

      {/* File Info */}
<div className="flex flex-col items-start gap-2 sm:gap-3 self-stretch p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-stroke-200 dark:border-neutral-700">
  <p className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate w-full">
    {fileData.name}
  </p>
  <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch">
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 shrink-0">File type:</span>
      <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">{getFileType()}</span>
    </div>
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 shrink-0">File size:</span>
      <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">{fileData.size || '50 MB'}</span>
    </div>
    <div className="flex items-start gap-2 w-full">
      <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 shrink-0 leading-tight">Original location:</span>
      <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 break-words leading-tight flex-1">{getOriginalLocation()}</span>
    </div>
  </div>
</div>

        {/* Password Input */}
        <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch">
          <label className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            Enter password to delete
          </label>
          <div className="relative w-full">
            <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="sm:w-4 sm:h-4">
                <path d="M11.3333 5.99996C11.3333 5.65874 11.2031 5.31753 10.9428 5.05719C10.6825 4.79684 10.3412 4.66667 10 4.66667M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 6.18245 6.01222 6.36205 6.03587 6.53802C6.07478 6.82745 6.09424 6.97217 6.08114 7.06373C6.0675 7.1591 6.05013 7.2105 6.00313 7.2946C5.958 7.37533 5.87847 7.45486 5.71942 7.61391L2.31242 11.0209C2.19712 11.1362 2.13947 11.1939 2.09824 11.2611C2.06169 11.3208 2.03475 11.3858 2.01842 11.4538C2 11.5306 2 11.6121 2 11.7752V12.9333C2 13.3067 2 13.4934 2.07266 13.636C2.13658 13.7614 2.23856 13.8634 2.36401 13.9273C2.50661 14 2.6933 14 3.06667 14H4.66667V12.6667H6V11.3333H7.33333L8.38609 10.2806C8.54514 10.1215 8.62467 10.042 8.7054 9.99687C8.7895 9.94987 8.8409 9.9325 8.93627 9.91886C9.02783 9.90576 9.17255 9.92522 9.46198 9.96413C9.63795 9.98778 9.81755 10 10 10Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter your password"
              className="w-full h-9 sm:h-10 pl-8 sm:pl-10 pr-9 sm:pr-10 py-2 rounded-lg border border-stroke-300 dark:border-neutral-700 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-500 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="sm:w-4 sm:h-4">
                  <path d="M2.00028 8C2.00028 8 4.00028 3.33333 8.00028 3.33333C12.0003 3.33333 14.0003 8 14.0003 8C14.0003 8 12.0003 12.6667 8.00028 12.6667C4.00028 12.6667 2.00028 8 2.00028 8Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
                  <path d="M8.00028 10C9.10485 10 10.0003 9.10457 10.0003 8C10.0003 6.89543 9.10485 6 8.00028 6C6.89571 6 6.00028 6.89543 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="sm:w-4 sm:h-4">
                  <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400"/>
                </svg>
              )}
            </button>
          </div>
          {error && (
            <div className='flex items-center gap-1'>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 self-stretch pt-2">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto flex items-center justify-center h-9 sm:h-10 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs sm:text-sm text-neutral-700 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto flex items-center justify-center h-9 sm:h-10 px-4 rounded-lg border border-error-400 bg-gradient-to-b from-[#E95858] to-[#B63542] shadow-lg text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default DeletePermanentModal;