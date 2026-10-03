'use client'
import React, { useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal'
import useModalStore from '@/store/ui/modalStore'
import { useFilesStore } from '@/store'
import { api } from '@/lib/fetchWithAuth'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { AlertTriangleIcon, FolderIcon2, FilesIcon } from '@/components/ui/icons'

const DeletePermanentModal = () => {
  const { modals, closeModal } = useModalStore()
  const { permanentDeleteFiles } = useFilesStore()

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [stage, setStage] = useState(null)

  const isOpen = modals.deletePermanent?.isOpen || false
  const data = modals.deletePermanent?.data || null

  // Support both { items: [...] } (multi-select) and a single legacy item
  const items = data?.items || (data ? [data] : [])
  const isBusy = stage !== null

  // A folder takes everything inside it, which is the part worth warning about
  const folderCount = items.filter((item) => item.itemType === 'folder').length

  const handleClose = () => {
    if (isBusy) return

    setPassword('')
    setShowPassword(false)
    setError('')
    closeModal('deletePermanent')
  }

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    setError('')
    setStage('verifying')

    try {
      const verifyRes = await api.post('/api/auth/verify-password', { password })
      const verifyResult = await verifyRes.json()

      if (!verifyRes.ok || !verifyResult.success) {
        setError(verifyResult.message || 'Incorrect password')
        setStage(null)
        return
      }

      setStage('deleting')

      const result = await permanentDeleteFiles(items.map((item) => item.id))

      if (result?.deletedCount) {
        showSuccessToast(
          result.deletedCount > 1
            ? `${result.deletedCount} items permanently deleted`
            : 'Item permanently deleted'
        )
      }

      // Some can fail while others succeed, so both outcomes are reported
      if (result?.failedCount) {
        showErrorToast(result.error || 'Some items could not be deleted')
      }

      handleClose()
    } catch (err) {
      if (err.message !== 'Session expired') {
        showErrorToast(err.message || 'Failed to delete')
      }
    } finally {
      setStage(null)
    }
  }

  if (!items.length) return null

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width="480px">
      <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
        {/* Header */}
        <div className="flex items-start gap-3 self-stretch">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-400/10">
            <AlertTriangleIcon size={20} />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">
              Delete {items.length > 1 ? `${items.length} items` : 'this item'} for good?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400">
              This cannot be undone, and the stored files are removed permanently.
            </p>
          </div>
        </div>

        {/* Exactly what is being deleted, rather than metadata about one of them */}
        <div className="flex max-h-40 flex-col self-stretch overflow-y-auto custom-scrollbar rounded-lg border border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-2 border-b border-stroke-200 dark:border-neutral-700 last:border-0"
            >
              <span className="shrink-0">
                {item.itemType === 'folder' ? <FolderIcon2 /> : <FilesIcon />}
              </span>
              <span dir="auto" className="flex-1 min-w-0 truncate text-xs sm:text-sm text-neutral-500 dark:text-neutral-200">
                {item.name}
              </span>
              <span className="shrink-0 text-[11px] text-neutral-300 dark:text-neutral-400">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        {/* A folder's contents go with it, which the list above cannot show */}
        {folderCount > 0 && (
          <p className="self-stretch rounded-lg bg-error-400/10 px-3 py-2 text-xs text-error-400">
            {folderCount === 1 ? 'The folder' : `${folderCount} folders`} will take everything
            inside, at every level, including files not listed here.
          </p>
        )}

        {/* Password Input */}
        <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch">
          <label htmlFor="delete-password" className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            Enter your password to confirm
          </label>
          <div className="relative w-full">
            <input
              id="delete-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
              placeholder="Enter your password"
              disabled={isBusy}
              className="w-full h-9 sm:h-10 pl-3 pr-9 sm:pr-10 py-2 rounded-lg border border-stroke-300 dark:border-neutral-700 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-500 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
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
            <p className="text-xs text-error-400">{error}</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 self-stretch pt-2">
          <button
            onClick={handleClose}
            disabled={isBusy}
            className="w-full sm:w-auto flex items-center justify-center h-9 sm:h-10 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs sm:text-sm text-neutral-700 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isBusy || !password}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 px-4 rounded-lg border border-error-400 bg-gradient-to-b from-[#E95858] to-[#B63542] shadow-lg text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50"
          >
            {isBusy && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {stage === 'verifying' ? 'Verifying...' : stage === 'deleting' ? 'Deleting...' : 'Delete for good'}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default DeletePermanentModal