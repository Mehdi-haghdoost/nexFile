import { create } from "zustand";

const useModalStore = create((set, get) => ({
    // Modal State
    modals: {
        createFolder: {
            isOpen: false,
            data: null,
        },

        createFile: {
            isOpen: false,
            data: null,
        },

        uploadOrDrop: {
            isOpen: false,
            data: null,
        },

        editPdf: {
            isOpen: false,
            data: null,
        },

        shareFolder: {
            isOpen: false,
            data: null,
        },

        shareSettings: {
            isOpen: false, 
            data: null
        },

        createSignature: {
            isOpen: false,
            data: null
        },

        fileRequest: {
            isOpen: false,
            data: null
        },

        shareFileRequest: {
            isOpen: false,
            data: null
        },
        
        deletePermanent: {
            isOpen: false,
            data: null
        },

        createTransfer: {
            isOpen: false,
            data: null
        },

    },

    // Actions
    openModal: (modalName, data = null) => {
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: {
                    isOpen: true,
                    data,
                }
            }
        }))
    },

    closeModal: (modalName) => {
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: {
                    isOpen: false,
                    data: null,
                }
            },
        }))
    },

    closeAllModal: () => {
        set((state) => {
            const updatedModals = {};

            Object.keys(state.modals).forEach(modalName => {
                updatedModals[modalName] = {
                    isOpen: false,
                    data: null,
                }
            });
            return { modals: updatedModals };
        });
    },

    // Helper functions
    isModalOpen: (modalName) => {
        const state = get();
        return state.modals[modalName]?.isOpen || false;
    },

    getModalData: (modalName) => {
        const state = get();
        return state.modals[modalName]?.data || null;
    }

}));

export default useModalStore;