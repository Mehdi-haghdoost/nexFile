import { create } from "zustand";

export const HOME_SECTIONS = {
    ALL_FOLDERS: "all-folders",
    SIGNATURES: "signatures",
    SEND_AND_MONITOR: "send-and-monitor",
    SHARED: "shared",
    FILE_REQUESTS: "file-requests",
    DELETED_FILES: "deleted-files",
    ADMIN_CONSOLE: "admin-console",
};

/**
 * Which section of the home page is showing. Kept in a store rather than local
 * state so nested screens, such as the admin dashboard, can navigate between
 * sections without threading a setter down through every layer.
 */
const useHomeSectionStore = create((set) => ({
    activeSection: HOME_SECTIONS.ALL_FOLDERS,

    setActiveSection: (activeSection) => set({ activeSection }),

    resetSection: () => set({ activeSection: HOME_SECTIONS.ALL_FOLDERS }),
}));

export default useHomeSectionStore;