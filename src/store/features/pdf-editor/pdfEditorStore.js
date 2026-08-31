import { create } from "zustand";

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

const DEFAULT_TOOL_SETTINGS = {
    draw: { color: "#000000", opacity: 100, strokeWidth: 1 },
    highlight: { color: "#FFEB3B", opacity: 40, strokeWidth: 3 },
    text: { color: "#000000", fontSize: 14 },
};

// currentPage/totalPages moved to pdfPagesStore, which owns the virtual
// page list that rotate/add/delete operate on.
const INITIAL_STATE = {
    activeEditingTool: null,
    zoomLevel: 100,
    toolSettingsByTool: DEFAULT_TOOL_SETTINGS,
    isEraserActive: false,

    activeTextFormatHandler: null,
    selectedSignature: null,

    fileId: null,
    fileName: "",
    pdfDoc: null,
    isDocumentLoading: false,
    documentError: null,
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
            isDocumentLoading: true,
            documentError: null,
        }),

    setDocument: ({ pdfDoc, fileName }) =>
        set({
            pdfDoc,
            fileName,
            isDocumentLoading: false,
            documentError: null,
        }),

    failDocumentLoad: (message) =>
        set({
            pdfDoc: null,
            isDocumentLoading: false,
            documentError: message,
        }),

    resetPdfEditor: () => set({ ...INITIAL_STATE }),
}));

export default usePdfEditorStore;