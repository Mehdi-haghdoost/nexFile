import { create } from "zustand";

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

const DEFAULT_TOOL_SETTINGS = {
    draw: { color: "#000000", opacity: 100, strokeWidth: 1 },
    highlight: { color: "#FFEB3B", opacity: 40, strokeWidth: 3 },
    text: { color: "#000000", fontSize: 14 },
};

const INITIAL_STATE = {
    activeEditingTool: null,
    currentPage: 1,
    totalPages: 0,
    zoomLevel: 100,
    toolSettingsByTool: DEFAULT_TOOL_SETTINGS,
    isEraserActive: false,

    activeTextFormatHandler: null,
    // { type, data } snapshot of the signature that clicking the page will
    // place next; persists across tool switches once first chosen.
    selectedSignature: null,

    fileId: null,
    fileName: "",
    pdfDoc: null,
    isDocumentLoading: false,
    documentError: null,
};

const clampPage = (page, totalPages) => {
    if (totalPages < 1) return 1;
    return Math.max(1, Math.min(page, totalPages));
};

const settingsKeyFor = (tool) => {
    if (tool === "highlight") return "highlight";
    if (tool === "addText") return "text";
    return "draw";
};

const usePdfEditorStore = create((set) => ({
    ...INITIAL_STATE,

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

    setToolColor: (color) =>
        set((state) => {
            const key = settingsKeyFor(state.activeEditingTool);
            return {
                toolSettingsByTool: {
                    ...state.toolSettingsByTool,
                    [key]: { ...state.toolSettingsByTool[key], color },
                },
            };
        }),

    setToolOpacity: (opacity) =>
        set((state) => {
            const key = settingsKeyFor(state.activeEditingTool);
            return {
                toolSettingsByTool: {
                    ...state.toolSettingsByTool,
                    [key]: { ...state.toolSettingsByTool[key], opacity },
                },
            };
        }),

    setToolStrokeWidth: (strokeWidth) =>
        set((state) => {
            const key = settingsKeyFor(state.activeEditingTool);
            return {
                toolSettingsByTool: {
                    ...state.toolSettingsByTool,
                    [key]: { ...state.toolSettingsByTool[key], strokeWidth },
                },
            };
        }),

    setToolFontSize: (fontSize) =>
        set((state) => {
            const key = settingsKeyFor(state.activeEditingTool);
            return {
                toolSettingsByTool: {
                    ...state.toolSettingsByTool,
                    [key]: { ...state.toolSettingsByTool[key], fontSize },
                },
            };
        }),

    toggleEraser: () => set((state) => ({ isEraserActive: !state.isEraserActive })),

    setActiveTextFormatHandler: (handler) => set({ activeTextFormatHandler: handler }),

    setSelectedSignature: (signature) => set({ selectedSignature: signature }),

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