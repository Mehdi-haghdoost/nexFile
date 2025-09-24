import React from 'react';
import TextInput from '../inputs/TextInput';
import FolderSelector from '../inputs/FolderSelector';

const FormFields = ({ 
  title, description, setTitle, setDescription,
  folders, selectedFolder, onFolderSelect,
  isFoldersLoading, foldersError 
}) => (
  <div className='flex flex-col items-start gap-4 self-stretch'>
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
      <div className='flex items-center justify-center py-4'>
        <div className='text-regular-14 text-gray-500'>Loading folders...</div>
      </div>
    ) : foldersError ? (
      <div className='flex items-center justify-center py-4'>
        <div className='text-regular-14 text-red-500'>
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