import React from 'react';
import TextInput from '../inputs/TextInput';
import FolderSelector from '../inputs/FolderSelector';

const FormFields = ({ 
  title, description, setTitle, setDescription,
  folders, selectedFolder, onFolderSelect,
  isFoldersLoading, foldersError 
}) => (
  <div className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
    <TextInput 
      label='Title' 
      id='request-title' 
      value={title} 
      onChange={(e) => setTitle(e.target.value)}
      placeholder='Enter request title...'
      required
    />
    
    <TextInput 
      label='Description' 
      id='request-description' 
      isTextarea={true} 
      value={description} 
      onChange={(e) => setDescription(e.target.value)}
      placeholder='Enter request description...'
      required
    />
    
    {isFoldersLoading ? (
      <div className='flex items-center justify-center py-3 sm:py-4'>
        <div className='text-xs sm:text-sm text-gray-500 dark:text-neutral-400'>Loading folders...</div>
      </div>
    ) : foldersError ? (
      <div className='flex items-center justify-center py-3 sm:py-4'>
        <div className='text-xs sm:text-sm text-red-500 dark:text-red-400'>
          Error loading folders: {foldersError}
        </div>
      </div>
    ) : (
      <FolderSelector 
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={onFolderSelect}
      />
    )}
  </div>
);

export default FormFields;