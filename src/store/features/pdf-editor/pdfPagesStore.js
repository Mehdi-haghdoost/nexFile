import { create } from "zustand";
import usePdfAnnotationsStore from "@/store/features/pdf-editor/pdfAnnotationsStore";

const makePageId = () =>
    `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const clampPage = (page, totalPages) => {
    if (totalPages < 1) return 1;
    return Math.max(1, Math.min(page, totalPages));
};

/**
 * pdf.js exposes a fixed, read-only page list, so inserting or deleting a
 * page has no equivalent there. This store layers a "virtual" page list on
 * top: each entry has a stable id (used everywhere else as the annotation
 * key), a sourcePageNumber pointing into pdfDoc (null for a blank inserted
 * page), and its own rotation.
 */
const usePdfPagesStore = create((set, get) => ({
    pages: [],
    currentPage: 1,

    initializePages: (numPages) => {
        const pages = Array.from({ length: numPages }, (_, index) => ({
            id: makePageId(),
            sourcePageNumber: index + 1,
            rotation: 0,
        }));
        set({ pages, currentPage: 1 });
    },

    resetPages: () => set({ pages: [], currentPage: 1 }),

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
        });

        // Annotations must rotate with the page content, or a stroke drawn
        // over a word ends up floating over blank space after rotating.
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

        set({ pages, currentPage: insertAt + 1 });
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
        });

        usePdfAnnotationsStore.getState().clearPageAnnotations(pageId);
        return { success: true };
    },
}));

export default usePdfPagesStore;