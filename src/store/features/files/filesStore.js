import { create } from 'zustand'

const useFilesStore = create((set, get) => ({
  // All Files State
  allFiles: [],
  deletedFiles: [
    {
      id: 1,
      name: 'Moodboard_Design_2024.jpg',
      type: 'photo',
      folder: 'Campaign Design',
      category: 'Picture',
      deletedTime: 'Today',
      size: '2.5 MB',
      deletedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Screen_Record_2024.mp4',
      type: 'video',
      folder: 'Campaign Design',
      category: 'Capture',
      deletedTime: '2 days ago',
      size: '45.8 MB',
      deletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      name: 'Project_Proposal_2024.pdf',
      type: 'document',
      folder: 'Documents',
      category: 'Files',
      deletedTime: '1 week ago',
      size: '1.2 MB',
      deletedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  sharedFiles: [],
  recentFiles: [],
  
  // Selection State
  selectedFiles: [],
  
  // UI State
  isLoading: false,
  error: null,
  viewMode: 'grid', // 'grid' | 'list'
  sortBy: 'name', // 'name' | 'date' | 'size'
  
  // File Operations
  fetchFiles: async () => {
    set({ isLoading: true })
    try {
      // TODO: API call
      // const response = await fetch('/api/files')
      // const data = await response.json()
      // set({ allFiles: data, isLoading: false })
      set({ isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchDeletedFiles: async () => {
    set({ isLoading: true })
    try {
      // TODO: API call
      // const response = await fetch('/api/files/deleted')
      // const data = await response.json()
      // set({ deletedFiles: data, isLoading: false })
      set({ isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  deleteFile: async (fileId) => {
    try {
      // TODO: API call
      // await fetch(`/api/files/${fileId}`, { method: 'DELETE' })
      
      const fileToDelete = get().allFiles.find(f => f.id === fileId)
      
      set((state) => ({
        allFiles: state.allFiles.filter(f => f.id !== fileId),
        deletedFiles: [...state.deletedFiles, { 
          ...fileToDelete, 
          deletedAt: new Date().toISOString(),
          deletedTime: 'Just now'
        }]
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  restoreFiles: async () => {
    const { selectedFiles, deletedFiles } = get()
    
    try {
      // TODO: API call
      // await fetch('/api/files/restore', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fileIds: selectedFiles })
      // })
      
      console.log('Restoring files:', selectedFiles)
      
      const filesToRestore = deletedFiles.filter(f => selectedFiles.includes(f.id))
      
      set((state) => ({
        deletedFiles: state.deletedFiles.filter(f => !selectedFiles.includes(f.id)),
        allFiles: [...state.allFiles, ...filesToRestore],
        selectedFiles: []
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  deletePermanent: async () => {
    const { selectedFiles } = get()
    
    try {
      // TODO: API call
      // await fetch('/api/files/delete-permanent', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fileIds: selectedFiles })
      // })
      
      console.log('Permanently deleting files:', selectedFiles)
      
      set((state) => ({
        deletedFiles: state.deletedFiles.filter(f => !selectedFiles.includes(f.id)),
        selectedFiles: []
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  // Selection Actions
  selectFile: (fileId) => set((state) => ({
    selectedFiles: state.selectedFiles.includes(fileId)
      ? state.selectedFiles.filter(id => id !== fileId)
      : [...state.selectedFiles, fileId]
  })),
  
  clearSelection: () => set({ selectedFiles: [] }),
  
  selectAll: (fileType = 'all') => set((state) => {
    const files = fileType === 'deleted' ? state.deletedFiles : state.allFiles
    return { selectedFiles: files.map(f => f.id) }
  }),
  
  // View Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sortBy) => set({ sortBy })
}))

export default useFilesStore