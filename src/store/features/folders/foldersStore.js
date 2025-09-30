import { create } from 'zustand';

const foldersData = [
    {
        id: 1,
        name: 'Wireframes',
        files: [
            { id: 1, name: 'Homepage Wireframe.fig', size: '2.5 MB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 2, name: 'Mobile App Wireframe.fig', size: '1.8 MB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 3, name: 'Dashboard Wireframe.fig', size: '3.2 MB', lastModified: '03/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 4, name: 'User Flow Diagram.fig', size: '1.5 MB', lastModified: '02/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 2,
        name: 'Prototype',
        files: [
            { id: 5, name: 'Interactive Prototype v1.fig', size: '5.4 MB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 6, name: 'Interactive Prototype v2.fig', size: '6.1 MB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 7, name: 'Mobile Prototype.fig', size: '4.2 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 3,
        name: 'User Research',
        files: [
            { id: 8, name: 'User Interview Notes.docx', size: '250 KB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 9, name: 'Survey Results.xlsx', size: '450 KB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 10, name: 'Persona Document.pdf', size: '1.2 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 11, name: 'User Journey Map.fig', size: '2.8 MB', lastModified: '02/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 4,
        name: 'Inspiration',
        files: [
            { id: 12, name: 'Design References.pdf', size: '8.5 MB', lastModified: '05/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 13, name: 'Competitor Analysis.docx', size: '350 KB', lastModified: '04/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 14, name: 'Mood Board.fig', size: '12.4 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 15, name: 'Color Palette Ideas.fig', size: '850 KB', lastModified: '02/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 5,
        name: 'Final Design',
        files: [
            { id: 16, name: 'Final UI Design.fig', size: '15.2 MB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 17, name: 'Desktop Version.fig', size: '8.7 MB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 18, name: 'Mobile Version.fig', size: '6.3 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 19, name: 'Tablet Version.fig', size: '7.1 MB', lastModified: '02/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 6,
        name: 'Mockup',
        files: [
            { id: 20, name: 'Mobile Mockup.psd', size: '45.6 MB', lastModified: '05/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 21, name: 'Desktop Mockup.psd', size: '52.3 MB', lastModified: '04/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 22, name: 'Presentation Mockup.fig', size: '8.9 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 7,
        name: 'Design System',
        files: [
            { id: 23, name: 'Component Library.fig', size: '18.4 MB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 24, name: 'Design Tokens.json', size: '45 KB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 25, name: 'Icon Set.fig', size: '3.7 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 26, name: 'Typography Guidelines.pdf', size: '1.8 MB', lastModified: '02/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 8,
        name: 'Assets',
        files: [
            { id: 27, name: 'Logo Files.zip', size: '12.3 MB', lastModified: '05/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 28, name: 'Images.zip', size: '125.6 MB', lastModified: '04/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 29, name: 'Icons.svg', size: '2.4 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 30, name: 'Illustrations.fig', size: '24.7 MB', lastModified: '02/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 9,
        name: 'Usability Testing',
        files: [
            { id: 31, name: 'Test Plan.docx', size: '180 KB', lastModified: '05/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 32, name: 'Test Results.xlsx', size: '520 KB', lastModified: '04/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 33, name: 'User Feedback.pdf', size: '2.1 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 34, name: 'Improvements List.docx', size: '250 KB', lastModified: '02/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' }
        ]
    },
    {
        id: 10,
        name: 'Documentation',
        files: [
            { id: 35, name: 'Project Brief.pdf', size: '1.5 MB', lastModified: '05/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' },
            { id: 36, name: 'Style Guide.pdf', size: '4.2 MB', lastModified: '04/08/2025', sharedBy: 'Adrian Carter', sharedByImage: '/images/adrian.png' },
            { id: 37, name: 'Handoff Documentation.pdf', size: '3.8 MB', lastModified: '03/08/2025', sharedBy: 'Mike Brown', sharedByImage: '/images/adrian.png' },
            { id: 38, name: 'Meeting Notes.docx', size: '320 KB', lastModified: '02/08/2025', sharedBy: 'Sarah Johnson', sharedByImage: '/images/adrian.png' }
        ]
    }
];

export const useFoldersStore = create((set, get) => ({
    // State
    folders: foldersData,
    selectedFolder: null,
    selectedFile: null,
    expandedFolders: [],
    selectedFiles: [],

    // Actions
    setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
    
    setSelectedFile: (fileId) => set({ selectedFile: fileId }),
    
    toggleFolder: (folderId) => set((state) => {
        // اگر فولدر باز بود، ببندش
        if (state.expandedFolders.includes(folderId)) {
            return {
                expandedFolders: []
            };
        }
        // اگر فولدر بسته بود، همه رو ببند و فقط این یکی رو باز کن
        return {
            expandedFolders: [folderId]
        };
    }),

    toggleFileSelection: (fileId) => set((state) => ({
        selectedFiles: state.selectedFiles.includes(fileId)
            ? state.selectedFiles.filter(id => id !== fileId)
            : [...state.selectedFiles, fileId]
    })),

    selectAllFiles: () => {
        const state = get();
        const currentFolder = state.folders.find(f => f.id === state.selectedFolder);
        if (!currentFolder) return;
        
        const allFileIds = currentFolder.files.map(f => f.id);
        set({
            selectedFiles: state.selectedFiles.length === allFileIds.length ? [] : allFileIds
        });
    },

    clearFileSelection: () => set({ selectedFiles: [] }),

    // Getters
    getSelectedFolderData: () => {
        const state = get();
        return state.folders.find(f => f.id === state.selectedFolder);
    },

    getCurrentFolderFiles: () => {
        const state = get();
        const folder = state.folders.find(f => f.id === state.selectedFolder);
        return folder ? folder.files : [];
    }
}));