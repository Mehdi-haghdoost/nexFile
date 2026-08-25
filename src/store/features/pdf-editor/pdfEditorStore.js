import { create } from "zustand";

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

const DEFAULT_TOOL_SETTINGS = {
    color: "#000000",
    opacity: 100,
    strokeWidth: 1,
    isEraserActive: false,
};

const INITIAL_STATE = {
    activeEditingTool: null,
    currentPage: 1,
    totalPages: 0,
    zoomLevel: 100,
    toolSettings: DEFAULT_TOOL_SETTINGS,

    // Document. pdfDoc is a live pdf.js proxy object, not serialisable state:
    // it is kept here only so the viewer and the sidebar share one instance.
    fileId: null,
    fileName: "",
    pdfDoc: null,
    isDocumentLoading: false,
    documentError: null,
};

// Pages are 1-based. Before a document loads totalPages is 0, so the clamp
// must not pull currentPage down to zero.
const clampPage = (page, totalPages) => {
    if (totalPages < 1) return 1;
    return Math.max(1, Math.min(page, totalPages));
};

const usePdfEditorStore = create((set) => ({
    ...INITIAL_STATE,

    // Clicking the active tool again turns it off
    setActiveEditingTool: (tool) =>
        set((state) => ({
            activeEditingTool: state.activeEditingTool === tool ? null : tool,
        })),

    setCurrentPage: (page) =>
        set((state) => ({ currentPage: clampPage(page, state.totalPages) })),

    setTotalPages: (total) =>
        set((state) => ({
            totalPages: total,
            currentPage: clampPage(state.currentPage, total),
        })),

    setZoomLevel: (level) =>
        set({ zoomLevel: Math.max(MIN_ZOOM, Math.min(level, MAX_ZOOM)) }),

    zoomIn: () =>
        set((state) => ({
            zoomLevel: Math.min(state.zoomLevel + ZOOM_STEP, MAX_ZOOM),
        })),

    zoomOut: () =>
        set((state) => ({
            zoomLevel: Math.max(state.zoomLevel - ZOOM_STEP, MIN_ZOOM),
        })),

    // Tool settings live here because the annotation canvas reads them too
    setToolColor: (color) =>
        set((state) => ({ toolSettings: { ...state.toolSettings, color } })),

    setToolOpacity: (opacity) =>
        set((state) => ({ toolSettings: { ...state.toolSettings, opacity } })),

    setToolStrokeWidth: (strokeWidth) =>
        set((state) => ({ toolSettings: { ...state.toolSettings, strokeWidth } })),

    toggleEraser: () =>
        set((state) => ({
            toolSettings: {
                ...state.toolSettings,
                isEraserActive: !state.toolSettings.isEraserActive,
            },
        })),

    startDocumentLoad: (fileId) =>
        set({
            fileId,
            fileName: "",
            pdfDoc: null,
            totalPages: 0,
            currentPage: 1,
            isDocumentLoading: true,
            documentError: null,
        }),

    setDocument: ({ pdfDoc, fileName, totalPages }) =>
        set({
            pdfDoc,
            fileName,
            totalPages,
            currentPage: 1,
            isDocumentLoading: false,
            documentError: null,
        }),

    failDocumentLoad: (message) =>
        set({
            pdfDoc: null,
            totalPages: 0,
            isDocumentLoading: false,
            documentError: message,
        }),

    resetPdfEditor: () => set({ ...INITIAL_STATE }),
}));

export default usePdfEditorStore;