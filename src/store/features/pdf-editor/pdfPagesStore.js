import { create } from "zustand";
import usePdfAnnotationsStore from "@/store/features/pdf-editor/pdfAnnotationsStore";

const makePageId = () =>
    `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const clampPage = (page, totalPages) => {
    if (totalPages < 1) return 1;
    return Math.max(1, Math.min(page, totalPages));
};

const usePdfPagesStore = create((set, get) => ({
    pages: [],
    currentPage: 1,
    hasStructuralChanges: false, // stays true until an explicit save clears it

    initializePages: (numPages) => {
        const pages = Array.from({ length: numPages }, (_, index) => ({
            id: makePageId(),
            sourcePageNumber: index + 1,
            rotation: 0,
        }));
        set({ pages, currentPage: 1, hasStructuralChanges: false });
    },

    resetPages: () => set({ pages: [], currentPage: 1, hasStructuralChanges: false }),

    setCurrentPage: (page) =>
        set((state) => ({ currentPage: clampPage(page, state.pages.length) })),

    rotatePage: (pageId, direction) => {
        const state = get();
        const delta = direction === "cw" ? 90 : -90;

        set({
            pages: state.pages.map((page) =>
                page.id === pageId
                    ? { ...page, rotation: (page.rotation + delta + 360) % 360 }
                    : page
            ),
            hasStructuralChanges: true,
        });

        // Keeps existing annotations attached to the same content after turning
        usePdfAnnotationsStore.getState().rotatePageAnnotations(pageId, direction);
    },

    addBlankPageAfter: (afterId) => {
        const state = get();
        const newEntry = { id: makePageId(), sourcePageNumber: null, rotation: 0 };

        const index = state.pages.findIndex((page) => page.id === afterId);
        const insertAt = index === -1 ? state.pages.length : index + 1;

        const pages = [
            ...state.pages.slice(0, insertAt),
            newEntry,
            ...state.pages.slice(insertAt),
        ];

        set({ pages, currentPage: insertAt + 1, hasStructuralChanges: true });
    },

    deletePage: (pageId) => {
        const state = get();

        if (state.pages.length <= 1) {
            return { success: false, reason: "last-page" };
        }

        const exists = state.pages.some((page) => page.id === pageId);
        if (!exists) return { success: false, reason: "not-found" };

        const pages = state.pages.filter((page) => page.id !== pageId);

        set({
            pages,
            currentPage: clampPage(state.currentPage, pages.length),
            hasStructuralChanges: true,
        });

        usePdfAnnotationsStore.getState().clearPageAnnotations(pageId);
        return { success: true };
    },

    // Called after a successful save
    markPagesSaved: () => set({ hasStructuralChanges: false }),
}));

export default usePdfPagesStore;